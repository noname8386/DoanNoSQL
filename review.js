// review.js - Full Code (Soft Delete Logic)

const firebaseConfig = {
    apiKey: "",
    authDomain: "nosql-project-26b2e.firebaseapp.com",
    projectId: "nosql-project-26b2e",
    storageBucket: "nosql-project-26b2e.firebasestorage.app",
    messagingSenderId: "565935933516",
    appId: "",
    measurementId: ""
};

firebase.initializeApp(firebaseConfig);
window.db = firebase.firestore();
window.auth = firebase.auth();

let currentUser = null;
let currentMovieId = null;
let unsubscribeComments = null;
let userSelectedStar = 0;

const isLoginPage = window.location.pathname.includes('login.html');

// ===== 1. INIT APP =====
async function initApp() {
    if (isLoginPage) return;

    const snapshot = await window.db.collection('movies').limit(1).get();
    if (!snapshot.empty) {
        if (typeof loadMoviesFromFirestore === 'function') loadMoviesFromFirestore();
        return;
    }
    await seedDatabase();
}


// ===== 2. AUTH =====
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
        
        if(currentMovieId) loadUserRating(currentMovieId);

    } else {
        if (!isLoginPage) {
            document.querySelectorAll('.header__account').forEach(el => {
                el.innerText = 'LOGIN';
                el.onclick = function() {
                    window.location.href = 'login.html';
                };
            });
        }
        resetStarUI();
    }
});

async function dang__ky() {
    const name = document.querySelector('.sign__up-name').value.trim();
    const email = document.querySelector('.sign__up-email').value.trim();
    const pass = document.querySelector('.sign__up-password').value;
    const repass = document.querySelector('.sign__up-repassword').value;
    
    if(pass !== repass) { alert("Mật khẩu không khớp!"); return; }

    try {
        const cred = await window.auth.createUserWithEmailAndPassword(email, pass);
        await cred.user.updateProfile({displayName: name});
        await window.db.collection('users').doc(cred.user.uid).set({name, email});
        alert("Đăng ký thành công! Đang chuyển hướng...");
    } catch(e) { alert("Lỗi: " + e.message); }
}

async function dang__nhap() {
    const email = document.querySelector('.login-name').value.trim();
    const pass = document.querySelector('.login-password').value;
    try {
        await window.auth.signInWithEmailAndPassword(email, pass);
    } catch(e) { alert("Sai email hoặc mật khẩu!"); }
}

async function log() { 
    await window.auth.signOut(); 
    location.reload(); 
}

// ===== 3. PLAYER =====
window.play__video = async function(obj) {
    const mid = obj.getAttribute('id__phim');
    if(!mid) return;
    
    currentMovieId = mid;
    userSelectedStar = 0;
    resetStarUI();
    
    if(document.getElementById('ratingMessage')) 
        document.getElementById('ratingMessage').innerText = "Đang tải đánh giá...";
    if(document.getElementById('averageRating')) 
        document.getElementById('averageRating').innerText = "--";

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
    loadRatings(mid);
    loadUserRating(mid);
};

// ===== 4. RATING =====
window.hoverStar = function(star) {
    const stars = document.querySelectorAll('.star__rating i');
    stars.forEach((s, index) => {
        if (index < star) s.classList.add('hovered');
        else s.classList.remove('hovered');
    });
}

window.resetStar = function() {
    const stars = document.querySelectorAll('.star__rating i');
    stars.forEach((s, index) => {
        s.classList.remove('hovered');
        if (index < userSelectedStar) s.classList.add('selected');
        else s.classList.remove('selected');
    });
}

