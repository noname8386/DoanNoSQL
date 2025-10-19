
// var phim=document.querySelectorAll('.phim');
// console.log(phim);
// var phim__bo=document.querySelectorAll('.phim__bo');console.log(phim__bo)
// var phim__le=document.querySelectorAll('.phim__le');
// var phim__hoat__hinh=document.querySelectorAll('.phim__hoat__hinh');
// var phim__chieu__rap=document.querySelectorAll('.phim__chieu__rap');
// var top__phim=document.querySelectorAll('.top__phim__area');
// var area__phim=document.querySelectorAll('.film__area__box');console.log(area__phim);
// // console.log(phim__bo,phim__chieu__rap,phim__hoat__hinh,phim__le);
// var id__phim=0;
// for(var i=0;i<phim__bo.length;i++)
// {
//     // phim__bo[i].classList.toggle('phim__appear');
//     phim__bo[i].classList.add(`id__${id__phim}`);
//     phim__bo[i].setAttribute('id__phim',id__phim++);
// }
// for(var i=0;i<phim__le.length;i++)
// {
//     // phim__bo[i].classList.toggle('phim__appear');
//     phim__le[i].classList.add(`id__${id__phim}`);
//     phim__le[i].setAttribute('id__phim',id__phim++);
// }
// for(var i=0;i<phim__chieu__rap.length;i++)
// {
//     // phim__bo[i].classList.toggle('phim__appear');
//     phim__chieu__rap[i].classList.add(`id__${id__phim}`);
//     phim__chieu__rap[i].setAttribute('id__phim',id__phim++);
// }
// for(var i=0;i<phim__hoat__hinh.length;i++)
// {
//     // phim__bo[i].classList.toggle('phim__appear');
//     phim__hoat__hinh[i].classList.add(`id__${id__phim}`);
//     phim__hoat__hinh[i].setAttribute('id__phim',id__phim++);
// }
// var top__show=[4,4,4,4];
// function fill__data__top()
// {
//     // var top__phim=document.querySelectorAll('.top__phim__area');

//     var clone;
//     for(var i=0;i<4;i++)
//     {
//         clone=phim__bo[i].cloneNode(true);
//         clone.classList.toggle('rphim__appea');
//         top__phim[0].appendChild(clone);
//     }
//     for(var i=0;i<4;i++)
//     {
//         clone=phim__le[i].cloneNode(true);
//         clone.classList.toggle('phim__appear');
//         top__phim[1].appendChild(clone);
//     }
//     for(var i=0;i<4;i++)
//     {
//         clone=phim__chieu__rap[i].cloneNode(true);
//         clone.classList.toggle('phim__appear');
//         top__phim[2].appendChild(clone);
//     }
//     for(var i=0;i<4;i++)
//     {
//         clone=phim__hoat__hinh[i].cloneNode(true);
//         clone.classList.toggle('phim__appear');
//         top__phim[3].appendChild(clone);
//     }
// }
// // var sl__top=[5,5,5,5];








// var sl__area=[4,4,4,4,10,10,10,10];
// var sl__stop=[16,16,16,16,0,0,0,0];
// var next__click=[];
// // for(var i=0;i<)
// function fill__next(stt,title,fil,count)
// {
//     console.log(sl__area[stt]);
//     var area=document.querySelector(`.${title}`);
//     console.log(area);
//     var film=document.querySelectorAll(`.${fil}`);
//     var i=sl__area[stt];
//     var clone;
//     while(i<film.length&&i<sl__area[stt]+count)
//     {
//         clone=film[i++].cloneNode(true);
//         clone.classList.add('phim__appear');
//         area.appendChild(clone);
//     }
//     sl__area[stt]=i;
//     if(sl__stop[stt]!=0)
//     {
//         if(sl__stop[stt]==sl__area[stt])
//         {
//             document
//         }
//     }
// }
// // function top__phim__show(obj,j)
// // {

