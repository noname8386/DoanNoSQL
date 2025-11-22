// review.js - Logic Data (Film, Auth, Comment, Rating)

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
let currentMovieId = null; // ID phim quan trọng nhất
let unsubscribeComments = null;
let userSelectedStar = 0;

const isLoginPage = window.location.pathname.includes('login.html');
const isFilmPage = window.location.pathname.includes('film.html');

// ===== 1. KHỞI TẠO =====
async function initApp() {
    if (isLoginPage) return;

    // A. NẾU Ở TRANG FILM
    if (isFilmPage) {
        // 1. Lấy ID từ URL
        const urlParams = new URLSearchParams(window.location.search);
        const mid = urlParams.get('id');
        
        if (!mid) {
            alert("Lỗi: Không tìm thấy ID phim!");
            window.location.href = 'fpt.html';
            return;
        }
        
        currentMovieId = mid; // Lưu ID ngay lập tức
        
        // 2. Tải dữ liệu phim
        await loadFilmDetail(mid);
        
        // 3. Kích hoạt bình luận và rating
        setupRealtimeComments(mid);
        loadRatings(mid);
        
        return;
    }

    // B. NẾU Ở TRANG CHỦ
    if (typeof loadMoviesFromFirestore === 'function') {
        loadMoviesFromFirestore();
    }
}

// ===== 2. LOAD CHI TIẾT PHIM =====
async function loadFilmDetail(mid) {
    try {
        const doc = await window.db.collection('movies').doc(mid).get();
        
        if (doc.exists) {
            const d = doc.data();
            // Điền dữ liệu vào HTML
            document.getElementById('filmTitle').innerText = d.title || "Chưa có tên";
            document.getElementById('filmDesc').innerText = d.description || "Chưa có mô tả";
            
            const posterDiv = document.getElementById('filmPoster');
            if(posterDiv) posterDiv.style.backgroundImage = `url('${d.poster}')`;
            
            // Xử lý Video (Nếu database không có link thì dùng video mẫu)
            const videoSrc = d.videoSource || 'img/video1.mp4';
            const video = document.getElementById('video');
            if(video) {
                video.querySelector('source').src = videoSrc;
                video.load();
            }
        } else {
            console.log("Không tìm thấy phim trong Database, dùng giao diện mặc định.");
        }
        
        // Nếu đã đăng nhập thì check xem user đã rate chưa
        if (currentUser) loadUserRating(mid);
        
    } catch (e) {
        console.error("Lỗi tải phim:", e);
    }
}

// ===== 3. AUTH (ĐĂNG NHẬP/ĐĂNG KÝ) =====
window.auth.onAuthStateChanged(async (user) => {
    currentUser = user;
    const btns = document.querySelectorAll('.header__account');

    if (user) {
        const name = user.displayName || user.email;
        btns.forEach(el => {
            el.innerText = name; 
            el.onclick = () => { if(confirm("Đăng xuất?")) log(); };
        });
        
        // Load lại rating nếu đang ở trang phim
        if (isFilmPage && currentMovieId) loadUserRating(currentMovieId);
    } else {
        btns.forEach(el => {
            el.innerText = 'LOGIN';
            el.onclick = () => window.location.href = 'login.html';
        });
        resetStarUI();
    }
});

async function log() { await window.auth.signOut(); location.reload(); }

async function dang__ky() {
    const name = document.querySelector('.sign__up-name').value;
    const email = document.querySelector('.sign__up-email').value;
    const pass = document.querySelector('.sign__up-password').value;
    try {
        const cred = await window.auth.createUserWithEmailAndPassword(email, pass);
        await cred.user.updateProfile({displayName: name});
        await window.db.collection('users').doc(cred.user.uid).set({name, email});
        alert("Đăng ký thành công!"); window.location.href='fpt.html';
    } catch(e) { alert(e.message); }
}
async function dang__nhap() {
    const email = document.querySelector('.login-name').value;
    const pass = document.querySelector('.login-password').value;
    try {
        await window.auth.signInWithEmailAndPassword(email, pass);
        window.location.href = 'fpt.html';
    } catch(e) { alert("Sai thông tin!"); }
}

