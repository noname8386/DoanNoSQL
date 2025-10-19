# Hướng Dẫn Tích Hợp Firebase Firestore

## Giới thiệu
Tài liệu này hướng dẫn cách tích hợp Firebase Firestore vào hệ thống đánh giá và bình luận phim.

## Bước 1: Tạo Project Firebase

1. Truy cập https://console.firebase.google.com/
2. Nhấp "Add project" để tạo project mới
3. Đặt tên project (vd: "movie-review-system")
4. Thiết lập Google Analytics (tùy chọn)
5. Nhấp "Create project"

## Bước 2: Đăng ký Web App

1. Trong Firebase Console, chọn biểu tượng Web (</>) để thêm Firebase vào web app
2. Đặt tên cho app (vd: "Movie Review Web")
3. Sao chép Firebase configuration object

## Bước 3: Kích hoạt Firestore

1. Trong Firebase Console, vào menu "Firestore Database"
2. Nhấp "Create database"
3. Chọn chế độ:
   - **Test mode**: Cho phép đọc/ghi tự do (dùng cho development)
   - **Production mode**: Yêu cầu authentication
4. Chọn location gần nhất (asia-southeast1 cho Việt Nam)

## Bước 4: Thêm Firebase SDK vào HTML

Thêm các script sau vào file `fpt.html` trước thẻ `</body>`:

```html
<!-- Firebase App (the core Firebase SDK) -->
<script src="https://www.gstatic.com/firebasejs/9.x.x/firebase-app-compat.js"></script>

<!-- Firebase Firestore -->
<script src="https://www.gstatic.com/firebasejs/9.x.x/firebase-firestore-compat.js"></script>

<!-- Firebase Authentication (nếu cần đăng nhập) -->
<script src="https://www.gstatic.com/firebasejs/9.x.x/firebase-auth-compat.js"></script>
```

**Lưu ý**: Thay `9.x.x` bằng phiên bản mới nhất từ https://firebase.google.com/docs/web/setup

## Bước 5: Cấu hình Firebase trong review.js

Mở file `review.js` và bỏ comment phần Firebase configuration:

```javascript
// Firebase Configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
```

## Bước 6: Thiết kế Cấu trúc Database

### Collection: `movies`
```javascript
{
    movieId: "movie_001",
    title: "Bạn Trai Tôi Là Hồ Ly",
    averageRating: 4.5,
    totalRatings: 128,
    createdAt: timestamp
}
```

### Collection: `ratings`
```javascript
{
    movieId: "movie_001",
    userId: "user_123",
    rating: 5,
    timestamp: serverTimestamp
}
```

### Collection: `comments`
```javascript
{
    commentId: "comment_001",
    movieId: "movie_001",
    userId: "user_123",
    author: "Nguyễn Văn A",
    rating: 5,
    text: "Phim rất hay!",
    likes: 24,
    timestamp: serverTimestamp
}
```

## Bước 7: Cài đặt Security Rules

