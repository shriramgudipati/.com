document.addEventListener('DOMContentLoaded', function() {
    // Reference to components
    const sliderContent = document.getElementById('slider-content');
    const carouselContent = document.getElementById('carousel-content');
    const categorySelect = document.getElementById('category');
    
    let blogSliderInstance;
    let currentCategory = 'Projects'; // Default to Category 2
    let currentData = [];

    // Function to load data based on category - with optimized loading
    function loadCategoryData(category) {
        console.log('Loading data for category:', category);
        
        // Add a loading class to the slider
        $('.blog-slider').addClass('loading');
        
        // Fallback data in case JSON loading fails
        const fallbackData = {
            Certifications: [
                { 
                    id: 1, 
                    title: 'Category 1 - Item 1', 
                    description: 'Description for item 1',
                    image: 'https://via.placeholder.com/400x300?text=Category1-Item1'
                },
                { 
                    id: 2, 
                    title: 'Category 1 - Item 2', 
                    description: 'Description for item 2',
                    image: 'https://via.placeholder.com/400x300?text=Category1-Item2' 
                }
            ],
            Projects: [
                { 
                    id: 1, 
                    title: 'Category 2 - Item 1', 
                    description: 'Description for item 1',
                    image: 'https://via.placeholder.com/400x300?text=Category2-Item1'
                },
                { 
                    id: 2, 
                    title: 'Category 2 - Item 2', 
                    description: 'Description for item 2',
                    image: 'https://via.placeholder.com/400x300?text=Category2-Item2'
                },
                { 
                    id: 3, 
                    title: 'Category 2 - Item 3', 
                    description: 'Description for item 3',
                    image: 'https://via.placeholder.com/400x300?text=Category2-Item3'
                }
            ],
            research_papers: [
                { 
                    id: 1, 
                    title: 'Category 3 - Item 1', 
                    description: 'Description for item 1',
                    image: 'https://via.placeholder.com/400x300?text=Category3-Item1'
                },
                { 
                    id: 2, 
                    title: 'Category 3 - Item 2', 
                    description: 'Description for item 2',
                    image: 'https://via.placeholder.com/400x300?text=Category3-Item2'
                }
            ]
        };
        
        // Use async AJAX for better performance
        return new Promise((resolve) => {
            $.ajax({
                url: `data/${category}.json`,
                dataType: 'json',
                async: true, // Make it async for better performance
                timeout: 2000, // Set reasonable timeout
                success: function(response) {
                    console.log(`Successfully loaded ${category} data:`, response);
                    
                    // Make sure skills are properly processed as arrays
                    response.forEach(item => {
                        // Ensure skills is always an array
                        if (!item.skills) {
                            item.skills = [];
                        } else if (typeof item.skills === 'string') {
                            // If skills is a comma-separated string, convert it to array
                            item.skills = item.skills.split(',').map(skill => skill.trim());
                        }
                    });
                    
                    resolve(response);
                },
                error: function(xhr, status, error) {
                    console.error(`Error loading ${category}.json:`, error);
                    console.log(`Using fallback data for ${category}`);
                    // Use fallback data if JSON file fails to load
                    resolve(fallbackData[category] || []);
                }
            });
        });
    }

    // Function to update blog slider content with optimized loading
    function updateBlogSlider(data) {
        console.log('Updating blog slider with data:', data);
        
        // First completely destroy the old slider to avoid glitches
        if (blogSliderInstance) {
            blogSliderInstance.destroy(true, true);
            blogSliderInstance = null;
        }
        
        // Clear existing content and ensure wrapper is clean
        sliderContent.innerHTML = '';
        
        // Immediately add new content
        data.forEach((item, index) => {
            const slide = document.createElement('div');
            slide.className = 'blog-slider__item swiper-slide';
            slide.dataset.id = index + 1; 
            
            // Use default placeholder initially for faster loading
            const imgUrl = item.image || `https://via.placeholder.com/400x300?text=${encodeURIComponent(item.title || 'Item ' + (index + 1))}`;
            
            slide.innerHTML = `
                <div class="blog-slider__img">
                    <img src="${imgUrl}" alt="${item.title || 'Slide ' + (index + 1)}">
                </div>
                <div class="blog-slider__content">
                    <div class="blog-slider__title">${item.title || 'Item ' + (index + 1)}</div>
                    <span class="blog-slider__skills">${item.skills || 'skills not available'}</span>
                    <div class="blog-slider__text">${item.text || item.description || 'No description available'}</div>
                    <a href="#0" class="blog-slider__button" data-project-id="project${index + 1}">READ MORE</a>
                </div>
            `;
            
            sliderContent.appendChild(slide);
        });
        
        // Clear existing pagination
        const paginationEl = document.querySelector('.blog-slider__pagination');
        if (paginationEl) {
            paginationEl.innerHTML = '';
            
            // Create custom pagination immediately
            for (let i = 0; i < data.length; i++) {
                const bullet = document.createElement('span');
                bullet.className = 'swiper-pagination-bullet';
                if (i === 0) bullet.classList.add('swiper-pagination-bullet-active');
                
                bullet.addEventListener('click', function() {
                    if (blogSliderInstance) {
                        blogSliderInstance.slideTo(i);
                    }
                });
                
                paginationEl.appendChild(bullet);
            }
        }
        
        // Initialize swiper immediately - don't wait for images
        initSwiper();
        
        function initSwiper() {
            try {
                blogSliderInstance = new Swiper('.blog-slider', {
                    spaceBetween: 30,
                    effect: 'fade',
                    speed: 400, // Faster transitions for better performance
                    loop: false,
                    pagination: {
                        el: '.blog-slider__pagination',
                        clickable: true,
                        type: 'custom'
                    },
                    on: {
                        slideChange: function() {
                            const activeIndex = this.activeIndex;
                            updateCarouselPosition(activeIndex);
                            
                            // Update bullet active state manually
                            const bullets = document.querySelectorAll('.swiper-pagination-bullet');
                            bullets.forEach((bullet, index) => {
                                if (index === activeIndex) {
                                    bullet.classList.add('swiper-pagination-bullet-active');
                                } else {
                                    bullet.classList.remove('swiper-pagination-bullet-active');
                                }
                            });
                        },
                        init: function() {
                            // Remove loading class once initialized
                            $('.blog-slider').removeClass('loading');
                            $(document).trigger('sliderInitialized');
                        }
                    },
                    initialSlide: 0
                });
                
                // Images will load in the background while slider is already usable
                preloadImages();
            } catch (e) {
                console.error('Error initializing Swiper:', e);
                $('.blog-slider').removeClass('loading');
            }
        }
        
        // Preload images in the background without blocking initialization
        function preloadImages() {
            document.querySelectorAll('.blog-slider__img img').forEach(img => {
                // Image is already loading/loaded through the src attribute
                // We just make sure to remove the loading indicator when all done
                if (img.complete) {
                    img.classList.add('loaded');
                } else {
                    img.onload = function() {
                        img.classList.add('loaded');
                    };
                    img.onerror = function() {
                        img.classList.add('error');
                    };
                }
            });
        }
    }

    // Function to update carousel content
    function updateCarousel(data) {
        // Clear existing content
        carouselContent.innerHTML = '';
        
        // Add new content
        data.forEach((item, index) => {
            const li = document.createElement('li');
            li.className = 'carousel__item';
            li.dataset.id = index; // Use index as ID to match blog slider
            li.dataset.pos = index; // Start with sequential positions
            
            // Create container for image only
            const content = document.createElement('div');
            content.className = 'carousel__item-content';
            
            // Add the image element
            const imgContainer = document.createElement('div');
            imgContainer.className = 'carousel__item-img-container';
            
            const img = document.createElement('img');
            img.className = 'carousel__item-image';
            img.src = item.image || `https://via.placeholder.com/300x200?text=${index+1}`;
            img.alt = item.title || `Item ${index+1}`;
            
            imgContainer.appendChild(img);
            content.appendChild(imgContainer);
            
            // No index number or title shown
            
            li.appendChild(content);
            
            // Add click event to sync with blog slider
            li.addEventListener('click', function() {
                const slideIndex = parseInt(this.dataset.id);
                
                // Go to that slide in the blog slider
                if (blogSliderInstance) {
                    blogSliderInstance.slideTo(slideIndex, 300);
                }
            });
            
            carouselContent.appendChild(li);
        });
        
        // Adjust positions so first item is centered
        repositionCarousel(0);
        
        // Adjust carousel items to fit their images
        if (window.adjustCarouselItems) {
            setTimeout(window.adjustCarouselItems, 100); // Small delay to ensure images start loading
        }
    }

    // Function to reposition carousel items relative to a center index
    function repositionCarousel(centerIndex) {
        const carouselItems = document.querySelectorAll('.carousel__item');
        
        carouselItems.forEach((item, index) => {
            item.dataset.pos = index - centerIndex;
        });
        
        initCarousel();
    }

    // Function to update carousel position based on slider
    function updateCarouselPosition(activeIndex) {
        repositionCarousel(activeIndex);
    }

    // Function to initialize/reinitialize carousel
    function initCarousel() {
        // This assumes the carousel.js has a function to initialize the carousel
        // If not, we'd implement the carousel functionality here
        
        // Check if carousel.js has an init function we can call
        if (typeof initializeCarousel === 'function') {
            initializeCarousel();
        } else {
            // Basic carousel functionality if carousel.js doesn't provide it
            const carouselItems = document.querySelectorAll('.carousel__item');
            
            carouselItems.forEach(item => {
                const position = parseInt(item.dataset.pos);
                
                // Apply transforms based on position
                item.style.transform = `translateX(${position * 150}%)`;
                
                // Apply active class to center item
                if (position === 0) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        }
    }

    // Load initial data and set up components - with async handling
    function initialize() {
        console.log('Initializing integration');
        
        currentCategory = 'Projects'; // Start with Category 2
        
        // Show loading indicator
        $('.blog-slider').addClass('loading');
        
        // Load data asynchronously
        loadCategoryData(currentCategory).then(data => {
            currentData = data;
            console.log('Initial data loaded, updating components');
            updateBlogSlider(data);
            updateCarousel(data);
        });
        
        // Set up category change listener for select dropdown
        if (categorySelect) {
            categorySelect.addEventListener('change', function() {
                currentCategory = this.value;
                $('.blog-slider').addClass('loading');
                
                loadCategoryData(currentCategory).then(data => {
                    currentData = data;
                    updateBlogSlider(data);
                    updateCarousel(data);
                });
            });
        }
        
        // Set up category carousel click handler
        const categoryItems = document.querySelectorAll('.category-carousel__item');
        categoryItems.forEach(item => {
            item.addEventListener('click', function() {
                currentCategory = this.dataset.value;
                $('.blog-slider').addClass('loading');
                
                loadCategoryData(currentCategory).then(data => {  // Missing parentheses around 'data' parameter
                    currentData = data;
                    updateBlogSlider(data);
                    updateCarousel(data);
                });
            });
        });
    }
    
    // Start the integration
    console.log('Starting integration');
    initialize();
});

/**
 * Converts a comma-separated skills string into styled skill tags
 * @param {string} skillsString - Comma separated skills
 * @returns {string} HTML for the styled skill tags
 */
function formatSkillsAsTags(skillsString) {
  if (!skillsString) return '';
  
  const skills = skillsString.split(',').map(skill => skill.trim()).filter(skill => skill);
  
  if (skills.length === 0) return '';
  
  const tagsHtml = skills.map(skill => 
    `<span class="skill-tag">${skill}</span>`
  ).join('');
  
  return `<div class="skill-tags">${tagsHtml}</div>`;
}

// Apply skill tags to all slides
function updateAllSkillTags() {
  document.querySelectorAll('.blog-slider__skills').forEach(function(element) {
    // Skip if already has multiple spans
    if (element.querySelectorAll('span').length > 1) return;
    
    // Get the text content from the single span
    const singleSpan = element.querySelector('span');
    if (!singleSpan) return;
    
    const skillsText = singleSpan.textContent;
    if (!skillsText) return;
    
    // Try to split the skills
    // First attempt with comma separation
    let skillsArray = skillsText.split(',');
    
    // If that didn't work (no commas), try to detect CamelCase or spaces
    if (skillsArray.length === 1) {
      skillsArray = skillsText
        // Insert space before capital letters
        .replace(/([A-Z])/g, ' $1')
        // Trim and split by spaces
        .trim().split(/\s+/);
    }
    
    // Filter out empty items
    skillsArray = skillsArray.filter(Boolean);
    
    if (skillsArray.length <= 1) return; // Nothing to split
    
    // Replace content with individual spans
    element.innerHTML = '';
    skillsArray.forEach(skill => {
      const span = document.createElement('span');
      span.textContent = skill.trim();
      element.appendChild(span);
    });
  });
}

/**
 * Ensure skills in sliders are properly formatted as tags
 */
function updateSliderSkillTags() {
  // Get all skills spans with comma-separated values in the blog slider
  document.querySelectorAll('.blog-slider__skills').forEach(function(element) {
    // Skip if already converted to tags (contains span elements)
    if (element.querySelector('span')) return;
    
    const skillsText = element.textContent;
    if (!skillsText) return;
    
    const skillsArray = skillsText.split(',').map(skill => skill.trim()).filter(Boolean);
    if (skillsArray.length === 0) return;
    
    const tagsHtml = skillsArray.map(skill => 
      `<span>${skill}</span>`
    ).join('');
    
    // Replace the content with properly formatted tags
    element.innerHTML = tagsHtml;
  });
}

// Run on page load and after category changes
document.addEventListener('DOMContentLoaded', function() {
  // Add timeout to ensure content is loaded
  setTimeout(updateSliderSkillTags, 500);
  
  // Update tags when category changes
  document.addEventListener('categoryChanged', function() {
    setTimeout(updateSliderSkillTags, 300);
  });
});

/**
 * Convert any skill tags to blog slider format
 */
function fixSkillTagsInSlider() {
  // Look for skill-tags in the slider and convert to blog-slider__skills
  document.querySelectorAll('.blog-slider .skill-tags').forEach(function(element) {
    const skillTags = element.querySelectorAll('.skill-tag');
    if (skillTags.length === 0) return;
    
    // Create new element with proper format
    const skillsDiv = document.createElement('div');
    skillsDiv.className = 'blog-slider__skills';
    
    skillTags.forEach(function(tag) {
      const span = document.createElement('span');
      span.textContent = tag.textContent;
      skillsDiv.appendChild(span);
    });
    
    // Replace the old element with the new one
    element.parentNode.replaceChild(skillsDiv, element);
  });
}

// Add to document ready
$(document).ready(function() {
  // Replace all skill spans with formatted tags
  function updateSkillTags() {
    $('.blog-slider__skills').each(function() {
      const skillsText = $(this).text();
      $(this).replaceWith(formatSkillsAsTags(skillsText));
    });
  }
  
  // Call this after your content is loaded
  // You might need to call this after any AJAX operations that load content
  setTimeout(updateSkillTags, 500);
  
  // Apply skill tags formatting after initial content load
  setTimeout(updateAllSkillTags, 500);
  
  // Also update tags after any swiper slide change
  if (window.swiper) {
    window.swiper.on('slideChange', function() {
      setTimeout(updateAllSkillTags, 50);
    });
  }
  
  // Fix skills display in slider
  setTimeout(fixSkillTagsInSlider, 500);
  
  // Also fix after category changes
  $(document).on('categoryChanged', function() {
    setTimeout(fixSkillTagsInSlider, 300);
  });
});

// Add MutationObserver to continuously check for and fix skill tags
function setupSkillTagObserver() {
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes.length) {
        fixSkillTagsInSlider();
      }
    });
  });
  
  const sliderContent = document.getElementById('slider-content');
  if (sliderContent) {
    observer.observe(sliderContent, { childList: true, subtree: true });
  }
}

