// review.js - Full Code (Fix hiển thị số Like/Dislike)

const firebaseConfig = {
    apiKey: "AIzaSyBpRbOMOD0mIaNJof5Kn_LwjjXRdQak7JU",
    authDomain: "nosql-project-26b2e.firebaseapp.com",
    projectId: "nosql-project-26b2e",
    storageBucket: "nosql-project-26b2e.firebasestorage.app",
    messagingSenderId: "565935933516",
    appId: "1:565935933516:web:ae7930ffe8e81e9c70cce9",
    measurementId: "G-CSKW3JRVXX"
};

firebase.initializeApp(firebaseConfig);
window.db = firebase.firestore();
window.auth = firebase.auth();

let currentUser = null;
let currentMovieId = null;
let unsubscribeComments = null;

// Kiểm tra xem đang ở trang nào
const isLoginPage = window.location.pathname.includes('login.html');

// ===== 1. KHỞI TẠO =====
async function initApp() {
    if (isLoginPage) return;

    const snapshot = await window.db.collection('movies').limit(1).get();
    if (!snapshot.empty) {
        if (typeof loadMoviesFromFirestore === 'function') loadMoviesFromFirestore();
        return;
    }
    await seedDatabase();
}

// ===== 2. XỬ LÝ NGƯỜI DÙNG (AUTH) =====
window.auth.onAuthStateChanged(async (user) => {
    currentUser = user;

    if (user) {
        if (isLoginPage) {
            window.location.href = 'fpt.html';
            return;
        }

        const name = user.displayName || user.email;
        document.querySelectorAll('.header__account').forEach(el => {
            el.innerText = name; 
            el.onclick = function() {
                if(confirm("Đăng xuất tài khoản " + name + "?")) log();
            };
        });

        const accName = document.querySelector('.account__ten');
        const accEmail = document.querySelector('.account__email');
        if(accName) accName.innerText = name;
        if(accEmail) accEmail.innerText = user.email;

    } else {
        if (!isLoginPage) {
            document.querySelectorAll('.header__account').forEach(el => {
                el.innerText = 'LOGIN';
                el.onclick = function() {
                    window.location.href = 'login.html';
                };
            });
        }
    }
});

// Các hàm Đăng ký / Đăng nhập / Đăng xuất
async function dang__ky() {
    const name = document.querySelector('.sign__up-name').value;
    const email = document.querySelector('.sign__up-email').value;
    const pass = document.querySelector('.sign__up-password').value;
    const repass = document.querySelector('.sign__up-repassword').value;
    
    if(pass !== repass) { alert("Mật khẩu nhập lại không khớp!"); return; }

    try {
        const cred = await window.auth.createUserWithEmailAndPassword(email, pass);
        await cred.user.updateProfile({displayName: name});
        await window.db.collection('users').doc(cred.user.uid).set({name, email});
        alert("Đăng ký thành công! Đang chuyển hướng...");
    } catch(e) { alert("Lỗi: " + e.message); }
}

async function dang__nhap() {
    const email = document.querySelector('.login-name').value;
    const pass = document.querySelector('.login-password').value;
    try {
        await window.auth.signInWithEmailAndPassword(email, pass);
    } catch(e) { alert("Sai email hoặc mật khẩu!"); }
}

async function log() { 
    await window.auth.signOut(); 
    location.reload(); 
}