// //     if(j==0)
// //     {
// //         var i;
// //         for(i=top__show[j];i<top__show[j]+4;i++)
// //         {
// //             clone=phim__bo[i].cloneNode(true);
// //             clone.classList.toggle('phim__appear');
// //             top__phim[0].appendChild(clone);
// //         }
// //         top__show[j]=i;
// //         if(top__show[j]>=16)
// //         obj.style.display='none';
// //     }
// //     if(j==1)
// //     {
// //         var i;
// //         for(i=top__show[j];i<top__show[j]+4;i++)
// //         {
// //             clone=phim__le[i].cloneNode(true);
// //             clone.classList.toggle('phim__appear');
// //             top__phim[1].appendChild(clone);
// //         }
// //         top__show[j]=i;
// //         if(top__show[j]>=16)
// //         obj.style.display='none';

// //     }
// //     if(j==2)
// //     {
// //         var i;
// //         for(i=top__show[j];i<top__show[j]+4;i++)
// //         {
// //             clone=phim__chieu__rap[i].cloneNode(true);
// //         clone.classList.toggle('phim__appear');
// //         top__phim[2].appendChild(clone);
// //         }
// //         top__show[j]=i;
// //         if(top__show[j]>=16)
// //         obj.style.display='none';

// //     }
// //     if(j==3)
// //     {
// //         var i;
// //         for(i=top__show[j];i<top__show[j]+4;i++)
// //         {
// //             clone=phim__hoat__hinh[i].cloneNode(true);
// //         clone.classList.toggle('phim__appear');
// //         top__phim[3].appendChild(clone);
// //         }
// //         top__show[j]=i;
// //         if(top__show[j]>=16)
// //         obj.style.display='none';
// //     }
// // }

// var area__show=[10,10,10,10];
// function fill__data()
// {
//     var clone;

//     for(var i=0;i<10;i++)
//     {
//         clone=phim__bo[i].cloneNode(true);
//         clone.classList.toggle('phim__appear');
//         area__phim[0].appendChild(clone);
//     }
//     for(var i=0;i<10;i++)
//     {
//         clone=phim__le[i].cloneNode(true);
//         clone.classList.toggle('phim__appear');
//         area__phim[1].appendChild(clone);
//     }
//     for(var i=0;i<10;i++)
//     {
//         clone=phim__chieu__rap[i].cloneNode(true);
//         clone.classList.toggle('phim__appear');
//         area__phim[2].appendChild(clone);
//     }
//     for(var i=0;i<10;i++)
//     {
//         clone=phim__hoat__hinh[i].cloneNode(true);
//         clone.classList.toggle('phim__appear');
//         area__phim[3].appendChild(clone);
//     }
// }
 
var phim=document.querySelectorAll('.phim');