// Setup the observer when the page loads
$(document).ready(setupSkillTagObserver);

// Separate the Integration module to avoid conflicts with the existing code
(function() {
    // Store all data
    let projectData = [];
    let currentCategory = 'Certifications';
    
    function init() {
        console.log("Integration module initializing");
        // Load project data
        fetch('data/projects.json')
            .then(response => response.json())
            .then(data => {
                projectData = data;
                console.log("Projects data loaded:", data);
                
                // Set up category carousel
                if (window.CategoryCarousel) {
                    window.CategoryCarousel.setOnCategorySelectedCallback(onCategorySelected);
                }
                
                // Set up carousel
                if (window.Carousel) {
                    window.Carousel.setOnItemSelectedCallback(onCarouselItemSelected);
                }
                
                // Initial load
                loadProjectsByCategory(currentCategory);
            })
            .catch(error => {
                console.error('Error loading project data:', error);
                // Load fallback data
                loadFallbackData();
            });
    }
    
    function loadFallbackData() {
        // Fallback data in case JSON loading fails
        const fallbackData = [
            {
                category: 'Certifications',
                featured: [
                    { 
                        id: 'c1f1',
                        title: 'Category 1 Featured 1',
                        description: 'Featured item for category 1',
                        image: 'images/placeholder-1.jpg'
                    }
                ],
                items: [
                    { 
                        id: 'c1i1',
                        title: 'Category 1 - Item 1', 
                        description: 'Description for item 1',
                        image: 'images/placeholder-1.jpg'
                    },
                    { 
                        id: 'c1i2',
                        title: 'Category 1 - Item 2', 
                        description: 'Description for item 2',
                        image: 'images/placeholder-2.jpg'
                    }
                ]
            },
            {
                category: 'Projects',
                featured: [
                    { 
                        id: 'c2f1',
                        title: 'Category 2 Featured 1',
                        description: 'Featured item for category 2',
                        image: 'images/placeholder-3.jpg'
                    }
                ],
                items: [
                    { 
                        id: 'c2i1',
                        title: 'Category 2 - Item 1', 
                        description: 'Description for item 1',
                        image: 'images/placeholder-3.jpg'
                    },
                    { 
                        id: 'c2i2',
                        title: 'Category 2 - Item 2', 
                        description: 'Description for item 2',
                        image: 'images/placeholder-4.jpg'
                    },
                    { 
                        id: 'c2i3',
                        title: 'Category 2 - Item 3', 
                        description: 'Description for item 3',
                        image: 'images/placeholder-5.jpg'
                    }
                ]
            },
            {
                category: 'research_papers',
                featured: [
                    { 
                        id: 'c3f1',
                        title: 'Category 3 Featured 1',
                        description: 'Featured item for category 3',
                        image: 'images/placeholder-6.jpg'
                    }
                ],
                items: [
                    { 
                        id: 'c3i1',
                        title: 'Category 3 - Item 1', 
                        description: 'Description for item 1',
                        image: 'images/placeholder-6.jpg'
                    },
                    { 
                        id: 'c3i2',
                        title: 'Category 3 - Item 2', 
                        description: 'Description for item 2',
                        image: 'images/placeholder-7.jpg'
                    }
                ]
            }
        ];
        
        projectData = fallbackData;
        console.log("Using fallback data:", projectData);
        
        loadProjectsByCategory(currentCategory);
    }
    
    function loadProjectsByCategory(category) {
        currentCategory = category;
        const categoryData = projectData.find(cat => cat.category === category);
        
        if (!categoryData) {
            console.error('Category not found:', category);
            return;
        }
        
        console.log(`Loading projects for ${category}:`, categoryData);
        
        // Load blog slider items
        if (window.BlogSlider && categoryData.featured) {
            window.BlogSlider.loadSliderItems(categoryData.featured);
        }
        
        // Load carousel items with proper image paths
        if (window.Carousel && categoryData.items) {
            // Make sure all items have an image property
            const itemsWithImages = categoryData.items.map(item => {
                // Debug log
                console.log(`Processing carousel item: ${item.title}`, item);
                
                // Create a copy of the item
                const processedItem = { ...item };
                
                // If no image but has images array, use the first one
                if (!processedItem.image && processedItem.images && processedItem.images.length) {
                    processedItem.image = processedItem.images[0];
                    console.log(`Using image from images array: ${processedItem.image}`);
                }
                
                // If still no image, use a placeholder
                if (!processedItem.image) {
                    processedItem.image = `https://via.placeholder.com/300x200?text=${encodeURIComponent(processedItem.title || 'Project')}`;
                    console.log(`Using placeholder image: ${processedItem.image}`);
                }
                
                return processedItem;
            });
            
            console.log("Final carousel items with images:", itemsWithImages);
            window.Carousel.loadCarouselItems(itemsWithImages);
        }
    }
    
    function onCategorySelected(category) {
        console.log(`Category selected: ${category}`);
        loadProjectsByCategory(category);
    }
    
    function onCarouselItemSelected(item) {
        console.log(`Carousel item selected:`, item);
        if (window.ProjectContent) {
            window.ProjectContent.loadProject(item);
        }
    }
    
    // Get item data by id from current category
    function getItemById(id) {
        const categoryData = projectData.find(cat => cat.category === currentCategory);
        if (categoryData && categoryData.items) {
            return categoryData.items.find(item => item.id === id);
        }
        return null;
    }
    
    // Public API for the integration module
    window.IntegrationModule = {
        init: init,
        getItemById: getItemById
    };
})();