Trong Firebase Console > Firestore Database > Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Movies collection - Read only
    match /movies/{movieId} {
      allow read: if true;
      allow write: if false; // Admin only via backend
    }
    
    // Ratings collection
    match /ratings/{ratingId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null 
                              && request.auth.uid == resource.data.userId;
    }
    
    // Comments collection
    match /comments/{commentId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null 
                              && request.auth.uid == resource.data.userId;
    }
  }
}
```

## Bước 8: Triển khai Functions

### Lưu Đánh giá
```javascript
function saveRatingToFirestore(movieId, userId, rating) {
    return db.collection('ratings').add({
        movieId: movieId,
        userId: userId,
        rating: rating,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        // Cập nhật average rating
        return updateAverageRating(movieId);
    });
}
```

### Lưu Bình luận
```javascript
function saveCommentToFirestore(movieId, userId, comment) {
    return db.collection('comments').add({
        movieId: movieId,
        userId: userId,
        author: comment.author,
        rating: comment.rating,
        text: comment.text,
        likes: 0,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
}
```

### Tải Bình luận
```javascript
function loadCommentsFromFirestore(movieId, limit = 10) {
    return db.collection('comments')
        .where('movieId', '==', movieId)
        .orderBy('timestamp', 'desc')
        .limit(limit)
        .get()
        .then(snapshot => {
            const comments = [];
            snapshot.forEach(doc => {
                comments.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            return comments;
        });
}
```

### Tính Trung bình Rating
```javascript
function updateAverageRating(movieId) {
    return db.collection('ratings')
        .where('movieId', '==', movieId)
        .get()
        .then(snapshot => {
            let total = 0;
            let count = 0;
            
            snapshot.forEach(doc => {
                total += doc.data().rating;
                count++;
            });
            
            const average = count > 0 ? (total / count).toFixed(1) : 0;
            
            // Cập nhật vào collection movies
            return db.collection('movies').doc(movieId).update({
                averageRating: parseFloat(average),
                totalRatings: count
            });
        });
}
```

## Bước 9: Tích hợp Authentication (Tùy chọn)

Nếu muốn yêu cầu đăng nhập trước khi đánh giá:

```javascript
// Đăng nhập anonymous
function signInAnonymously() {
    firebase.auth().signInAnonymously()
        .then(() => {
            console.log('Signed in anonymously');
        })
        .catch((error) => {
            console.error('Error signing in:', error);
        });
}

// Kiểm tra trạng thái đăng nhập
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // User is signed in
        console.log('User ID:', user.uid);
    } else {
        // User is signed out
        signInAnonymously();
    }
});
```

## Bước 10: Testing

1. Mở file `fpt.html` trong trình duyệt
2. Nhấp vào một bộ phim để xem
3. Thử đánh giá sao và viết bình luận
4. Kiểm tra Firebase Console để xem dữ liệu đã được lưu

## Các Tính năng Nâng cao

### 1. Real-time Updates
```javascript
db.collection('comments')
    .where('movieId', '==', movieId)
    .orderBy('timestamp', 'desc')
    .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
                const comment = change.doc.data();
                addCommentToUI(comment);
            }
        });
    });
```

### 2. Pagination
```javascript
let lastVisible = null;

function loadMoreComments() {
    let query = db.collection('comments')
        .where('movieId', '==', movieId)
        .orderBy('timestamp', 'desc')
        .limit(10);
    
    if (lastVisible) {
        query = query.startAfter(lastVisible);
    }
    
    return query.get().then(snapshot => {
        lastVisible = snapshot.docs[snapshot.docs.length - 1];
        // Process comments...
    });
}
```

### 3. Like/Unlike Comments
```javascript
function toggleLikeComment(commentId, userId) {
    const commentRef = db.collection('comments').doc(commentId);
    const likeRef = db.collection('likes').doc(`${commentId}_${userId}`);
    
    return db.runTransaction((transaction) => {
        return transaction.get(likeRef).then((likeDoc) => {
            if (likeDoc.exists) {
                // Unlike
                transaction.delete(likeRef);
                transaction.update(commentRef, {
                    likes: firebase.firestore.FieldValue.increment(-1)
                });
            } else {
                // Like
                transaction.set(likeRef, {
                    commentId: commentId,
                    userId: userId,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                });
                transaction.update(commentRef, {
                    likes: firebase.firestore.FieldValue.increment(1)
                });
            }
        });
    });
}
```

## Lưu ý Quan trọng

1. **API Keys**: Không commit Firebase config trực tiếp vào Git. Sử dụng environment variables
2. **Security Rules**: Luôn kiểm tra và cập nhật rules để bảo vệ dữ liệu
3. **Quota**: Firebase free tier có giới hạn. Theo dõi usage trong Console
4. **Indexes**: Tạo composite indexes nếu query phức tạp
5. **Error Handling**: Luôn xử lý errors trong promises/async functions

## Tài liệu Tham khảo

- Firebase Documentation: https://firebase.google.com/docs
- Firestore Getting Started: https://firebase.google.com/docs/firestore
- Security Rules: https://firebase.google.com/docs/firestore/security/get-started
- Best Practices: https://firebase.google.com/docs/firestore/best-practices

## Hỗ trợ

Nếu gặp vấn đề, kiểm tra:
1. Console log trong browser (F12)
2. Firebase Console > Firestore > Usage tab
3. Network tab để xem API calls
4. Firebase Console > Firestore > Rules để verify permissions
