
// --- Updated script.js ---

let currentData = []; // To store the currently loaded category data
let swiperInstance;

// Initialize Swiper after content loads
function initializeSwiper() {
  if (swiperInstance) {
    swiperInstance.destroy(true, true);
  }
  swiperInstance = new Swiper('.blog-slider', {
    spaceBetween: 30,
    effect: 'fade',
    loop: false,
    mousewheel: { invert: false },
    pagination: {
      el: '.blog-slider__pagination',
      clickable: true,
    }
  });
}

// Load category data
function loadCategory(category) {
  fetch(`./${category}.json`)
    .then(response => response.json())
    .then(data => {
      currentData = data;
      populateSlider(data);
      populateCarousel(data);
      initializeSwiper();
    });
}

// Populate Blog Slider
function populateSlider(data) {
  const sliderContent = document.getElementById('slider-content');
  sliderContent.innerHTML = '';
  data.forEach((item, index) => {
    const slide = document.createElement('div');
    slide.className = 'blog-slider__item swiper-slide';
    slide.innerHTML = `
      <div class="blog-slider__img">
        <img src="${item.image}" alt="">
      </div>
      <div class="blog-slider__content">
        <span class="blog-slider__code">${item.date || ''}</span>
        <div class="blog-slider__title">${item.title || ''}</div>
        <div class="blog-slider__skills">${item.skills || ''}</div>
        <div class="blog-slider__text">${item.description || ''}</div>
        <a href="#" class="blog-slider__button">READ MORE</a>
      </div>
    `;
    sliderContent.appendChild(slide);
  });
}

// Populate Carousel
function populateCarousel(data) {
  const carouselList = document.querySelector('.carousel__list');
  carouselList.innerHTML = '';

  data.forEach((item, index) => {
    const li = document.createElement('li');
    li.className = 'carousel__item';
    li.dataset.index = index;
    li.dataset.pos = index === 0 ? '0' : (index === 1 ? '1' : (index === 2 ? '2' : (index === -1 ? '-1' : '-2')));
    li.innerHTML = `<img src="${item.image}" style="width:100%; height:100%; object-fit:cover; border-radius:12px;">`;
    carouselList.appendChild(li);
  });

  setupCarouselEvents();
}

// Setup click event on Carousel items
function setupCarouselEvents() {
  const carouselItems = document.querySelectorAll('.carousel__item');

  carouselItems.forEach(item => {
    item.addEventListener('click', (e) => {
      const index = parseInt(item.dataset.index);
      swiperInstance.slideTo(index);
      updateCarouselPositions(index);
    });
  });

  updateCarouselPositions(0);
}

// Update position data attributes for Carousel
function updateCarouselPositions(activeIndex) {
  const items = document.querySelectorAll('.carousel__item');
  items.forEach((item, idx) => {
    item.dataset.pos = (idx - activeIndex);
  });
}

// Handle category selector
const categorySelector = document.getElementById('category');
categorySelector.addEventListener('change', (e) => {
  loadCategory(e.target.value);
});

// Load default category on page load
window.onload = function() {
  loadCategory('Certifications');
};
