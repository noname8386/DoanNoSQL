// fpt.js - Đã xóa sạch lỗi dư dấu ngoặc

var lastDocs = {
    phim_bo: null, phim_le: null, phim_chieu_rap: null, phim_hoat_hinh: null,
    top_phim_bo: null, top_phim_le: null, top_phim_chieu_rap: null, top_phim_hoat_hinh: null
};

const categoryMap = {
    0: 'phim_bo', 1: 'phim_le', 2: 'phim_chieu_rap', 3: 'phim_hoat_hinh',
    4: 'phim_bo', 5: 'phim_le', 6: 'phim_chieu_rap', 7: 'phim_hoat_hinh'
};

const selectorMap = {
    0: '.top__phim__bo__area', 1: '.top__phim__le__area', 
    2: '.top__phim__chieu__rap__area', 3: '.top__phim__hoat__hinh__area',
    4: '.film__area__box--phim__bo', 5: '.film__area__box--phim__le', 
    6: '.film__area__box--phim__chieu__rap', 7: '.film__area__box--phim__hoat__hinh'
};

function createMovieHTML(data) {
    return `
    <div id__phim="${data.movieId}" onclick="window.location.href='film.html?id=${data.movieId}'" class="phim phim__appear">
        <div class="phim__img" style="background-image: url('${data.poster}')"></div>
        <div class="phim__content">
            <div class="phim__title">${data.title}</div>
            <div class="phim__type">${data.type}</div>
            <div class="phim__style">${data.style}</div>
        </div>
    </div>`;
}

async function loadMoviesFromFirestore() {
    console.log("🚀 Bắt đầu vẽ giao diện phim...");
    if (!window.db) { console.error("Chưa kết nối Database!"); return; }

    await loadSection('phim_bo', '.top__phim__bo__area', 4, false);
    await loadSection('phim_le', '.top__phim__le__area', 4, false);
    await loadSection('phim_chieu_rap', '.top__phim__chieu__rap__area', 4, false);
    await loadSection('phim_hoat_hinh', '.top__phim__hoat__hinh__area', 4, false);

    await loadSection('phim_bo', '.film__area__box--phim__bo', 10, true);
    await loadSection('phim_le', '.film__area__box--phim__le', 10, true);
    await loadSection('phim_chieu_rap', '.film__area__box--phim__chieu__rap', 10, true);
    await loadSection('phim_hoat_hinh', '.film__area__box--phim__hoat__hinh', 10, true);

    const loadScreen = document.querySelector('.load');
    if(loadScreen) loadScreen.style.display = 'none';
}

async function loadSection(categoryCode, selector, limit, saveToMainCursor) {
    const container = document.querySelector(selector);
    if (!container) return;
    container.innerHTML = ''; 

    try {
        const snapshot = await window.db.collection('movies')
            .where('categories', 'array-contains', categoryCode)
            .limit(limit)
            .get();

        if (snapshot.empty) {
            container.innerHTML = '<p style="color:white; padding:10px">Đang cập nhật...</p>';
            return;
        }

        if (saveToMainCursor) {
            lastDocs[categoryCode] = snapshot.docs[snapshot.docs.length - 1];
        }

        snapshot.forEach(doc => {
            container.insertAdjacentHTML('beforeend', createMovieHTML(doc.data()));
        });
    } catch (error) {
        console.error(`Lỗi load ${categoryCode}:`, error);
    }
}

async function fill__next(btn, index) {
    const categoryCode = categoryMap[index];
    const selector = selectorMap[index];
    const container = document.querySelector(selector);
    
    if (!categoryCode || !container) return;
    if (index < 4) { alert("Đây là Top phim đề cử. Hãy xem thêm ở phần danh sách bên dưới!"); return; }
    if (!lastDocs[categoryCode]) { btn.innerText = "Đã hết phim"; btn.style.background = "#555"; return; }

    btn.innerText = "Đang tải...";
    try {
        const snapshot = await window.db.collection('movies')
            .where('categories', 'array-contains', categoryCode)
            .startAfter(lastDocs[categoryCode])
            .limit(10)
            .get();

        if (snapshot.empty) {
            btn.innerText = "Đã hết phim";
            btn.onclick = null;
            btn.style.background = "#555";
            lastDocs[categoryCode] = null;
            return;
        }

        lastDocs[categoryCode] = snapshot.docs[snapshot.docs.length - 1];
        snapshot.forEach(doc => {
            container.insertAdjacentHTML('beforeend', createMovieHTML(doc.data()));
        });
        btn.innerText = "Show"; 
    } catch (error) {
        console.error("Lỗi Load More:", error);
        btn.innerText = "Lỗi tải trang";
    }
}