var j=1;
for(var i=0;i<phim.length;i++)
{
    if(j>30)
    j=1;
    // phim[i].addEventListener('onclick',play__video(this));
    phim[i].classList.add(`id__phim__${i}`);
    phim[i].setAttribute('id__phim',i);
    phim[i].classList.add('phim__appear');//hiêu ứng xuất hiện
    phim[i].querySelector('.phim>.phim__img').style.backgroundImage= `url('img/${j++}.jpg')`;
	
}
var phim__bo=document.querySelectorAll('.phim__bo');
var phim__le=document.querySelectorAll('.phim__le');
var phim__hoat__hinh=document.querySelectorAll('.phim__hoat__hinh');
var phim__chieu__rap=document.querySelectorAll('.phim__chieu__rap');
var top__phim=document.querySelectorAll('.top__phim__area');
var area__phim=document.querySelectorAll('.film__area__box');
function fill__data()
{
    for(var i=0;i<4;i++)
    top__phim[0].appendChild(phim__bo[i].cloneNode(true));
    for(var i=0;i<4;i++)
    top__phim[1].appendChild(phim__le[i].cloneNode(true));
    for(var i=0;i<4;i++)
    top__phim[2].appendChild(phim__chieu__rap[i].cloneNode(true));
    for(var i=0;i<4;i++)
    top__phim[3].appendChild(phim__hoat__hinh[i].cloneNode(true));
    for(var i=0;i<10;i++)
    area__phim[0].appendChild(phim__bo[i].cloneNode(true));
    for(var i=0;i<10;i++)
    area__phim[1].appendChild(phim__le[i].cloneNode(true));
    for(var i=0;i<10;i++)
    area__phim[2].appendChild(phim__chieu__rap[i].cloneNode(true));
    for(var i=0;i<10;i++)
    area__phim[3].appendChild(phim__hoat__hinh[i].cloneNode(true));
//		for(var i=128;i<phim.length;i++)
//    area__phim[4].appendChild(phim[i].cloneNode(true));
	
}
fill__data();
var end__next=[4,4,4,4,10,10,10,10];
function fill__next(obj,j)
{
	
    if(j==0)
    {
        var i;
        for(i=end__next[j];i<end__next[j]+5;i++)
			{
				top__phim[0].appendChild(phim__bo[i].cloneNode(true));	
				if(i>=phim__bo.length-1)
					{
						obj.style.visibility='hidden';
						break;
					}
					
			}
        end__next[j]=i;
    }
    if(j==1)
    {
        var i;
        for(i=end__next[j];i<end__next[j]+5;i++)
			{
				top__phim[1].appendChild(phim__le[i].cloneNode(true));
				if(i>=phim__le.length-1)
					{
						obj.style.visibility='hidden';
						break;
					}
			}
        end__next[j]=i;
    }
    if(j==2)
    {
        var i;
        for(i=end__next[j];i<end__next[j]+5;i++)
			{
				top__phim[2].appendChild(phim__chieu__rap[i].cloneNode(true));
				if(i>=phim__chieu__rap.length-1)
					{
						obj.style.visibility='hidden';
						break;
					}
			}
        
        end__next[j]=i;
    }
    if(j==3)
    {
        var i;
        for(i=end__next[j];i<end__next[j]+5;i++)
			{
				top__phim[3].appendChild(phim__hoat__hinh[i].cloneNode(true));
				if(i>=phim__hoat__hinh.length-1)
					{
						obj.style.visibility='hidden';
						break;
					}
			}
        
        end__next[j]=i;
    }
    if(j==4)
    {
        var i;
        for(i=end__next[j];i<end__next[j]+10;i++)
			{
				area__phim[0].appendChild(phim__bo[i].cloneNode(true));
				if(i>=phim__bo.length-1)
					{
						obj.style.visibility='hidden';
						break;
					}
			}
        
        end__next[j]=i;
    }
    if(j==5)
    {
        var i;
        for(i=end__next[j];i<end__next[j]+10;i++)
			{
				 area__phim[1].appendChild(phim__le[i].cloneNode(true));
				 if(i>=phim__le.length-1)
					{
						obj.style.visibility='hidden';
						break;
					}
			}
       
        end__next[j]=i;
    }
    if(j==6)
    {
        var i;
        for(i=end__next[j];i<end__next[j]+10;i++)
			{
				area__phim[2].appendChild(phim__chieu__rap[i].cloneNode(true));
				if(i>=phim__chieu__rap.length-1)
					{
						obj.style.visibility='hidden';
						break;
					}
			}        
        end__next[j]=i;
    }
    if(j==7)
    {
        var i;
        for(i=end__next[j];i<end__next[j]+10;i++)
			{
				area__phim[3].appendChild(phim__hoat__hinh[i].cloneNode(true));
				if(i>=phim__hoat__hinh.length-1)
					{
						obj.style.visibility='hidden';
						break;
					}
				
			}
       
        end__next[j]=i;
    }
}
function slide()
{
    var i=0;
    var slide=document.querySelectorAll('.slide');
    var slide__content=document.querySelectorAll('.slide__content');
    var slide__title=document.querySelectorAll('.slide__title');
    slide[i].style.visibility='visible';
    slide[i].style.opacity='1';
    slide[i].style.backgroundSize= '100%';
    slide__content[i].classList.toggle('slide__content--animation');
    slide__title[i].classList.toggle('slide__title--animation');
    i++;

    function slide__run()
    {
        if(i==5)
        {
            i=0;slide[4].style.opacity='0';slide[4].style.backgroundSize= '110%';slide[4].style.visibility='';
            slide__content[4].classList.toggle('slide__content--animation');
            slide__title[4].classList.toggle('slide__title--animation');
        }
        else{
            slide[i-1].style.opacity='0';
            slide[i-1].style.backgroundSize= '110%';
            slide[i-1].style.visibility='';
            slide__content[i-1].classList.toggle('slide__content--animation');
            slide__title[i-1].classList.toggle('slide__title--animation');
        }
        slide[i].style.visibility='visible';
        slide[i].style.opacity='1';
        slide[i].style.backgroundSize= '100%';
        slide__content[i].classList.toggle('slide__content--animation');
        slide__title[i].classList.toggle('slide__title--animation');
        i++;
    }
    setInterval(slide__run,6000);
}
slide();
// fill__data__top();
// fill__data();

