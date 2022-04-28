//Слайдер
const swiper = new Swiper('.swiper', {
    // Optional parameters
    direction: 'horizontal',
    loop: true,
    slidesPerView: 5,
    spaceBetween: 30,
    pagination: {
        el: ".swiper-pagination",
        clickable: true,

        // If we need pagination
        pagination: {
            el: '.swiper-pagination',
        },

        // Navigation arrows
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },

        // And if we need scrollbar
        scrollbar: {
            el: '.swiper-scrollbar',
        }
    },
    autoplay: {
        delay: 2500,
        disableOnInteraction: false,
    },
});
//------------------------------------
// Рендер картинок превью
let previewImg = document.querySelectorAll('.preview-img');
for (let i = 0; i < previewImg.length; i++) {
    console.log(i)
    previewImg[i].insertAdjacentHTML("afterbegin", '<img src="img/1.jpeg" alt="image">');
}
//------------------------------------