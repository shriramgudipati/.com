document.addEventListener('DOMContentLoaded', function() {
    // Reference to components
    const sliderContent = document.getElementById('slider-content');
    const carouselContent = document.getElementById('carousel-content');
    const categorySelect = document.getElementById('category');
    
    let blogSliderInstance;
    let currentCategory = 'category2'; // Default to Category 2
    let currentData = [];

    // Function to load data based on category - with optimized loading
    function loadCategoryData(category) {
        console.log('Loading data for category:', category);
        
        // Add a loading class to the slider
        $('.blog-slider').addClass('loading');
        
        // Fallback data in case JSON loading fails
        const fallbackData = {
            category1: [
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
            category2: [
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
            category3: [
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
                item.style.transform = `translateX(${position * 100}%)`;
                
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
        
        currentCategory = 'category2'; // Start with Category 2
        
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

// Separate the Integration module to avoid conflicts with the existing code
(function() {
    // Store all data
    let projectData = [];
    let currentCategory = 'category1';
    
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
                category: 'category1',
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
                category: 'category2',
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
                category: 'category3',
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