var user;
user=[];
user[0]={};
user[0].id=0;
user[0].name="ad";
user[0].email="ad@";
user[0].pass='ad';
user[0].danh__sach__phim=[];
user[0].danh__sach__phim[0]={};
user[0].danh__sach__phim[0].id__phim=-1;
user[0].danh__sach__phim[0].tap__phim=-1;
var tap__phim = 1;
var area__function=document.querySelectorAll('body>div');
var id=-1;
console.log(area__function);
// function controls()
// {
//     var 
// }
function out()
{
	
    for(i=9;i<area__function.length;i++)
    {
        area__function[i].style.display='none';
    }
    for(var i=0;i<9;i++)
    {
        area__function[i].style.display='';
    }
	
	video.currentTime = 0;
}
out();
function dang__ky()
{
    var pass,name,repass,email;
    name=document.querySelector('.sign__up-name').value;
    email=document.querySelector('.sign__up-email').value;
    pass=document.querySelector('.sign__up-password').value;
    repass=document.querySelector('.sign__up-repassword').value;
    var i=0;
    if(repass!=pass)
    {
    alert("Mật khẩu không khớp");
    i=1;
    }
    else{
        if(name=='')
        {
            i=1;
            alert("Nhập tên");
        }
        else
        {
            if(email=='')
            {
                alert("Nhập email");
                i=1;
            }
            else
            {
                for(var k=0;k<user.length;k++)
                {
                    if(name==user[k].name)
                    {
                        alert("Tên đăng nhập đã tồn tại");
                        i=1;
                        break;
                    }
                    else{
                        if(email==user[k].email)
                        {
                            alert("Email đã tồn tại");
                            i=1;
                            break;
                        }
                    }
                }
            }
        }
    }
    if(i==0)
    {
        var j=user.length;
        user[user.length]={};
        user[j].id=j;
        user[j].name=name;
        user[j].email=email;
        user[j].pass=pass;
        user[j].danh__sach__phim=[];
        user[j].danh__sach__phim[0]={};
        user[j].danh__sach__phim[0].id__phim=-1;
        user[j].danh__sach__phim[0].tap__phim=-1;
        console.log(user[j]);
        alert("đã đăng ký");
        chuyen__card__login__sign();
    }
}
// function dang__nhap()
// {

// }















