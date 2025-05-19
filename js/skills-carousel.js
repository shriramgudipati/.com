/**
 * Skills Carousel with Linear Navigation (without buttons)
 * This ensures even spacing between all items with definite beginning and end
 */
function initSkillsCarousel() {
  const carouselList = document.querySelector('.skills-carousel__list');
  if (!carouselList) return;
  
  const carouselItems = document.querySelectorAll('.skills-carousel__item');
  const elems = Array.from(carouselItems);
  
  // Add click handlers for items
  carouselList.addEventListener('click', function(event) {
    let newActive = event.target;
    if (newActive.tagName === 'SPAN') {
      newActive = newActive.parentElement;
    }
    
    const isItem = newActive.closest('.skills-carousel__item');
    
    if (!isItem || newActive.dataset.active === "true") {
      return;
    }
    
    updateSkillsCarousel(newActive, elems);
  });

  // Initialize with proper linear positions
  positionItemsLinearly(elems);
}

/**
 * Updates the skills carousel with a new active item
 * @param {Element} newActive - The new active carousel item
 * @param {Array} elems - Array of all carousel items
 */
function updateSkillsCarousel(newActive, elems) {
  const newActivePos = parseInt(newActive.dataset.pos);
  
  // Remove active status from current active
  elems.forEach(elem => {
    if (elem.dataset.active === "true") {
      elem.removeAttribute('data-active');
      elem.classList.remove('illuminated');
    }
  });
  
  // Set new active
  newActive.dataset.active = "true";
  newActive.classList.add('illuminated');
  
  // Update positions with linear logic
  elems.forEach(item => {
    const itemPos = parseInt(item.dataset.pos);
    item.dataset.pos = getLinearPosition(itemPos, newActivePos);
  });
}

/**
 * Calculate new linear position for an item after selecting a new active item
 * @param {number} current - Current position of the item
 * @param {number} active - Position of the newly active item
 * @returns {number} - The new position for the item
 */
function getLinearPosition(current, active) {
  // Simply subtract the active position from current position
  return current - active;
}

/**
 * Position items in the carousel linearly with the first item at position 0
 * @param {Array} items - Array of carousel items
 */
function positionItemsLinearly(items) {
  if (!items || items.length === 0) return;
  
  // Simply set positions based on index
  items.forEach((item, index) => {
    item.dataset.pos = index;
    
    // Set the first item as active
    if (index === 0) {
      item.dataset.active = "true";
      item.classList.add('illuminated');
    }
  });
  
  // After setting initial positions, shift everything so active is at 0
  const activeItem = items.find(item => item.dataset.active === "true");
  if (activeItem) {
    const activePos = parseInt(activeItem.dataset.pos);
    
    // Adjust all positions relative to active item
    items.forEach(item => {
      const currentPos = parseInt(item.dataset.pos);
      item.dataset.pos = currentPos - activePos;
    });
  }
}

/**
 * Creates HTML for a skills carousel from an array of skills
 * @param {Array} skills - Array of skill strings
 * @returns {string} - HTML for skills carousel
 */
function createSkillsCarouselHTML(skills) {
  if (!skills || !Array.isArray(skills) || skills.length === 0) {
    return '';
  }
  
  let html = '<div class="skills-carousel-container">';
  html += '<h3>Skills</h3>';
  html += '<div class="skills-carousel">';
  html += '<ul class="skills-carousel__list">';
  
  // In linear mode, we start with the first item at position 0 (center)
  skills.forEach((skill, index) => {
    const position = index;
    
    // First item starts as active
    const active = index === 0 ? 'data-active="true"' : '';
    const illuminated = index === 0 ? 'illuminated' : '';
    
    html += `<li class="skills-carousel__item ${illuminated}" data-pos="${position}" ${active}>`;
    html += `<span>${skill}</span>`;
    html += '</li>';
  });
  
  html += '</ul>';
  html += '</div>';
  html += '</div>';
  return html;
}

// Initialize skills carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initial setup when the page first loads
  initSkillsCarousel();
  
  // For dynamic content loading - setup observer
  const projectContent = document.getElementById('project-content-container');
  if (projectContent) {
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.addedNodes.length) {
          setTimeout(initSkillsCarousel, 100);
        }
      });
    });
    
    observer.observe(projectContent, { childList: true, subtree: true });
  }
});
