document.addEventListener("DOMContentLoaded", () => {
  const categorySelector = document.getElementById("category");
  const sliderContent = document.getElementById("slider-content");

  const loadCategory = (category) => {
    fetch(`./${category}.json`)
      .then((response) => response.json())
      .then((data) => {
        sliderContent.innerHTML = ""; // Clear existing content
        data.forEach((item) => {
          const slide = document.createElement("div");
          slide.className = "blog-slider__item swiper-slide";
          slide.innerHTML = `
            <div class="blog-slider__img">
              <img src="${item.image}" alt="">
            </div>
            <div class="blog-slider__content">
              <span class="blog-slider__code">${item.date}</span>
              <div class="blog-slider__title">${item.title}</div>
              <div class="blog-slider__text">${item.text}</div>
              <a href="#" class="blog-slider__button">READ MORE</a>
            </div>
          `;
          sliderContent.appendChild(slide);
        });

        // Reinitialize Swiper
        new Swiper(".blog-slider", {
          spaceBetween: 30,
          effect: "fade",
          loop: true,
          pagination: {
            el: ".blog-slider__pagination",
            clickable: true,
          },
        });
      });
  };

  // Load default category on page load
  loadCategory("category1");

  // Change category on dropdown selection
  categorySelector.addEventListener("change", (e) => {
    loadCategory(e.target.value);
  });
});