window.submitRating = async function(star) {
    if (!currentUser) { window.location.href = 'login.html'; return; }

    try {
        const ratingId = `${currentMovieId}_${currentUser.uid}`;
        await window.db.collection('ratings').doc(ratingId).set({
            movieId: currentMovieId, userId: currentUser.uid, star: star,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        userSelectedStar = star; 
        resetStar(); 
        document.getElementById('ratingMessage').innerText = `Bạn đã đánh giá ${star} sao!`;
        document.getElementById('ratingMessage').style.color = "#ffcc00";
        loadRatings(currentMovieId);
    } catch (e) { alert("Lỗi: " + e.message); }
}

async function loadRatings(mid) {
    const snapshot = await window.db.collection('ratings').where('movieId', '==', mid).get();
    let total = 0, count = 0;
    snapshot.forEach(doc => { total += doc.data().star; count++; });
    const avg = count > 0 ? (total / count).toFixed(1) : 0;
    if(document.getElementById('averageRating')) {
        document.getElementById('averageRating').innerText = avg;
        document.getElementById('totalReviews').innerText = count;
    }
}

async function loadUserRating(mid) {
    if(!currentUser) return;
    const ratingId = `${mid}_${currentUser.uid}`;
    const doc = await window.db.collection('ratings').doc(ratingId).get();
    if (doc.exists) {
        userSelectedStar = doc.data().star;
        resetStar();
        document.getElementById('ratingMessage').innerText = `Bạn đã đánh giá ${userSelectedStar} sao.`;
    } else {
        userSelectedStar = 0;
        resetStarUI();
    }
}

function resetStarUI() {
    document.querySelectorAll('.star__rating i').forEach(s => {
        s.classList.remove('selected');
        s.classList.remove('hovered');
    });
    const msg = document.getElementById('ratingMessage');
    if(msg) {
        msg.innerText = "Chọn số sao để đánh giá";
        msg.style.color = "#888";
    }
}

// ===== 5. COMMENTS & EDIT/DELETE (SOFT DELETE) =====

// --- XÓA MỀM: Đổi trạng thái thành "Đã xóa" ---
window.deleteComment = async function(id) {
    if(!confirm("Bạn chắc chắn muốn xóa?")) return;
    
    try {
        // Chỉ cập nhật nội dung và trạng thái, không xóa document
        await window.db.collection('comments').doc(id).update({
            isDeleted: true,
            text: "Bình luận đã bị xóa",
            likes: [], // Xóa hết like
            dislikes: [] // Xóa hết dislike
        });
    } catch(e) { 
        console.error(e);
        alert("Lỗi: " + e.message); 
    }
}

window.showEditInput = function(id) {
    document.getElementById(`text-${id}`).style.display = 'none';
    document.getElementById(`edit-wrap-${id}`).style.display = 'block';
    const input = document.getElementById(`edit-input-${id}`);
    input.focus();
    const val = input.value; input.value = ''; input.value = val; 
}

window.cancelEdit = function(id) {
    document.getElementById(`text-${id}`).style.display = 'block';
    document.getElementById(`edit-wrap-${id}`).style.display = 'none';
}

window.submitEdit = async function(id) {
    const newVal = document.getElementById(`edit-input-${id}`).value.trim();
    if(!newVal) return;
    try {
        await window.db.collection('comments').doc(id).update({ text: newVal });
        cancelEdit(id);
    } catch(e) { alert("Lỗi cập nhật: " + e.message); }
}

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

// --- HIỂN THỊ BÌNH LUẬN (Xử lý isDeleted) ---
function createCommentHTML(c, isReply = false) {
    // Nếu đã xóa, ẩn thông tin người dùng gốc
    const isDel = c.isDeleted === true;
    const avatarColor = isDel ? "#555" : stringToColor(c.author);
    const authorName = isDel ? "Người dùng ẩn danh" : c.author;
    const avatarChar = isDel ? "?" : authorName.charAt(0).toUpperCase();
    const boxClass = isDel ? "comment__box deleted" : "comment__box";
    const textClass = isDel ? "comment__text deleted-text" : "comment__text";
    const contentText = isDel ? "Bình luận đã bị xóa" : c.text;

    const time = timeAgo(c.timestamp);
    const myId = currentUser ? currentUser.uid : null;
    const liked = c.likes && c.likes.includes(myId) ? 'active' : '';
    const disliked = c.dislikes && c.dislikes.includes(myId) ? 'active' : '';
    const likeCount = c.likes ? c.likes.length : 0;
    const dislikeCount = c.dislikes ? c.dislikes.length : 0;

    const size = isReply ? '30px' : '40px';
    const fontSize = isReply ? '12px' : '16px';
    const itemId = `cmt-${c.id}`;
    
    // Nút hành động (Nếu đã xóa thì ẩn hết)
    let actionsHTML = '';
    if (!isDel) {
        // Nút Sửa/Xóa cho chính chủ
        let ownerActions = '';
        if (currentUser && c.userId === currentUser.uid) {
            ownerActions = `
                <button class="action-btn edit" onclick="showEditInput('${c.id}')">Sửa</button>
                <button class="action-btn delete" onclick="deleteComment('${c.id}')">Xóa</button>
            `;
        }

        actionsHTML = `
            <div class="comment__actions">
                <button class="action-btn ${liked}" onclick="toggleReaction('${c.id}', 'like')">Like ${likeCount > 0 ? `(${likeCount})` : ''}</button>
                <button class="action-btn ${disliked}" onclick="toggleReaction('${c.id}', 'dislike')">Dislike ${dislikeCount > 0 ? `(${dislikeCount})` : ''}</button>
                <button class="action-btn" onclick="showReplyInput('${c.id}')">Reply</button>
                ${ownerActions}
                <span>${time}</span>
            </div>
        `;
    } else {
        // Nếu đã xóa chỉ hiện thời gian
        actionsHTML = `<div class="comment__actions"><span>${time}</span></div>`;
    }

    return `
    <div class="comment__item" id="${itemId}">
        <div class="comment__flex-container">
            <div class="comment__avatar-img" style="width: ${size}; height: ${size}; background: ${avatarColor}; font-size: ${fontSize};">
                ${avatarChar}
            </div>
            <div style="flex: 1;"> 
                <div class="${boxClass}">
                    <span class="comment__author">${authorName}</span>
                    
                    <div class="${textClass}" id="text-${c.id}">${contentText}</div>
                    
                    ${!isDel ? `
                    <div class="edit-input-container" id="edit-wrap-${c.id}">
                        <div class="reply-input-wrapper">
                            <input type="text" class="reply-input" id="edit-input-${c.id}" value="${c.text}">
                            <button class="reply-send-btn" onclick="submitEdit('${c.id}')"><i class="fas fa-check"></i></button>
                            <button class="reply-send-btn" onclick="cancelEdit('${c.id}')" style="color:#888"><i class="fas fa-times"></i></button>
                        </div>
                    </div>` : ''}
                </div>
                
                ${actionsHTML}
                
                <div class="reply-input-container" id="input-${c.id}">
                    <div class="reply-input-wrapper">
                        <input type="text" class="reply-input" id="reply-text-${c.id}" placeholder="Viết phản hồi...">
                        <button class="reply-send-btn" onclick="submitReply('${c.id}', '${!isReply ? c.id : c.parentId}')">➤</button>
                    </div>
                </div>
            </div>
        </div>
        ${!isReply ? `<div class="reply-list" id="replies-${c.id}"></div>` : ''}
    </div>`;
}

// Các hàm còn lại giữ nguyên
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
    document.querySelectorAll('.reply-input-container').forEach(d => { 
        if(d.id !== `input-${commentId}` && !d.id.startsWith('edit-wrap')) d.style.display='none'; 
    });
    el.style.display = (el.style.display === 'block') ? 'none' : 'block';
    if(el.style.display === 'block') document.getElementById(`reply-text-${commentId}`).focus();
};

window.submitReply = async function(clickedId, rootParentId) {
    const input = document.getElementById(`reply-text-${clickedId}`);
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

// SEED DATABASE
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

function call__dang__nhap() {
    window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', () => setTimeout(initApp, 500));