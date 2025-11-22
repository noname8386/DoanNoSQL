# Dự án xem phim (NoSQL - Firestore)

## Mô tả ngắn
- Website xem phim tĩnh chạy trên trình duyệt, dùng Firebase (Firestore + Authentication) cho dữ liệu và người dùng.
- Các trang chính: `fpt.html` (trang chủ), `film.html` (chi tiết phim), `login.html` (đăng nhập).
- Dữ liệu phim, đánh giá (rating) và bình luận (comment) lưu trong Firestore.

## Công nghệ
- HTML/CSS/JS thuần.
- Firebase Web SDK v8 (namespace `firebase`).
- Firestore, Authentication.

## Cấu trúc Firebase và Collection hiện có
Sau khi quét toàn bộ project (trừ thư mục `img`), các collection sử dụng:

- **movies**
  - movieId: string
  - title: string
  - type: string (ví dụ: "Phim bộ", "Phim lẻ", "Phim chiếu rạp", "Phim hoạt hình")
  - style: string (phong cách/nhánh phụ)
  - poster: string (đường dẫn ảnh)
  - videoSource: string (URL video, có thể là link online)
  - description: string
  - categories: string[] (ví dụ: ["phim_bo" | "phim_le" | "phim_chieu_rap" | "phim_hoat_hinh"])
  - createdAt: Timestamp (serverTimestamp)

- **ratings** (một người dùng chỉ có 1 rating cho 1 phim)
  - [documentId]: `${movieId}_${userId}`
  - movieId: string
  - userId: string
  - star: number (1..5)
  - timestamp: Timestamp (serverTimestamp)

- **comments** (hỗ trợ reply, like/dislike, soft delete)
  - movieId: string
  - userId: string
  - author: string
  - text: string
  - parentId: string | null (null = bình luận gốc; khác null = reply)
  - likes: string[] (mảng userId đã like)
  - dislikes: string[]
  - isDeleted: boolean (soft delete; có thể không có ở bản ghi cũ)
  - timestamp: Timestamp (serverTimestamp)

## Hướng dẫn kết nối Firebase
Dự án hiện dùng Firebase SDK v8 (cú pháp `firebase.initializeApp`, `firebase.firestore()`, `firebase.auth()`). Có 2 cách:

- Cách A: Dùng cấu hình có sẵn trong `review.js` (chạy ngay được)
  1. Mở `review.js`, phần `firebaseConfig` đã được điền sẵn.
  2. Đảm bảo các trang HTML đã import SDK v8:
     ```html
     <!-- Firebase SDK v8 -->
     <script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js"></script>
     <script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-auth.js"></script>
     <script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js"></script>
     ```
  3. `review.js` sẽ chạy `firebase.initializeApp(firebaseConfig);` và gán `window.db = firebase.firestore();`, `window.auth = firebase.auth();`. Các file khác (ví dụ `fpt.js`) dùng `window.db`.

- Cách B: Tự thay cấu hình Firebase của bạn
  1. Tạo project Firebase và bật Firestore + Authentication (Email/Password nếu dùng đăng nhập email).
  2. Vào Project settings > Your apps (Web) > Lấy `firebaseConfig`.
  3. Thay `firebaseConfig` trong `review.js` bằng thông tin của bạn.
  4. Giữ nguyên import SDK v8 như ở trên.

Lưu ý: Nếu bạn muốn chuyển sang SDK v9 (modular), cần đổi toàn bộ cú pháp trong code. Hiện dự án hoạt động với v8.

## Khởi tạo dữ liệu mẫu (seed)
- Khi vào trang `fpt.html`, nếu collection `movies` đang rỗng, hàm `seedDatabase()` trong `review.js` sẽ tạo dữ liệu mẫu (khoảng 80 phim, chia theo 4 nhóm) với `videoSource` là một link video mẫu online.
- Ảnh poster trỏ đến `img/...` trong dự án; đảm bảo thư mục ảnh vẫn giữ nguyên cấu trúc.

## Cách chạy dự án
- Dự án là web tĩnh, chỉ cần phục vụ file tĩnh qua HTTP.
- Khuyến nghị dùng Live Server (VS Code) hoặc bất kỳ static server nào:
  - Mở dự án bằng VS Code.
  - Cài extension Live Server (nếu chưa có).
  - Chuột phải `fpt.html` > "Open with Live Server".
- Truy cập `film.html?id=<movieId>` để xem chi tiết phim, `login.html` để đăng nhập.

## Quy tắc bảo mật Firestore (gợi ý cơ bản để phát triển)
Tùy nhu cầu, bạn nên cấu hình rules an toàn. Ví dụ phát triển (chưa tối ưu bảo mật):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /movies/{doc} {
      allow read;  // công khai xem phim
      allow write: if false; // không cho ghi trực tiếp từ client (trừ khi bạn cần)
    }
    match /ratings/{doc} {
      allow read;
      allow write: if request.auth != null &&
                   request.resource.data.userId == request.auth.uid;
    }
    match /comments/{doc} {
      allow read;
      allow create: if request.auth != null &&
                    request.resource.data.userId == request.auth.uid;
      allow update, delete: if request.auth != null &&
                             resource.data.userId == request.auth.uid;
    }
  }
}
```
Hãy điều chỉnh theo yêu cầu thực tế của bạn.

## Ghi chú
- Code đang sử dụng `window.db` và `window.auth` được khởi tạo trong `review.js`. Đảm bảo mọi trang cần Firestore đều import `review.js` sau khi import SDK.
- Nếu bạn đổi cấu hình Firebase, nhớ kiểm tra lại Authorized domains trong phần Authentication.