// ===== 3. LOGIC PHIM (SEED DATA) =====
async function seedDatabase() {
    const batch = window.db.batch();
    const categories = [
        { type: 'Phim bộ', code: 'phim_bo', styles: ['Hàn Quốc', 'Hoa Ngữ', 'Hồng Kông'] },
        { type: 'Phim lẻ', code: 'phim_le', styles: ['Hành Động', 'Tình Cảm', 'Hài Hước'] },
        { type: 'Phim chiếu rạp', code: 'phim_chieu_rap', styles: ['Bom Tấn', 'Kinh Dị', 'Phiêu Lưu'] },
        { type: 'Phim hoạt hình', code: 'phim_hoat_hinh', styles: ['Anime', '3D', 'Hài Hước'] }
    ];
    let count = 0;
    categories.forEach(cat => {
        for (let i = 1; i <= 20; i++) {
            const uniqueId = `movie_${cat.code}_${i}`;
            const docRef = window.db.collection('movies').doc(uniqueId);
            const imgIndex = Math.floor(Math.random() * 30) + 1;
            const style = cat.styles[Math.floor(Math.random() * cat.styles.length)];
            batch.set(docRef, {
                movieId: uniqueId, title: `${cat.type} ${i} - ${style}`, type: cat.type, style: style,
                poster: `img/img/Search/${imgIndex}.jpg`, videoSource: `img/video1.mp4`,
                description: `Mô tả phim...`, categories: [cat.code],
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            count++;
        }
    });
    await batch.commit();
    location.reload();
}

// ===== 4. PLAYER VIDEO & BÌNH LUẬN =====
window.play__video = async function(obj) {
    const mid = obj.getAttribute('id__phim');
    if(!mid) return;
    currentMovieId = mid;
    
    document.querySelectorAll('body>div').forEach(d => { if(!d.classList.contains('header')) d.style.display='none'; });
    document.querySelector('.play__area').style.display='block';
    window.scrollTo(0,0);

    const doc = await window.db.collection('movies').doc(mid).get();
    if(doc.exists) {
        const d = doc.data();
        document.querySelector('.play__info h3').innerText = d.title;
        document.querySelector('.play__info .info__content p:nth-of-type(2)').innerText = d.description;
        const posterDiv = document.querySelector('.play__info .info__img');
        if(posterDiv) posterDiv.style.backgroundImage = `url('${d.poster}')`;
        const video = document.getElementById('video');
        video.querySelector('source').src = d.videoSource || 'img/video1.mp4';
        video.load();
    }
    setupRealtimeComments(mid);
};

function setupRealtimeComments(movieId) {
    const list = document.getElementById('commentsList');
    const countLabel = document.getElementById('commentCount');
    list.innerHTML = '<p style="text-align:center; color:#888">Đang tải bình luận...</p>';

    if (unsubscribeComments) unsubscribeComments();

    unsubscribeComments = window.db.collection('comments')
        .where('movieId', '==', movieId)
        .orderBy('timestamp', 'asc')
        .onSnapshot((snapshot) => {
            countLabel.innerText = `(${snapshot.size})`;
            list.innerHTML = ''; 
            if (snapshot.empty) { list.innerHTML = '<p style="text-align:center; color:#777">Chưa có bình luận nào.</p>'; return; }

            const comments = [];
            snapshot.forEach(doc => comments.push({ id: doc.id, ...doc.data() }));

            comments.filter(c => !c.parentId).forEach(c => list.insertAdjacentHTML('afterbegin', createCommentHTML(c))); 
            comments.filter(c => c.parentId).forEach(c => {
                const replyList = document.getElementById(`replies-${c.parentId}`);
                if (replyList) replyList.insertAdjacentHTML('beforeend', createCommentHTML(c, true));
            });
        });
}

// ===> ĐÂY LÀ HÀM ĐÃ ĐƯỢC SỬA ĐỂ HIỆN SỐ LIKE <===
function createCommentHTML(c, isReply = false) {
    const avatarColor = stringToColor(c.author);
    const time = timeAgo(c.timestamp);
    const myId = currentUser ? currentUser.uid : null;
    
    // Kiểm tra trạng thái Like/Dislike
    const liked = c.likes && c.likes.includes(myId) ? 'active' : '';
    const disliked = c.dislikes && c.dislikes.includes(myId) ? 'active' : '';
    
    // Đếm số lượng (Nếu null thì là 0)
    const likeCount = c.likes ? c.likes.length : 0;
    const dislikeCount = c.dislikes ? c.dislikes.length : 0;

    const size = isReply ? '30px' : '40px';
    const fontSize = isReply ? '12px' : '16px';
    const itemId = `cmt-${c.id}`;

    return `
    <div class="comment__item" id="${itemId}">
        <div class="comment__flex-container">
            <div class="comment__avatar-img" style="width: ${size}; height: ${size}; background: ${avatarColor}; font-size: ${fontSize};">
                ${c.author.charAt(0).toUpperCase()}
            </div>
            
            <div style="flex: 1;"> 
                <div class="comment__box">
                    <a class="comment__author">${c.author}</a>
                    <div class="comment__text">${c.text}</div>
                </div>
                <div class="comment__actions">
                    <button class="action-btn ${liked}" onclick="toggleReaction('${c.id}', 'like')">
                        Like ${likeCount > 0 ? `(${likeCount})` : ''}
                    </button>
                    
                    <button class="action-btn ${disliked}" onclick="toggleReaction('${c.id}', 'dislike')">
                        Dislike ${dislikeCount > 0 ? `(${dislikeCount})` : ''}
                    </button>
                    
                    <button class="action-btn" onclick="showReplyInput('${c.id}')">Reply</button>
                    <span>${time}</span>
                </div>
            
                <div class="reply-input-container" id="input-${c.id}">
                    <div class="reply-input-wrapper">
                        <input type="text" class="reply-input" id="text-${c.id}" placeholder="Viết phản hồi...">
                        <button class="reply-send-btn" onclick="submitReply('${c.id}', '${!isReply ? c.id : c.parentId}')">➤</button>
                    </div>
                </div>
            </div>
        </div>

        ${!isReply ? `<div class="reply-list" id="replies-${c.id}"></div>` : ''}
    </div>`;
}

window.toggleReaction = async function(commentId, type) {
    if (!currentUser) { window.location.href = 'login.html'; return; }
    const ref = window.db.collection('comments').doc(commentId);
    const uid = currentUser.uid;
    
    await window.db.runTransaction(async (t) => {
        const doc = await t.get(ref);
        if (!doc.exists) return;
        const data = doc.data();
        let likes = data.likes || [];
        let dislikes = data.dislikes || [];
        
        if (type === 'like') {
            if (likes.includes(uid)) likes = likes.filter(id => id !== uid);
            else { likes.push(uid); dislikes = dislikes.filter(id => id !== uid); }
        } else {
            if (dislikes.includes(uid)) dislikes = dislikes.filter(id => id !== uid);
            else { dislikes.push(uid); likes = likes.filter(id => id !== uid); }
        }
        t.update(ref, { likes, dislikes });
    });
};

window.showReplyInput = function(commentId) {
    if (!currentUser) { window.location.href = 'login.html'; return; }
    const el = document.getElementById(`input-${commentId}`);
    document.querySelectorAll('.reply-input-container').forEach(d => { if(d.id !== `input-${commentId}`) d.style.display='none'; });
    el.style.display = (el.style.display === 'block') ? 'none' : 'block';
    if(el.style.display === 'block') document.getElementById(`text-${commentId}`).focus();
};

window.submitReply = async function(clickedId, rootParentId) {
    const input = document.getElementById(`text-${clickedId}`);
    const text = input.value.trim();
    if (!text) return;
    const finalParentId = rootParentId || clickedId;
    await window.db.collection('comments').add({
        movieId: currentMovieId, userId: currentUser.uid,
        author: currentUser.displayName || currentUser.email.split('@')[0],
        text: text, parentId: finalParentId,
        likes: [], dislikes: [], timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    input.value = '';
    document.getElementById(`input-${clickedId}`).style.display = 'none';
};

window.submitComment = async function() {
    if(!currentUser) { window.location.href = 'login.html'; return; }
    const txt = document.getElementById('commentInput').value.trim();
    if(!txt) return;
    await window.db.collection('comments').add({
        movieId: currentMovieId, userId: currentUser.uid,
        author: currentUser.displayName || currentUser.email.split('@')[0],
        text: txt, parentId: null,
        likes: [], dislikes: [], timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    document.getElementById('commentInput').value = '';
};

function timeAgo(ts) {
    if (!ts) return "Vừa xong";
    const s = Math.floor((new Date() - ts.toDate()) / 1000);
    if (s < 60) return "Vừa xong";
    if (s < 3600) return Math.floor(s/60) + " phút trước";
    if (s < 86400) return Math.floor(s/3600) + " giờ trước";
    return Math.floor(s/86400) + " ngày trước";
}
function stringToColor(str) {
    let hash = 0; for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    let color = '#'; for (let i = 0; i < 3; i++) color += ('00' + ((hash >> (i * 8)) & 0xFF).toString(16)).substr(-2);
    return color;
}

document.addEventListener('DOMContentLoaded', () => setTimeout(initApp, 500));