function play__video(obj)
{
	document.querySelector('video source').src = `img/video${tap__phim}.mp4`;
    if(id!=-1)
    {
        var i=user[id].danh__sach__phim.length;
        console.log(user[id]);
        user[id].danh__sach__phim[i]={};
        user[id].danh__sach__phim[i].id__phim=obj.getAttribute('id__phim');
        var danh__sach__phim=document.querySelector('.acc__phim div');
        danh__sach__phim.appendChild(obj.cloneNode(true));
    }
    for(var i=1;i<area__function.length;i++)
    area__function[i].style.display='none';
    area__function[11].style.display='';
	window.scrollTo(0,0);
}
function log()
{
    id=-1;
    out();
    clear__user();
}
function open__user()
{
    // console.log("open user:",user[id]);
    document.querySelector('.header__account').innerText=user[id].name;
    document.querySelector('.account__ten').innerText=user[id].name;
    document.querySelector('.account__email').innerText=user[id].email;
    var danh__sach__phim=document.querySelector('.acc__phim div');
    var f=[];
    for(var i=0;i<user[id].danh__sach__phim.length-1;i++)
    f[i+1]=document.querySelector(`.id__phim__${i}`);
    for(var i=1;i<user[id].danh__sach__phim.length;i++)
    danh__sach__phim.appendChild(f[i].cloneNode(true));
}
function clear__user()
{
    document.querySelector('.header__account').innerText='LOGIN';
    document.querySelector('.acc__phim div').innerHTML="";
}
function chuyen__card__login__sign()
{
    document.querySelector('.login__card').classList.toggle('hide');
    document.querySelector('.sign__up__card').classList.toggle('hide');
}
function call__dang__nhap()
{
    if(id!=-1)
    {
        for(var i=1;i<area__function.length;i++)
        area__function[i].style.display='none';
        area__function[10].style.display='';
    }
    else
    {
        for(var i=1;i<area__function.length;i++)
        area__function[i].style.display='none';
        area__function[9].style.display='';
    }
}

function dang__nhap()
{
    var pass=document.querySelector('.login-password').value;
    var email=document.querySelector('.login-name').value;
    console.log(pass,email)
    for(var i=0;i<user.length;i++)
    {
        if(pass==user[i].pass&&email==user[i].email)
        {
            alert("Hello ");
            id=i;
            open__user();
            out();
            break;
        }
    }
}









//var arrayPhimTitle = document.querySelectorAll('.phim>.phim__content>.phim__title'); 
var arrayPhimTitle = document.querySelectorAll('.search>.phim__content>.phim__title');
//alert(arrayPhimTitle.length);
//alert(arrayPhimTitle[1].innerHTML);
var searchBase = document.querySelectorAll('.search');
//alert(searchBase.length);
var iconSearch = document.getElementById('iconSearch');
var inputSearch = document.getElementById('inputSearch');
//var divSub = document.getElementById('divSub');
var areaSubTitle = document.getElementsByClassName('areaSubTitle');
var divSearch = document.getElementById('divSearch');
var searchFlag = 0 ;
//var arrayPhimTitle = document.querySelectorAll('.phim>.phim__content>.phim__title');
//alert(arrayPhimTitle.length);
//alert(arrayPhimTitle[189].innerHTML);
//189
//alert(arrayPhimTitle.length);
//alert(arrayPhimTitle[128].innerHTML);

//areaSubTitle[0].innerHTML = "xyz";
j=1;
for(var i=0;i<searchBase.length;i++)
{
    if(j>30)
    j=1;
    // phim[i].addEventListener('onclick',play__video(this));
    searchBase[i].querySelector('.search> .phim__img').style.backgroundImage= `url('img/img/Search/${j}.jpg')`;
	j++;
}

function showInput()
{
//	alert(inputSearch.style.display!='none');
	if(inputSearch.style.display != 'block')
	{
	   inputSearch.style.display = 'block';
	   
	}
		else
		{
			inputSearch.style.display = 'none';
	   		
			inputSearch.value = '';
		}
	
}