// Listen for category changes and swiper events
document.addEventListener('categoryChanged', function(e) {
  console.log('Category changed to:', e.detail.category);
  setTimeout(updateAllSkillTags, 300);
});

// For any AJAX calls or dynamic content updates
$(document).ajaxComplete(function() {
  setTimeout(updateAllSkillTags, 200);
});

/**
 * Ensure skills are properly formatted as tags after category changes
 */
function ensureSkillTagsFormatting() {
  // Select all .blog-slider__skills elements
  document.querySelectorAll('.blog-slider__skills').forEach(function(skillsContainer) {
    // Skip if already properly formatted (has multiple spans)
    if (skillsContainer.querySelectorAll('span').length > 1) return;
    
    // Get all text content
    const text = skillsContainer.textContent.trim();
    if (!text) return;
    
    // Try to split by commas first
    let skills = text.split(',');
    
    // If no commas found, try to identify CamelCase or spaces
    if (skills.length <= 1) {
      skills = text
        .replace(/([A-Z])/g, ' $1') // Insert space before capitals
        .trim()
        .split(/\s+/);
    }
    
    // Filter and clean
    skills = skills.filter(skill => skill.trim()).map(skill => skill.trim());
    
    // Rebuild with proper spans
    if (skills.length > 0) {
      skillsContainer.innerHTML = '';
      skills.forEach(skill => {
        const span = document.createElement('span');
        span.textContent = skill;
        skillsContainer.appendChild(span);
      });
    }
  });
}

// Add event listener for category-carousel items
document.addEventListener('DOMContentLoaded', function() {
  // Add category change listener
  document.querySelectorAll('.category-carousel__item').forEach(item => {
    item.addEventListener('click', function() {
      // Wait for content to load after category change
      setTimeout(ensureSkillTagsFormatting, 500);
    });
  });
  
  // Also run on initial page load
  setTimeout(ensureSkillTagsFormatting, 1000);
  
  // Run periodically to catch any missed updates
  setInterval(ensureSkillTagsFormatting, 2000);
});
