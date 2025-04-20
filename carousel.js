document.addEventListener('DOMContentLoaded', function () {
  const carouselList = document.querySelector('.carousel__list');
  const carouselItems = document.querySelectorAll('.carousel__item');
  const elems = Array.from(carouselItems);
  let isScrolling = false;

  // Click functionality
  carouselList.addEventListener('click', function (event) {
    const newActive = event.target.closest('.carousel__item');
    if (!newActive || newActive.classList.contains('carousel__item_active')) {
      return;
    }
    updateActiveItem(newActive);
  });

  // Add wheel event listener for mouse scroll
  carouselList.addEventListener('wheel', function (event) {
    event.preventDefault();

    if (!isScrolling) {
      isScrolling = true;

      if (event.deltaY > 0) {
        rotateCarousel('right');
      } else {
        rotateCarousel('left');
      }

      setTimeout(() => {
        isScrolling = false;
      }, 300); // Adjust delay to prevent excessive scrolling
    }
  });

  // Rotate the carousel in the specified direction
  function rotateCarousel(direction) {
    elems.forEach((item) => {
      let pos = parseInt(item.dataset.pos, 10);
      if (direction === 'right') {
        item.dataset.pos = pos === 1 ? -1 : pos + 1; // Wrap around positions
      } else {
        item.dataset.pos = pos === -1 ? 1 : pos - 1; // Wrap around positions
      }
    });
    updateActiveClass();
  }

  // Update the active item based on click
  function updateActiveItem(newActive) {
    const newActivePos = parseInt(newActive.dataset.pos, 10);

    elems.forEach((item) => {
      const currentPos = parseInt(item.dataset.pos, 10);
      item.dataset.pos = getNewPosition(currentPos, newActivePos);
    });

    updateActiveClass();
  }

  // Update the active class for the carousel items
  function updateActiveClass() {
    elems.forEach((item) => {
      if (parseInt(item.dataset.pos, 10) === 0) {
        item.classList.add('carousel__item_active');
      } else {
        item.classList.remove('carousel__item_active');
      }
    });
  }

  // Calculate the new position for an item
  function getNewPosition(current, active) {
    const diff = current - active;

    if (diff === 2) return -1; // Wrap around for 3-item carousel
    if (diff === -2) return 1; // Wrap around for 3-item carousel

    return diff;
  }

  // Initialize the active class on page load
  updateActiveClass();
});