function xoa_dau(str) {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    return str;
}
function xoaAllChild(obj)
{
	
	while(obj.childElementCount>0)
		{
			
			obj.removeChild(obj.childNodes[1]);

		}
}

function searchTitle(tuKhoa){
	xoaAllChild(area__phim[4]);
		
	var tuKhoaKhongDau= xoa_dau(tuKhoa);
		for( var i =searchFlag;i<arrayPhimTitle.length;i++)
		{
			
			var t = arrayPhimTitle[i].innerHTML.toUpperCase();// chuyển thành chữ hoa
			
			var t1 = xoa_dau(t);
//			alert(t.search(tuKhoa) >-1);
			if(t.search(tuKhoa) >-1 || t1.search(tuKhoaKhongDau)>-1){ //SEARCH TỪ KHÓA KO DẤU VÀ CÓ DẤU TRONG DATABASE
			area__phim[4].appendChild(searchBase[i].cloneNode(true));// NẾU CÓ BỎ VÀO MẢNG	
			
			}
		}
}

function Search(){
	search1();
		for(var i=1;i<area__function.length;i++)
        	area__function[i].style.display='none';
	inputSearch.style.display = 'none';
//	divSub.style.display = 'none';
	divSearch.style.display = 'block';
	inputSearch.value = '';
}
function search1(){
	xoaAllChild(area__phim[4]);
	
	var tuKhoa;
	var inputSearch = document.getElementById('inputSearch');
	if(inputSearch.value == '')
	{
		alert('Không tìm thấy');
	}
	else
	{
		
		tuKhoa = inputSearch.value.toUpperCase().trim();
		searchTitle(tuKhoa);
	}
}



//function goiY(e) {
//	var divSub = document.getElementsByClassName("goiY");
//	var subImg = document.getElementsByClassName("imgSub");
//	var subTitle = document.getElementsByClassName("titleSub");
//    if (e.keyCode != 13) {
//		
//		divSub.style.display = 'block';
//		
//    }
//	else{	
//		divSub.style.display = 'none';
//	}
//}
function sort__act__phim__bo(t)
{
    var f;
    if(t=='han__quoc')
    {
        f=document.querySelectorAll('.phim__bo.han__quoc');
    }
    if(t=='hoa__ngu')
    {
        f=document.querySelectorAll('.phim__bo.hoa__ngu');
    }
    if(t=='hong__kong')
    {
        f=document.querySelectorAll('.phim__bo.hong__kong');
    }
    var area=document.querySelector('.film__area__box--phim__bo');
    area.innerHTML="";
    for(var i=0;i<f.length;i++)
    {
        area.appendChild(f[i].cloneNode(true));
    }
	document.querySelector('.phim__area__next__phim__bo').style.display='none';
}
function sort__act__phim__le(t)
{
    var f;
    if(t=='hanh__dong')
    {
        f=document.querySelectorAll('.phim__le.hanh__dong');
    }
    if(t=='hai__huoc')
    {
        f=document.querySelectorAll('.phim__le.hai__huoc');
    }
    if(t=='phieu__luu')
    {
        f=document.querySelectorAll('.phim__le.phieu__luu');
    }
    var area=document.querySelector('.film__area__box--phim__le');
    area.innerHTML="";
    for(var i=0;i<f.length;i++)
    {
        area.appendChild(f[i].cloneNode(true));
		
    }
	document.querySelector('.phim__area__next__phim__le').style.display='none';
}
function sort__act__phim__chieu__rap(t)
{
    var f;
    if(t=='hanh__dong')
    {
        f=document.querySelectorAll('.phim__le.hanh__dong');
    }
    if(t=='hai__huoc')
    {
        f=document.querySelectorAll('.phim__le.hai__huoc');
    }
    if(t=='phieu__luu')
    {
        f=document.querySelectorAll('.phim__le.phieu__luu');
    }
    var area=document.querySelector('.film__area__box--phim__chieu__rap');
    area.innerHTML="";
    for(var i=0;i<f.length;i++)
    {
        area.appendChild(f[i].cloneNode(true));
    }
	document.querySelector('.phim__area__next__phim__chieu__rap').style.display='none';
	
}

