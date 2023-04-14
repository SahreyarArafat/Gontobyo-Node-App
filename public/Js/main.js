var preloader = document.querySelector('.preloader');
window.addEventListener('load', function() {
    preloader.parentElement.removeChild(preloader);
    document.querySelector('.preloader-overflow').classList.remove('preloader-overflow')
})

var activePage = window.location.pathname;
const allNavBtn = document.querySelectorAll('.nav-btn');
allNavBtn.forEach(link => {
    if (link.href.includes(activePage)) {
        link.classList.add('active');
        const homeBtn = document.querySelector('home-btn');
        homeBtn.classList.remove("active");
    }
})


function checkBoxFunction() {
    const checkBox = document.getElementById('check');
    if (checkBox.checked == true) {
        document.body.style.overflowY = 'hidden';
        // console.log(`checked!`);
    } else {
        document.body.style.overflowY = 'overlay';
        // console.log(`unchecked!`);
    }
}