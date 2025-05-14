document.addEventListener('DOMContentLoaded', function() {
  // State for tracking categories
  const state = {};
  
  // Get carousel elements
  const carouselList = document.querySelector('.category-carousel__list');
  const carouselItems = document.querySelectorAll('.category-carousel__item');
  const elems = Array.from(carouselItems);
  const hiddenSelect = document.getElementById('category');
  
  // Initialize the carousel
  function initializeCarousel() {
    // Set initial active category
    const activeItem = elems.find(item => item.dataset.pos == 0);
    if (activeItem) {
      updateCategorySelection(activeItem.dataset.value);
    }
    
    // Add click event listener to the carousel
    carouselList.addEventListener('click', function(event) {
      const newActive = event.target.closest('.category-carousel__item');
      
      if (!newActive) {
        return;
      }
      
      update(newActive);
      updateCategorySelection(newActive.dataset.value);
    });
  }
  
  // Update the carousel positions
  const update = function(newActive) {
    const newActivePos = newActive.dataset.pos;
    
    // Don't update if the clicked item is already active
    if (newActivePos == 0) return;
    
    // Find items by position
    const current = elems.find((elem) => elem.dataset.pos == 0);
    const prev = elems.find((elem) => elem.dataset.pos == -1);
    const next = elems.find((elem) => elem.dataset.pos == 1);
    
    // Update positions
    [current, prev, next].forEach(item => {
      const itemPos = parseInt(item.dataset.pos);
      item.dataset.pos = getPos(itemPos, parseInt(newActivePos));
    });
  };
  
  // Calculate the new position
  const getPos = function(current, active) {
    const diff = current - active;
    
    if (Math.abs(current - active) > 1) {
      return -current;
    }
    
    return diff;
  };
  
  // Update the hidden select element and trigger change event
  function updateCategorySelection(categoryValue) {
    if (hiddenSelect) {
      hiddenSelect.value = categoryValue;
      
      // Dispatch change event
      const event = new Event('change');
      hiddenSelect.dispatchEvent(event);
    }
  }
  
  // Initialize the carousel when DOM is loaded
  initializeCarousel();
});