function sort__act__phim__hoat__hinh(t)
{
    var f;
    if(t=='hanh__dong')
    {
        f=document.querySelectorAll('.phim__hoat__hinh.hanh__dong');
    }
    if(t=='hai__huoc')
    {
        f=document.querySelectorAll('.phim__hoat__hinh.hai__huoc');
    }
    if(t=='phieu__luu')
    {
        f=document.querySelectorAll('.phim__hoat__hinh.phieu__luu');
    }
    var area=document.querySelector('.film__area__box--phim__hoat__hinh');
    area.innerHTML="";
    for(var i=0;i<f.length;i++)
    {
        area.appendChild(f[i].cloneNode(true));
    }
	document.querySelector('.phim__area__next__phim__hoat__hinh').style.display='none';
}

function showheadermenu()
{
    document.querySelector('.header__menu__hide').classList.toggle('hide');
}

function play__tap(t)
{
	tap__phim = t;
	document.querySelector('video source').src = `img/video${t}.mp4`;
	video.load();
	var tap = document.querySelectorAll('.tap');
	for(var i = 0;i<tap.length;i++)
		{
			tap[i].classList.remove('tap__active');
		}
	tap[t-1].classList.add('tap__active');
//	document.getElementById('play').setAttribute('data-title','Play (k)');
}
























// var user=[];
// user[0]={};
// user[0].ten="ad";
// user[0].email="ad@";
// user[0].ds__phim=[{}];
// user[0].ds__phim[0].sotap=0;
// user[0].ds__phim[0].id__phim;
// user[0].pass="ad";
// var logined=0;
// var id=-1;

// for(var i=0;i<user.length;i++)
// console.log(user[i]);
// function dang__ky()
// {
//     var ten=document.querySelector('.sign__up-name').value;
//     var email=document.querySelector('.sign__up-email').value;
//     var pass=document.querySelector('.sign__up-password').value;
//     var repass=document.querySelector('.sign__up-repassword').value;
//     for(var i=0;i<user.length;i++)
//     {
//         if(ten==user[i].ten)
//         alert("ten khong hop le");
//         else{
//             if(email==user[i].email)
//             {
//                 alert("email khong hop le");
//             }
//             else{
//                 if(pass!=repass)
//                 alert("mat khau khong");
//                 else{
//                     var j=user.length;
//                     user[j]={};
//                     user[j].ten=ten;
//                     user[j].pass=pass;
//                     user[j].email=email;
//                     user[j].ds__phim=[{}];
//                     // user[j].ds__phim[0].sotap;
//                     // user[j].ds__phim[0].id__phim;
//                     chuyen__card__login__sign();
//                 }
//             }
//         }
//     }
// }
// function ac()
// {
//     for(var i=0;i<user.length;i++)
//     console.log(user[i]);
// }
// function dang__nhap()
// {
//     var email=document.querySelector('.login-name').value;
//     for(var i=0;i<user.length;i++)
//     {
//         if(email==user[i].email)
//         {
//             if(user[i].pass==document.querySelector('.login-password').value);
//             {
//                 alert("dang nhap thanh cong");
//                 logined=1;
//                 id=i;
//                 out();
//                 document.querySelector('.account__ten').innerText=`${user[id].ten}`;
//                 document.querySelector('.account__email').innerText=`${user[id].email}`;
//                 document.querySelector('.header__account').innerText=`${user[id].ten}`;
//                 document.querySelector('.acc__phim div').innerHTML="";
//                 var area=document.querySelector('.acc__phim div');
//                 var p;
//                 for(var i=1;i<user[id].ds__phim.length;i++)
//                 {
//                     var j=user[id].ds__phim[i].id__phim;
//                     p=document.querySelector(`.id__${j}`);
//                     console.log(p);
//                     area.appendChild(p.cloneNode(true));
//                 }
//                 break;
//             }
//         }
//     }
//     if(id==-1)
//     alert("sai");
// }
// function show__account()
// {
//     var area=document.querySelectorAll('body>div');
//     // con
//     for(var i=1;i<area.length-3;i++)
//     {
//         area[i].style.display='none';
//     }
//     area[area.length-1].style.display='flex';
// }




