// Функция для установки disabled-класса на кнопки навигации
function updateNavigationButtons(swiper, prevBtn, nextBtn) {
    if (swiper.isBeginning) {
        document.querySelector(prevBtn).classList.add('disabled');
    } else {
        document.querySelector(prevBtn).classList.remove('disabled');
    }

    if (swiper.isEnd) {
        document.querySelector(nextBtn).classList.add('disabled');
    } else {
        document.querySelector(nextBtn).classList.remove('disabled');
    }
}

let swiperVideos = new Swiper('.mySwiperVideos', {
    slidesPerView: 6,
    spaceBetween: 10,
    loop: false,
    navigation: {
        nextEl: '.custom-next-video',
        prevEl: '.custom-prev-video',
    },
    pagination: {
        el: '.custom-swiper-pagination-video',
        type: 'progressbar',
    },
    allowTouchMove: true,
    breakpoints: {
        320: {
            slidesPerView: 2,
            spaceBetween: 10,
            allowTouchMove: true,
        },
        576: {
            slidesPerView: 3,
            spaceBetween: 15,
            allowTouchMove: true,
        },
        950: {
            slidesPerView: 6,
            spaceBetween: 10,
            allowTouchMove: false,
        }
    },
    on: {
        init: function () {
            updateNavigationButtons(this, '.custom-prev-video', '.custom-next-video');
        },
        slideChange: function () {
            updateNavigationButtons(this, '.custom-prev-video', '.custom-next-video');
        }
    }
});

let swiperImages = new Swiper('.mySwiperImages', {
    slidesPerView: 6,
    spaceBetween: 10,
    loop: false,
    navigation: {
        nextEl: '.custom-next-image',
        prevEl: '.custom-prev-image',
    },
    pagination: {
        el: '.custom-swiper-pagination-image',
        type: 'progressbar',
    },
    allowTouchMove: true,
    breakpoints: {
        320: {
            slidesPerView: 2,
            spaceBetween: 10,
            allowTouchMove: true,
        },
        576: {
            slidesPerView: 3,
            spaceBetween: 15,
            allowTouchMove: true,
        },
        950: {
            slidesPerView: 6,
            spaceBetween: 10,
            allowTouchMove: false,
        }
    },
    on: {
        init: function () {
            updateNavigationButtons(this, '.custom-prev-image', '.custom-next-image');
        },
        slideChange: function () {
            updateNavigationButtons(this, '.custom-prev-image', '.custom-next-image');
        }
    }
});