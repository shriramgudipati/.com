/**
 * Project manager script for displaying projects in a zig-zag layout
 */

// Track the current category and data
let currentCategory = 'Projects';
let currentData = [];

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Load the default category on page load
    setTimeout(function() {
        loadCategory('Projects');
    }, 500);

    // Set up category click handlers
    document.querySelectorAll('.category-carousel__item').forEach(item => {
        item.addEventListener('click', function() {
            const category = this.getAttribute('data-value');
            if (category) {
                loadCategory(category);
            }
        });
    });
});

/**
 * Load a specific category's projects
 * @param {string} category - The category to load
 */
function loadCategory(category) {
    console.log(`Loading category: ${category}`);
    
    // Save current scroll position
    const scrollPosition = window.scrollY;
    
    document.querySelectorAll('.category-carousel__item').forEach(item => {
        if (item.getAttribute('data-value') === category) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
    
    // Update the current category
    currentCategory = category;
    
    // Show loading state
    const container = document.getElementById('projects-container');
    container.innerHTML = '<div class="loading">Loading projects...</div>';
      // Fetch data from the JSON file
    fetch(`data/${category}.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Store current data
            currentData = data;
            
            console.log('Loaded data:', data); // Log the loaded data
            
            // Render the projects
            renderProjects(data);
            
            // Restore scroll position after content is loaded
            window.scrollTo({
                top: scrollPosition,
                behavior: 'instant' // Use 'instant' to avoid animation
            });
        })
        .catch(error => {
            console.error('Error loading category data:', error);
            container.innerHTML = `<div class="error">Error loading projects. Please try again.</div>`;
            
            // Still restore scroll position on error
            window.scrollTo({
                top: scrollPosition,
                behavior: 'instant'
            });
        });
}

/**
 * Render projects in the zig-zag layout
 * @param {Array} projects - Array of project objects
 */
function renderProjects(projects) {
    const container = document.getElementById('projects-container');
    
    // Clear previous content
    container.innerHTML = '';
    
    if (!projects || !Array.isArray(projects) || projects.length === 0) {
        container.innerHTML = '<div class="no-projects">No projects found for this category.</div>';
        return;
    }
    
    // Create project cards
    projects.forEach((project, index) => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.setAttribute('data-id', project.id || index);
        
        // Format skills as a string
        const skillsText = Array.isArray(project.skills) ? project.skills.join(' • ') : 
                           (project.skills || '');
        
        // Prepare the image URL (with a fallback)
        const imageUrl = project.image || `https://via.placeholder.com/800x600?text=${encodeURIComponent(project.title || 'Project')}`;
          // Create card content
        card.innerHTML = `
            <div class="project-image">
                <img src="${imageUrl}" alt="${project.title || 'Project Image'}">
            </div>
            <div class="project-content">
                <h2 class="project-title">${project.title || 'Untitled Project'}</h2>
                <div class="project-skills">${skillsText}</div>
                <p class="project-description">${project.description || project.text || 'No description available'}</p>
                <a href="content.html?category=${encodeURIComponent(currentCategory)}&item=${index}" class="project-button" data-index="${index}" data-project-id="${project.id || ''}">READ MORE</a>
            </div>
        `;
        
        // Add the card to the container
        container.appendChild(card);
    });
      // Add click event listeners to all READ MORE buttons
    document.querySelectorAll('.project-button').forEach(button => {
        button.addEventListener('click', function(e) {
            const index = this.getAttribute('data-index');
            if (index !== null) {
                console.log(`Clicked Read More for project at index ${index}`);
                console.log(`Project data:`, currentData[index]);
                console.log(`Navigating to content.html with category=${currentCategory} and item=${index}`);
                
                // To debug, show the URL in the console
                const targetUrl = `content.html?category=${encodeURIComponent(currentCategory)}&item=${index}`;
                console.log(`Target URL: ${targetUrl}`);
                
                // Navigation is handled by the href attribute, but let's ensure it works
                if (!this.getAttribute('href') || this.getAttribute('href') === '#') {
                    console.log('Fixing missing href attribute');
                    // Prevent default if no proper href is set
                    e.preventDefault();
                    // Navigate programmatically
                    window.location.href = targetUrl;
                }
            }
        });
    });
}

// Get the current category
function getCurrentCategory() {
    return currentCategory || 'Projects';
}
