// This is a modified version of carousel.js that works with the integration

(function() {
    let carousel = {
        init: function() {
            this.carouselList = document.getElementById('carousel-content');
            this.setupEventListeners();
            console.log('Carousel initialized');
        },

        setupEventListeners: function() {
            // Add carousel navigation events if needed
            let self = this;
            
            // Optional: Add touch/swipe support
            if (this.carouselList) {
                this.carouselList.addEventListener('touchstart', handleTouchStart, false);
                this.carouselList.addEventListener('touchmove', handleTouchMove, false);
            }
            
            // Add navigation buttons if they exist
            const prevBtn = document.querySelector('.carousel-prev');
            if (prevBtn) {
                prevBtn.addEventListener('click', function() {
                    self.moveCarousel('prev');
                });
            }
            
            const nextBtn = document.querySelector('.carousel-next');
            if (nextBtn) {
                nextBtn.addEventListener('click', function() {
                    self.moveCarousel('next');
                });
            }
            
            let xDown = null;
            function handleTouchStart(evt) {
                xDown = evt.touches[0].clientX;
            }
            
            function handleTouchMove(evt) {
                if (!xDown) return;
                
                let xUp = evt.touches[0].clientX;
                let xDiff = xDown - xUp;
                
                if (xDiff > 0) {
                    // Swipe left - next
                    self.moveCarousel('next');
                } else {
                    // Swipe right - prev
                    self.moveCarousel('prev');
                }
                
                xDown = null;
            }
        },

        loadCarouselItems: function(items) {
            if (!items || !items.length || !this.carouselList) {
                console.error("Cannot load carousel items - missing data or DOM element");
                return;
            }
            
            console.log("Loading carousel items:", items.length, "items");
            this.items = items; // Store for later reference
            
            // Clear the carousel
            this.carouselList.innerHTML = '';
            
            // For initial setup, always show exactly 5 items with proper wrapping
            const totalItems = items.length;
            
            // If we have fewer than 5 items, just display what we have
            const displayCount = Math.min(5, totalItems);
            
            // For the initial position, we want:
            // If we have 5+ items:
            //   Last two items at positions -2, -1
            //   First item at position 0
            //   Second and third items at positions 1, 2
            // If we have fewer than 5 items, center them appropriately
            
            let initialIndices = [];
            if (totalItems >= 5) {
                // Use the pattern from the image: last 2 items then first 3 items
                initialIndices = [
                    totalItems - 2, // Position -2
                    totalItems - 1, // Position -1
                    0,              // Position 0 (center/active)
                    1,              // Position 1
                    2               // Position 2
                ];
            } else {
                // For fewer items, simply arrange them around position 0
                for (let i = 0; i < totalItems; i++) {
                    initialIndices.push(i);
                }
            }
            
            // Create carousel items based on our calculated indices
            for (let i = 0; i < displayCount; i++) {
                // Calculate position (-2, -1, 0, 1, 2)
                let position;
                if (totalItems < 5) {
                    // For fewer than 5 items, center them
                    position = i - Math.floor(displayCount / 2);
                } else {
                    // For 5+ items, use positions -2 through 2
                    position = i - 2;
                }
                
                // Get item index with wrapping
                const itemIndex = initialIndices[i];
                
                // Create the carousel item
                this.createCarouselItem(items[itemIndex], position, itemIndex);
            }

            // Adjust size of the active (centered) item
            const activeItem = this.carouselList.querySelector('.carousel__item[data-pos="0"]');
            if (activeItem) {
                this.adjustActiveItemSize(activeItem);
            }
        },

        createCarouselItem: function(item, position, index) {
            const li = document.createElement('li');
            li.className = 'carousel__item';
            li.dataset.pos = position;
            li.dataset.id = item.id || index;
            li.dataset.index = index; // Store original index for reference
            
            // Add active class to center item (position 0)
            if (position === 0) {
                li.classList.add('active');
            }
            
            // Create container for image and title
            const itemContent = document.createElement('div');
            itemContent.className = 'carousel__item-content';
            
            // Create and add image
            const imgContainer = document.createElement('div');
            imgContainer.className = 'carousel__item-img-container';
            const img = document.createElement('img');
            
            const imageSrc = item.image || 
                            (item.images && item.images.length ? item.images[0] : null) || 
                            `https://via.placeholder.com/150x150?text=${encodeURIComponent(item.title || 'Item')}`;
            
            img.src = imageSrc;
            img.alt = item.title || 'Project image';
            img.className = 'carousel__item-image';
            
            imgContainer.appendChild(img);
            itemContent.appendChild(imgContainer);
            
            // Add title
            const title = document.createElement('div');
            title.className = 'carousel__item-title';
            title.textContent = item.title || '';
            itemContent.appendChild(title);
            
            li.appendChild(itemContent);
            this.carouselList.appendChild(li);
            
            // Add click event
            li.addEventListener('click', () => {
                if (position !== 0) { // Only handle clicks on non-center items
                    this.update(li);
                } else if (typeof this.onItemSelected === 'function') {
                    this.onItemSelected(item);
                }
            });
        },

        adjustActiveItemSize: function(activeItem) {
            const img = activeItem.querySelector('.carousel__item-image');
            if (!img) return;
            
            if (img.complete) {
                this.resizeItemToImage(activeItem, img);
            } else {
                img.onload = () => this.resizeItemToImage(activeItem, img);
            }
        },

        resizeItemToImage: function(item, img) {
            // Get natural image dimensions
            const imgWidth = img.naturalWidth;
            const imgHeight = img.naturalHeight;
            
            // Use CSS variables to keep aspect ratio but within bounds
            const aspectRatio = imgWidth / imgHeight;
            
            // Calculate dimensions while maintaining aspect ratio and respecting min/max limits
            let newWidth, newHeight;
            
            // Get CSS variable values (default bounds)
            const style = getComputedStyle(item);
            const minWidth = parseInt(style.getPropertyValue('--active-min-width')) || 200;
            const maxWidth = parseInt(style.getPropertyValue('--active-max-width')) || 300;
            const minHeight = parseInt(style.getPropertyValue('--active-min-height')) || 150;
            const maxHeight = parseInt(style.getPropertyValue('--active-max-height')) || 220;
            
            if (aspectRatio > 1) {
                // Width-dominant image
                newWidth = Math.min(maxWidth, Math.max(minWidth, imgWidth));
                newHeight = newWidth / aspectRatio;
                
                // Check if height is within bounds
                if (newHeight < minHeight) {
                    newHeight = minHeight;
                    newWidth = newHeight * aspectRatio;
                } else if (newHeight > maxHeight) {
                    newHeight = maxHeight;
                    newWidth = newHeight * aspectRatio;
                }
            } else {
                // Height-dominant image
                newHeight = Math.min(maxHeight, Math.max(minHeight, imgHeight));
                newWidth = newHeight * aspectRatio;
                
                // Check if width is within bounds
                if (newWidth < minWidth) {
                    newWidth = minWidth;
                    newHeight = newWidth / aspectRatio;
                } else if (newWidth > maxWidth) {
                    newWidth = maxWidth;
                    newHeight = newWidth / aspectRatio;
                }
            }
            
            // Apply new dimensions only to active items
            if (item.classList.contains('active')) {
                item.style.width = `${newWidth}px`;
                item.style.height = `${newHeight}px`;
            }
        },

        update: function(newActive) {
            if (!this.carouselList || !this.items || !this.items.length) return;
            
            const newActivePos = parseInt(newActive.dataset.pos);
            if (isNaN(newActivePos)) return;
            
            // Get all carousel items
            const items = Array.from(this.carouselList.querySelectorAll('.carousel__item'));
            if (items.length === 0) return;
            
            // First find the current center item and remove its active state
            const current = items.find(item => item.dataset.pos == "0");
            if (current) {
                current.classList.remove('active');
                current.style.width = '';
                current.style.height = '';
            }
            
            // Update all positions - EXACTLY as in your example code
            items.forEach(item => {
                const currentPos = parseInt(item.dataset.pos);
                const newPos = this.getPos(currentPos, newActivePos);
                
                // Update the position
                item.dataset.pos = newPos;
                
                // Set active state on new center item
                if (newPos === 0) {
                    item.classList.add('active');
                    this.adjustActiveItemSize(item);
                    
                    // Trigger callback for item selection
                    if (typeof this.onItemSelected === 'function') {
                        const index = parseInt(item.dataset.index);
                        if (!isNaN(index) && index >= 0 && index < this.items.length) {
                            this.onItemSelected(this.items[index]);
                        }
                    }
                }
            });
            
            // Apply circular logic and maintain 5 items
            this.maintainFiveItemsWithCircularity();
        },

        getPos: function(current, active) {
            // EXACT implementation from the example code
            const diff = current - active;
            
            if (Math.abs(diff) > 2) {
                return -current;
            }
            
            return diff;
        },
        
        maintainFiveItemsWithCircularity: function() {
            if (!this.carouselList || !this.items || !this.items.length) return;
            
            const items = Array.from(this.carouselList.querySelectorAll('.carousel__item'));
            
            // First get current positions and find the center item
            const centerItem = items.find(item => item.dataset.pos == "0");
            if (!centerItem) return;
            
            const centerIndex = parseInt(centerItem.dataset.index);
            if (isNaN(centerIndex)) return;
            
            // Remove any items that are now out of our visible range -2 to 2
            items.forEach(item => {
                const pos = parseInt(item.dataset.pos);
                if (pos < -2 || pos > 2) {
                    item.remove();
                }
            });
            
            // Check which positions we now have and which are missing
            const remainingItems = Array.from(this.carouselList.querySelectorAll('.carousel__item'));
            const existingPositions = remainingItems.map(item => parseInt(item.dataset.pos));
            const totalItems = this.items.length;
            
            // Add missing positions
            for (let pos = -2; pos <= 2; pos++) {
                if (!existingPositions.includes(pos)) {
                    // Calculate the item index for this position
                    // Position relative to center with circular wrapping
                    const targetIndex = (centerIndex + pos + totalItems) % totalItems;
                    
                    // Create the item at this position
                    const itemData = this.items[targetIndex];
                    this.createCarouselItem(itemData, pos, targetIndex);
                }
            }
        },

        moveCarousel: function(direction) {
            if (direction !== 'next' && direction !== 'prev') return;
            
            const items = Array.from(this.carouselList.querySelectorAll('.carousel__item'));
            const shift = direction === 'next' ? 1 : -1;
            
            // Find the item that will become active
            const targetItem = items.find(item => parseInt(item.dataset.pos) === -shift);
            
            if (targetItem) {
                this.update(targetItem);
            }
        },

        selectCarouselItem: function(itemEl) {
            // This is now handled by update()
            this.update(itemEl);
        },

        // Legacy method - now just a wrapper
        centerSelectedItem: function() {
            // No longer needed as we use absolute positioning with data-pos
        },

        // Set callback for item selection
        setOnItemSelectedCallback: function(callback) {
            this.onItemSelected = callback;
        },

        // Helper function to get item data by ID
        getItemData: function(id) {
            if (!this.items) return null;
            return this.items.find(item => item.id === id);
        }
    };

    window.Carousel = carousel;
    
    // Initialize the carousel when the DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        window.Carousel.init();
        console.log("Carousel DOM ready initialization");
    });
})();
