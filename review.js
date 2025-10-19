// ===== RATING & COMMENTS FUNCTIONALITY =====

// User Rating Stars
let userRating = 0;

// Initialize star rating functionality
document.addEventListener('DOMContentLoaded', function() {
    const stars = document.querySelectorAll('.star__rating i');
    const ratingMessage = document.getElementById('ratingMessage');
    
    stars.forEach((star, index) => {
        // Hover effect
        star.addEventListener('mouseenter', function() {
            highlightStars(index + 1);
        });
        
        // Click to rate
        star.addEventListener('click', function() {
            userRating = index + 1;
            setRating(userRating);
            updateRatingMessage(userRating);
        });
    });
    
    // Reset on mouse leave
    document.querySelector('.star__rating').addEventListener('mouseleave', function() {
        if (userRating > 0) {
            setRating(userRating);
        } else {
            clearStars();
        }
    });
});

// Highlight stars on hover
function highlightStars(count) {
    const stars = document.querySelectorAll('.star__rating i');
    stars.forEach((star, index) => {
        if (index < count) {
            star.classList.remove('far');
            star.classList.add('fas', 'active');
        } else {
            star.classList.remove('fas', 'active');
            star.classList.add('far');
        }
    });
}

// Set permanent rating
function setRating(count) {
    const stars = document.querySelectorAll('.star__rating i');
    stars.forEach((star, index) => {
        if (index < count) {
            star.classList.remove('far');
            star.classList.add('fas', 'active');
        } else {
            star.classList.remove('fas', 'active');
            star.classList.add('far');
        }
    });
}

// Clear all stars
function clearStars() {
    const stars = document.querySelectorAll('.star__rating i');
    stars.forEach(star => {
        star.classList.remove('fas', 'active');
        star.classList.add('far');
    });
}

// Update rating message
function updateRatingMessage(rating) {
    const messages = {
        1: 'Tệ',
        2: 'Không hay lắm',
        3: 'Bình thường',
        4: 'Hay',
        5: 'Xuất sắc!'
    };
    const ratingMessage = document.getElementById('ratingMessage');
    ratingMessage.textContent = `Bạn đã đánh giá ${rating} sao - ${messages[rating]}`;
    ratingMessage.style.color = '#ffc107';
    
    // Save rating (would integrate with Firebase here)
    console.log('User rating:', rating);
    // TODO: Save to Firebase Firestore
}

// Submit Comment
function submitComment() {
    const commentInput = document.getElementById('commentInput');
    const commentText = commentInput.value.trim();
    
    if (commentText === '') {
        alert('Vui lòng nhập nội dung bình luận');
        return;
    }
    
    if (userRating === 0) {
        alert('Vui lòng đánh giá phim trước khi bình luận');
        return;
    }
    
    // Create comment object
    const comment = {
        author: 'Người dùng', // Replace with actual user name from login
        rating: userRating,
        text: commentText,
        timestamp: new Date(),
        likes: 0
    };
    
    // Add comment to UI
    addCommentToUI(comment);
    
    // Clear form
    commentInput.value = '';
    
    // TODO: Save to Firebase Firestore
    console.log('New comment:', comment);
}

// Add comment to UI
function addCommentToUI(comment) {
    const commentsList = document.getElementById('commentsList');
    const commentItem = document.createElement('div');
    commentItem.classList.add('comment__item');
    
    // Generate star rating HTML
    let starsHTML = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= comment.rating) {
            starsHTML += '<i class="fas fa-star"></i>';
        } else {
            starsHTML += '<i class="far fa-star"></i>';
        }
    }
    
    // Format timestamp
    const timeAgo = getTimeAgo(comment.timestamp);
    
    commentItem.innerHTML = `
        <div class="comment__avatar">
            <i class="fas fa-user-circle"></i>
        </div>
        <div class="comment__content">
            <div class="comment__header">
                <span class="comment__author">${comment.author}</span>
                <span class="comment__rating">
                    ${starsHTML}
                </span>
                <span class="comment__time">${timeAgo}</span>
            </div>
            <p class="comment__text">${comment.text}</p>
            <div class="comment__actions">
                <button class="btn__like" onclick="likeComment(this)">
                    <i class="far fa-thumbs-up"></i> Thích <span>(${comment.likes})</span>
                </button>
                <button class="btn__reply">
                    <i class="far fa-comment"></i> Trả lời
                </button>
            </div>
        </div>
    `;
    
    // Insert at the beginning of the list
    commentsList.insertBefore(commentItem, commentsList.firstChild);
    
    // Update comment count
    updateCommentCount();
}

// Clear comment input
function clearComment() {
    document.getElementById('commentInput').value = '';
}

// Like comment
function likeComment(button) {
    const likeCount = button.querySelector('span');
    let count = parseInt(likeCount.textContent.replace(/[()]/g, ''));
    
    if (button.classList.contains('liked')) {
        // Unlike
        count--;
        button.classList.remove('liked');
        button.querySelector('i').classList.remove('fas');
        button.querySelector('i').classList.add('far');
    } else {
        // Like
        count++;
        button.classList.add('liked');
        button.querySelector('i').classList.remove('far');
        button.querySelector('i').classList.add('fas');
    }
    
    likeCount.textContent = `(${count})`;
    
    // TODO: Update in Firebase Firestore
}

// Load more comments
function loadMoreComments() {
    // TODO: Load more comments from Firebase Firestore
    console.log('Loading more comments...');
    alert('Đang tải thêm bình luận...');
}

// Helper function to get time ago
function getTimeAgo(timestamp) {
    const now = new Date();
    const diff = Math.floor((now - timestamp) / 1000); // difference in seconds
    
    if (diff < 60) {
        return 'Vừa xong';
    } else if (diff < 3600) {
        const minutes = Math.floor(diff / 60);
        return `${minutes} phút trước`;
    } else if (diff < 86400) {
        const hours = Math.floor(diff / 3600);
        return `${hours} giờ trước`;
    } else if (diff < 2592000) {
        const days = Math.floor(diff / 86400);
        return `${days} ngày trước`;
    } else {
        const months = Math.floor(diff / 2592000);
        return `${months} tháng trước`;
    }
}

// Update comment count
function updateCommentCount() {
    const commentsList = document.getElementById('commentsList');
    const commentCount = document.getElementById('commentCount');
    const count = commentsList.querySelectorAll('.comment__item').length;
    commentCount.textContent = `(${count})`;
}

// ===== FIREBASE INTEGRATION (TEMPLATE) =====
// Uncomment and configure when integrating with Firebase

/*
// Firebase Configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Save rating to Firestore
function saveRatingToFirestore(movieId, userId, rating) {
    return db.collection('ratings').add({
        movieId: movieId,
        userId: userId,
        rating: rating,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
}

// Save comment to Firestore
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

// Load comments from Firestore
function loadCommentsFromFirestore(movieId) {
    db.collection('comments')
        .where('movieId', '==', movieId)
        .orderBy('timestamp', 'desc')
        .limit(10)
        .get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                const comment = doc.data();
                addCommentToUI(comment);
            });
        });
}

// Calculate average rating
function calculateAverageRating(movieId) {
    db.collection('ratings')
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
            document.getElementById('averageRating').textContent = average;
            document.getElementById('totalReviews').textContent = count;
        });
}
*/
