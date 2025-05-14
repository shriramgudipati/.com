$(document).ready(function() {
    console.log("Project content loader initialized");
    
    // Track current category - initialize from the active carousel item
    let currentCategory = $('.category-carousel__item.active').data('value') || 'category2';
    
    // Listen for category changes
    $('#category-carousel-content').on('click', '.category-carousel__item', function() {
        currentCategory = $(this).data('value');
        console.log("Category changed to:", currentCategory);
    });
    
    // Attach click handler directly to Read More buttons
    $(document).on('click', '.blog-slider__button', function(e) {
        e.preventDefault();
        console.log("Read More button clicked");
        
        // Get item ID from the parent slider item
        const slideId = $(this).closest('.blog-slider__item').data('id');
        const projectId = 'project' + slideId;
        
        console.log("Loading content for:", currentCategory, projectId);
        loadProjectContent(currentCategory, projectId);
    });
    
    function loadProjectContent(category, projectId) {
        // Use the corresponding content JSON file
        const jsonUrl = `data/${category}_content.json`;
        console.log("Loading from:", jsonUrl);
        
        $.ajax({
            url: jsonUrl,
            dataType: 'json',
            success: function(data) {
                if (!data || !data.projects) {
                    console.error('Invalid JSON data structure in', jsonUrl);
                    showFallbackContent(category, projectId);
                    return;
                }
                
                // Find the project in the data
                const project = data.projects.find(p => p.id === projectId);
                if (!project) {
                    console.error(`Project ${projectId} not found in ${jsonUrl}`);
                    showFallbackContent(category, projectId);
                    return;
                }
                
                // Display the content
                showProjectContent(project);
            },
            error: function(xhr, status, error) {
                console.error('Error loading', jsonUrl, ':', error);
                showFallbackContent(category, projectId);
            }
        });
    }
    
    function showProjectContent(project) {
        // Create HTML content
        let descriptionHtml = '';
        if (Array.isArray(project.description)) {
            project.description.forEach(paragraph => {
                descriptionHtml += `<p>${paragraph}</p>`;
            });
        } else {
            descriptionHtml = `<p>${project.description}</p>`;
        }
        
        const contentHtml = `
            <div>
                <h2>${project.title}</h2>
                <em>${project.subtitle || 'Project Details'}</em>
                ${descriptionHtml}
            </div>
        `;
        
        // Update the container and show it
        $('#project-content-container').html(contentHtml);
        $('.cd-project-content').addClass('is-visible');
    }
    
    function showFallbackContent(category, projectId) {
        // Get the item title from the slider if possible
        let title = "Project Details";
        const slideId = projectId.replace('project', '');
        const slideItem = $(`.blog-slider__item[data-id="${slideId}"]`);
        
        if (slideItem.length) {
            const titleElement = slideItem.find('.blog-slider__title');
            if (titleElement.length) {
                title = titleElement.text();
            }
        }
        
        const content = {
            title: title,
            subtitle: `${category.charAt(0).toUpperCase() + category.slice(1)} Project`,
            description: [
                "Detailed project information will be available soon.",
                "In the meantime, please explore our other projects or contact us for more information."
            ]
        };
        
        showProjectContent(content);
    }
    
    // Connect to existing slider items when they change
    function connectReadMoreButtons() {
        $('.blog-slider__item').each(function(index) {
            $(this).attr('data-id', index + 1);
            const button = $(this).find('.blog-slider__button');
            if (button.length) {
                console.log(`Connected button for item ${index + 1}`);
            }
        });
    }
    
    // Initialize
    setTimeout(connectReadMoreButtons, 1000);
    
    // Listen for slider updates
    $(document).on('sliderUpdated', connectReadMoreButtons);
});