function slide() {
    var i = 0;
    var slide = document.querySelectorAll('.slide');
    var slide__content = document.querySelectorAll('.slide__content');
    var slide__title = document.querySelectorAll('.slide__title');
    if(slide.length === 0) return;

    slide[i].style.visibility = 'visible';
    slide[i].style.opacity = '1';
    slide[i].style.backgroundSize = '100%';
    slide__content[i].classList.toggle('slide__content--animation');
    slide__title[i].classList.toggle('slide__title--animation');
    i++;

    setInterval(function() {
        if(i == 5) { i = 0; 
            slide[4].style.opacity = '0'; slide[4].style.backgroundSize = '110%'; slide[4].style.visibility = '';
            slide__content[4].classList.toggle('slide__content--animation'); slide__title[4].classList.toggle('slide__title--animation');
        } else {
            slide[i-1].style.opacity = '0'; slide[i-1].style.backgroundSize = '110%'; slide[i-1].style.visibility = '';
            slide__content[i-1].classList.toggle('slide__content--animation'); slide__title[i-1].classList.toggle('slide__title--animation');
        }
        slide[i].style.visibility = 'visible'; slide[i].style.opacity = '1'; slide[i].style.backgroundSize = '100%';
        slide__content[i].classList.toggle('slide__content--animation'); slide__title[i].classList.toggle('slide__title--animation');
        i++;
    }, 6000);
}
slide();

// ===== UI HELPERS (Form Đăng nhập, Search, Pass) =====

// Hàm tắt mọi popup và hiện lại trang chủ
function out() {
    // 1. Tắt Modal Login
    const modal = document.querySelector('.sign-login');
    if(modal) modal.style.display = 'none';
    
    // 2. Tắt Player Video
    const playArea = document.querySelector('.play__area');
    if(playArea) playArea.style.display = 'none';

    // 3. Tắt thông tin tài khoản
    const account = document.querySelector('.account');
    if(account) account.style.display = 'none';

    // 4. Hiện lại nội dung trang chủ
    document.querySelectorAll('body > div').forEach(div => {
        if (!div.classList.contains('sign-login') && 
            !div.classList.contains('play__area') &&
            !div.classList.contains('account') &&
            !div.classList.contains('load')) {
            div.style.display = '';
        }
    });
    
    // 5. Pause video nếu đang chạy
    var video = document.getElementById('video');
    if(video) video.pause();
}

// Gọi out() lần đầu để reset giao diện
out();

function call__dang__nhap() {
    console.log("Đang mở form đăng nhập...");
    const modal = document.querySelector('.sign-login');
    if(modal) {
        modal.style.display = 'flex';
        document.querySelector('.login__card').classList.remove('hide');
        document.querySelector('.sign__up__card').classList.add('hide');
    } else {
        console.error("Không tìm thấy div .sign-login");
    }
}

function show__pass(parentObj) {
    const input = parentObj.querySelector('input');
    if(input) input.type = (input.type === 'password') ? 'text' : 'password';
}

function chuyen__card__login__sign() {
    document.querySelector('.login__card').classList.toggle('hide');
    document.querySelector('.sign__up__card').classList.toggle('hide');
}

var inputSearch = document.getElementById('inputSearch');
function showInput() {
    if(inputSearch.style.display != 'block') inputSearch.style.display = 'block';
    else { inputSearch.style.display = 'none'; inputSearch.value = ''; }
}

function showheadermenu() {
    document.querySelector('.header__menu__hide').classList.toggle('hide');
}