// function show__login()
// {
//     var area=document.querySelectorAll('body>div');
//     for(var i=1;i<area.length-3;i++)
//     {
//         area[i].style.display='none';
//     }
//     area[area.length-2].style.display='flex';
// }
// function login()
// {
//     if(logined)
//     {
//         show__account();
//     }
//     else{
//         show__login();
//     }
//     console.log(1);
// }

// function out()
// {
//     var area=document.querySelectorAll('body>div');
//     for(var i=1;i<area.length-3;i++)
//     {
//         area[i].style.display='';
//     }
//     area[area.length-2].style.display='';
//     area[area.length-1].style.display='';
// }
// function log()
// {
//     out();
//     document.querySelector('.header__account').innerText='login';
//     logined=0;
// }
// function show__pass(obj)
// {
//     obj=obj.querySelector('input');
//     if(obj.value!=""){
//         if(obj.type=='text')
//     {
//         obj.type='password';
//         console.log(obj.type)
//     }
//     else{
//         obj.type='text';
//         console.log(obj.type)
//     }
//     }
// }
// function chuyen__card__login__sign(){
//     var sign=document.querySelector('.sign__up__card');
//     var login=document.querySelector('.login__card');
//     if(sign.style.display=='none')
//     {
//         sign.style.display='block';
//         login.style.display='none';
//     }
//     else{
//         sign.style.display='none';
//         login.style.display='block';
//     }
// }
// function play__video(obj)
// {
//     if(logined==0)
//     {
//         alert("dang nhap de xem");
//     }
//     else{
//         var j=0;
//         for(var i=0;i<user[id].ds__phim.length;i++)
//         if(obj.getAttribute('id__phim')==user[id].ds__phim[i].id__phim)
//         {
//             j=1;
//             break;
//         }
//         if(j==0)
//         {
//             var j=user[id].ds__phim.length;
//             user[id].ds__phim[j]={};
//             user[id].ds__phim[j].sotap=0;
//             user[id].ds__phim[j].id__phim=obj.getAttribute('id__phim');
//             document.querySelector('.acc__phim div').appendChild(obj.cloneNode(true));
//         }
//     }
// }


































// function sort(obj)
// {
    
//     var i=obj.querySelector('.sort__content>p').innerText;
//     if(i=="Hành động")
//     {
//         i="hanh__dong";
//     }
//     if(i=="Phiêu lưu")
//     {
//         i="phieu__luu";
//     }
//     if(i=="Gây cấn")
//     {
//         i="gay__can";
//     }
//     if(i=="Hài hước")
//     {
//         i="hai__huoc";
//     }
//     console.log(i)
//     var p=document.querySelectorAll(`.${i}`);
//     console.log(p);
//     var area=obj.querySelector('.film__area__box');
//     console.log(obj,area)
//     area.innerHTML="";
//     var j;
//     for(var i=0;i<p.length;i++)
//     {
//         j=p[i].cloneNode(true);
//         j.classList.toggle('phim__appear');
//         area.appendChild(j);
//     }
//     if(p.length==0)
//     {
//         area.innerText="NO";
//     }
// }
// function sort__act(obj1,obj)
// {
//     console.log(document.querySelector('.sort__content>p'));
//     console.log(obj)
//    obj.querySelector('.sort__content>p').innerText=obj1.innerText;
// }