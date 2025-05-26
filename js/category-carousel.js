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
  
  // Ensure this function is called when the document is ready
  $(document).ready(function() {
    console.log("Category carousel initialization");
    initializeCategoryCarousel();
    
    // Debug visibility
    setTimeout(function() {
        console.log("Category items:", $('.category-carousel__item').length);
        $('.category-carousel__item').each(function(index) {
            console.log("Item", index, "position:", $(this).data('pos'), "display:", $(this).css('display'));
        });
    }, 500);
  });
  
  function initializeCategoryCarousel() {
    const carouselItems = $('.category-carousel__item');
    
    // Make sure all items are initially positioned
    carouselItems.each(function() {
        const pos = $(this).data('pos') || 0;
        positionCarouselItem($(this), pos);
    });

    // Handle carousel item clicks
    $('.category-carousel__item').on('click', function() {
        if ($(this).hasClass('active')) return;
        
        const direction = $(this).data('pos') < 0 ? -1 : 1;
        rotateCarousel(direction);
        
        // Update the category dropdown to stay in sync
        const categoryValue = $(this).data('value');
        $('#category').val(categoryValue).trigger('change');
    });
    
    // Keep carousel in sync with dropdown
    $('#category').on('change', function() {
        const selectedValue = $(this).val();
        const $targetItem = $(`.category-carousel__item[data-value="${selectedValue}"]`);
        
        if ($targetItem.length && !$targetItem.hasClass('active')) {
            const currentPos = parseInt($targetItem.data('pos'));
            rotateCarousel(currentPos);
        }
    });

    // Make sure the carousel is visible
    $('.category-carousel-container').css({
        'opacity': '1',
        'visibility': 'visible'
    });
  }

  // Function to position each carousel item based on its data-pos attribute
  function positionCarouselItem($item, pos) {
    $item.attr('data-pos', pos);
    
    // Reset classes
    $item.removeClass('active');
    
    // Set active class for center item
    if (pos === 0) {
        $item.addClass('active');
    }
    
    // Apply styles directly to ensure they take effect
    if (pos === -1) {
        $item.css({
            'transform': 'translateX(-100%) scale(0.9)',
            'opacity': '0.7',
            'z-index': '4'
        });
    } else if (pos === 0) {
        $item.css({
            'transform': 'scale(1.1)',
            'opacity': '1',
            'z-index': '5'
        });
    } else if (pos === 1) {
        $item.css({
            'transform': 'translateX(100%) scale(0.9)',
            'opacity': '0.7',
            'z-index': '4'
        });
    }
  }

  // Function to rotate the carousel items
  function rotateCarousel(direction) {
    const carouselItems = $('.category-carousel__item');
    
    carouselItems.each(function() {
        let newPos = parseInt($(this).data('pos')) - direction;
        
        // Wrap around the carousel
        if (newPos > 1) newPos = -1;
        if (newPos < -1) newPos = 1;
        
        positionCarouselItem($(this), newPos);
    });
  }

  // Ensure proper initialization after DOM updates
  function reinitializeCategoryCarousel() {
    console.log("Reinitializing category carousel");
    initializeCategoryCarousel();
  }

  // Make the function available globally
  window.reinitializeCategoryCarousel = reinitializeCategoryCarousel;

  // Find the part where category changes and slider reloads
  // Add after the slider content is updated:
  function onCategoryChange(category) {
    // After loading the new content for the selected category
    // Make sure to update all skill tags
    setTimeout(updateAllSkillTags, 100);
  }

  function handleCategoryClick(e) {
    const newActive = e.currentTarget;
    
    // Don't proceed if the clicked item is already active
    if (newActive.classList.contains('active')) {
      return;
    }
    
    // Update the active class
    document.querySelectorAll('.category-carousel__item').forEach(item => {
      item.classList.remove('active');
    });
    newActive.classList.add('active');
    
    // Calculate the new positions
    const newActivePos = newActive.dataset.pos;
    
    // Find items by position
    const current = elems.find((elem) => elem.dataset.pos == 0);
    const prev = elems.find((elem) => elem.dataset.pos == -1);
    const next = elems.find((elem) => elem.dataset.pos == 1);
    
    // Update positions
    [current, prev, next].forEach(item => {
      const itemPos = parseInt(item.dataset.pos);
      item.dataset.pos = getPos(itemPos, parseInt(newActivePos));
    });
    
    // Update the hidden select element
    updateCategorySelection(newActive.dataset.value);
    
    // After updating content for the new category, apply skill tags formatting
    setTimeout(function() {
      if (typeof updateAllSkillTags === 'function') {
        updateAllSkillTags();
      }
    }, 300); // Wait for the content to load
  }

  // After category change and content load
  function handleCategoryChange(categoryValue) {
    // Ensure skills tags are formatted correctly
    if (typeof ensureSkillTagsFormatting === 'function') {
      setTimeout(ensureSkillTagsFormatting, 300);
    }
  }

  // Improved category carousel functionality
  initializeCategoryCarousel();
});

function initializeCategoryCarousel() {
  const carousel = document.querySelector('.category-carousel');
  const items = document.querySelectorAll('.category-carousel__item');
  
  if (!carousel || items.length === 0) {
      console.warn('Category carousel elements not found');
      return;
  }
  
  // Clear any existing positions to prevent conflicts
  items.forEach(item => {
      item.setAttribute('data-original-pos', item.getAttribute('data-pos') || '0');
  });
  
  // Find the active item or set the middle one as active
  let activeItem = document.querySelector('.category-carousel__item.active');
  if (!activeItem && items.length > 0) {
      const middleIndex = Math.floor(items.length / 2);
      activeItem = items[middleIndex];
      activeItem.classList.add('active');
  }
  
  // Ensure proper positioning
  updateCarouselPositions();
  
  // Add event listeners for each item
  items.forEach(item => {
      item.addEventListener('click', function() {
          if (this.classList.contains('active')) return;
          
          // Remove active class from current active
          document.querySelector('.category-carousel__item.active')?.classList.remove('active');
          
          // Add active class to clicked item
          this.classList.add('active');
          
          // Update positions based on the newly active item
          updateCarouselPositions();
          
          // Trigger category change event
          const categoryValue = this.getAttribute('data-value');
          if (categoryValue) {
              const event = new CustomEvent('categoryChanged', {
                  detail: { category: categoryValue }
              });
              document.dispatchEvent(event);
          }
      });
      
      // Add touch support for mobile
      item.addEventListener('touchend', function(e) {
          // Prevent quick double-click issues
          e.preventDefault();
          if (!this.classList.contains('active')) {
              this.click();
          }
      });
  });
}

// Function to update positions based on active item
function updateCarouselPositions() {
  const items = document.querySelectorAll('.category-carousel__item');
  const activeItem = document.querySelector('.category-carousel__item.active');
  
  if (!activeItem) return;
  
  const activeIndex = Array.from(items).indexOf(activeItem);
  
  items.forEach((item, index) => {
      // Calculate relative position to active item
      const relativePos = index - activeIndex;
      
      // Set data-pos attribute for CSS styling
      item.setAttribute('data-pos', relativePos);
      
      // Add a small delay to ensure smooth transition
      setTimeout(() => {
          item.style.transition = 'all 0.5s cubic-bezier(0.33, 1, 0.68, 1)';
      }, 50);
  });
}

// Make functions available globally
window.reinitializeCategoryCarousel = initializeCategoryCarousel;
window.updateCarouselPositions = updateCarouselPositions;