// ===== 4. RATING =====
window.submitRating = async function(star) {
    if (!currentUser) { window.location.href='login.html'; return; }
    try {
        const ratingId = `${currentMovieId}_${currentUser.uid}`;
        await window.db.collection('ratings').doc(ratingId).set({
            movieId: currentMovieId, userId: currentUser.uid, star: star,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        userSelectedStar = star; resetStar(); 
        document.getElementById('ratingMessage').innerText = `Bạn đã đánh giá ${star} sao!`;
        document.getElementById('ratingMessage').style.color = "#ffcc00";
        loadRatings(currentMovieId);
    } catch (e) { alert(e.message); }
};

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
    const doc = await window.db.collection('ratings').doc(`${mid}_${currentUser.uid}`).get();
    if (doc.exists) {
        userSelectedStar = doc.data().star; resetStar();
        document.getElementById('ratingMessage').innerText = `Bạn đã đánh giá ${userSelectedStar} sao.`;
    }
}

window.hoverStar = function(star) {
    document.querySelectorAll('.star__rating i').forEach((s, i) => s.classList.toggle('hovered', i < star));
};
window.resetStar = function() {
    document.querySelectorAll('.star__rating i').forEach((s, i) => {
        s.classList.remove('hovered');
        s.classList.toggle('selected', i < userSelectedStar);
    });
};
function resetStarUI() {
    document.querySelectorAll('.star__rating i').forEach(s => {
        s.classList.remove('selected'); s.classList.remove('hovered');
    });
    const msg = document.getElementById('ratingMessage');
    if(msg) { msg.innerText = "Chọn số sao để đánh giá"; msg.style.color = "#888"; }
}

// ===== 5. COMMENTS (REAL-TIME) =====
function setupRealtimeComments(movieId) {
    const list = document.getElementById('commentsList');
    const countLabel = document.getElementById('commentCount');
    list.innerHTML = '<p style="text-align:center; color:#888">Đang tải bình luận...</p>';

    if (unsubscribeComments) unsubscribeComments();

    unsubscribeComments = window.db.collection('comments')
        .where('movieId', '==', movieId)
        .orderBy('timestamp', 'asc')
        .onSnapshot(snap => {
            countLabel.innerText = `(${snap.size})`; list.innerHTML = '';
            if(snap.empty) { list.innerHTML = '<p style="text-align:center; color:#777">Chưa có bình luận nào.</p>'; return; }
            
            const comments = []; 
            snap.forEach(d => comments.push({id:d.id, ...d.data()}));
            
            comments.filter(c=>!c.parentId).forEach(c=>list.insertAdjacentHTML('afterbegin', createCommentHTML(c)));
            comments.filter(c=>c.parentId).forEach(c=> {
                const el = document.getElementById(`replies-${c.parentId}`);
                if(el) el.insertAdjacentHTML('beforeend', createCommentHTML(c, true));
            });
        });
}

function createCommentHTML(c, isReply = false) {
    const isDel = c.isDeleted;
    const name = isDel ? "Người dùng ẩn danh" : c.author;
    const text = isDel ? "Bình luận đã bị xóa" : c.text;
    const avatar = name.charAt(0).toUpperCase();
    const time = timeAgo(c.timestamp);
    const size = isReply ? '30px' : '40px';
    
    let actions = '';
    if (!isDel) {
        const liked = c.likes && c.likes.includes(currentUser?.uid) ? 'active' : '';
        const disliked = c.dislikes && c.dislikes.includes(currentUser?.uid) ? 'active' : '';
        let owner = '';
        if (currentUser && c.userId === currentUser.uid) {
            owner = `<button class="action-btn edit" onclick="showEdit('${c.id}')">Sửa</button>
                     <button class="action-btn delete" onclick="deleteComment('${c.id}')">Xóa</button>`;
        }
        actions = `
            <div class="comment__actions">
                <button class="action-btn ${liked}" onclick="toggleReaction('${c.id}','like')">Like ${c.likes?.length||''}</button>
                <button class="action-btn ${disliked}" onclick="toggleReaction('${c.id}','dislike')">Dislike ${c.dislikes?.length||''}</button>
                <button class="action-btn" onclick="showReplyInput('${c.id}')">Reply</button>
                ${owner} <span>${time}</span>
            </div>`;
    } else { actions = `<div class="comment__actions"><span>${time}</span></div>`; }

    return `
    <div class="comment__item" id="cmt-${c.id}">
        <div class="comment__flex-container">
            <div class="comment__avatar-img" style="width:${size};height:${size};background:${stringToColor(name)};">${avatar}</div>
            <div style="flex:1">
                <div class="comment__box ${isDel?'deleted':''}">
                    <a class="comment__author">${name}</a>
                    <div class="comment__text ${isDel?'deleted-text':''}" id="text-${c.id}">${text}</div>
                    ${!isDel?`<div class="edit-input-container" id="edit-wrap-${c.id}">
                        <div class="reply-input-wrapper">
                            <input class="reply-input" id="edit-input-${c.id}" value="${c.text}">
                            <button class="reply-send-btn" onclick="submitEdit('${c.id}')">✓</button>
                            <button class="reply-send-btn" onclick="cancelEdit('${c.id}')" style="color:#888">✕</button>
                        </div>
                    </div>`:''}
                </div>
                ${actions}
                <div class="reply-input-container" id="input-${c.id}">
                    <div class="reply-input-wrapper">
                        <input type="text" class="reply-input" id="reply-text-${c.id}" placeholder="Viết phản hồi...">
                        <button class="reply-send-btn" onclick="submitReply('${c.id}', '${!isReply?c.id:c.parentId}')">➤</button>
                    </div>
                </div>
            </div>
        </div>
        ${!isReply ? `<div class="reply-list" id="replies-${c.id}"></div>` : ''}
    </div>`;
}

window.toggleReaction = async (id, type) => {
    if (!currentUser) { window.location.href='login.html'; return; }
    const ref = window.db.collection('comments').doc(id);
    const uid = currentUser.uid;
    await window.db.runTransaction(async t => {
        const doc = await t.get(ref);
        let likes = doc.data().likes || [];
        let dislikes = doc.data().dislikes || [];
        if (type==='like') {
            if(likes.includes(uid)) likes = likes.filter(i=>i!==uid);
            else { likes.push(uid); dislikes = dislikes.filter(i=>i!==uid); }
        } else {
            if(dislikes.includes(uid)) dislikes = dislikes.filter(i=>i!==uid);
            else { dislikes.push(uid); likes = likes.filter(i=>i!==uid); }
        }
        t.update(ref, {likes, dislikes});
    });
};

window.deleteComment = async (id) => {
    if(!confirm("Xóa bình luận?")) return;
    await window.db.collection('comments').doc(id).update({ isDeleted: true, text: "Đã xóa", likes:[], dislikes:[] });
};
window.showEditInput = (id) => {
    document.getElementById(`text-${id}`).style.display='none';
    document.getElementById(`edit-wrap-${id}`).style.display='block';
};
window.cancelEdit = (id) => {
    document.getElementById(`text-${id}`).style.display='block';
    document.getElementById(`edit-wrap-${id}`).style.display='none';
};
window.submitEdit = async (id) => {
    const val = document.getElementById(`edit-input-${id}`).value.trim();
    if(val) await window.db.collection('comments').doc(id).update({text:val});
    cancelEdit(id);
};
window.showReplyInput = (id) => {
    if(!currentUser) { window.location.href='login.html'; return; }
    const el = document.getElementById(`input-${id}`);
    document.querySelectorAll('.reply-input-container').forEach(e => { if(e!==el && !e.id.startsWith('edit')) e.style.display='none'; });
    el.style.display = el.style.display==='block'?'none':'block';
};
window.submitReply = async (clickedId, rootId) => {
    const val = document.getElementById(`reply-text-${clickedId}`).value.trim();
    if(val) {
        await window.db.collection('comments').add({
            movieId: currentMovieId, userId: currentUser.uid, author: currentUser.displayName||"User",
            text: val, parentId: rootId, likes:[], dislikes:[], timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        document.getElementById(`reply-text-${clickedId}`).value='';
        document.getElementById(`input-${clickedId}`).style.display='none';
    }
};
window.submitComment = async () => {
    if(!currentUser) { window.location.href='login.html'; return; }
    const val = document.getElementById('commentInput').value.trim();
    if(val) {
        await window.db.collection('comments').add({
            movieId: currentMovieId, userId: currentUser.uid, author: currentUser.displayName||"User",
            text: val, parentId: null, likes:[], dislikes:[], timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        document.getElementById('commentInput').value='';
    }
};

// Helper
function timeAgo(ts) { if(!ts) return ""; const s = Math.floor((new Date()-ts.toDate())/1000); if(s<60) return "Vừa xong"; if(s<3600) return Math.floor(s/60)+" phút trước"; return Math.floor(s/3600)+" giờ trước"; }
function stringToColor(str) { let h=0; for(let i=0;i<str.length;i++) h=str.charCodeAt(i)+((h<<5)-h); let c='#'; for(let i=0;i<3;i++) c+=('00'+((h>>(i*8))&0xFF).toString(16)).substr(-2); return c; }

document.addEventListener('DOMContentLoaded', () => setTimeout(initApp, 500));