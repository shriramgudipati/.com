$(document).ready(function() {
    console.log("Project content loader initialized");
    
    // Track current category - initialize from the active carousel item
    let currentCategory = $('.category-carousel__item.active').data('value') || 'Projects';
    
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
        
        // Create appropriate ID based on category
        let projectId;
        if (currentCategory === 'Certifications') {
            projectId = 'certification' + slideId;
        } else if (currentCategory === 'research_papers') {
            projectId = 'research_paper' + slideId;
        } else {
            // Default to 'project' prefix for Projects and any other categories
            projectId = 'project' + slideId;
        }
        
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
        // Generate skills carousel HTML first
        const skillsCarouselHtml = formatSkillsCarousel(project.skills);
        
        // Create description HTML - updated to handle mixed content (text and images)
        let descriptionHtml = '';
        
        // Check if description is the new format (array of objects) or old format (array of strings)
        if (Array.isArray(project.description)) {
            if (project.description.length > 0 && typeof project.description[0] === 'object') {
                // New format with mixed content
                project.description.forEach(item => {
                    if (item.type === 'paragraph') {
                        descriptionHtml += `<p>${item.content}</p>`;
                    } else if (item.type === 'image') {
                        descriptionHtml += `
                            <figure class="content-image">
                                <img src="${item.src}" alt="${item.alt || ''}" class="project-content-img">
                                ${item.caption ? `<figcaption>${item.caption}</figcaption>` : ''}
                            </figure>
                        `;
                    } else if (item.type === 'video') {
                        // Use the createVideoHtml function to generate correct HTML for videos
                        descriptionHtml += createVideoHtml(item);
                    } else if (item.type === 'image-row') {
                        // Handle image-row content type
                        const rowDiv = document.createElement('div');
                        rowDiv.className = 'image-row';
                        rowDiv.style.display = 'flex';
                        rowDiv.style.justifyContent = 'space-between';
                        rowDiv.style.flexWrap = 'wrap';
                        rowDiv.style.marginBottom = '1.5em';
                        
                        item.images.forEach(image => {
                            const figureEl = document.createElement('figure');
                            figureEl.style.margin = '0';
                            figureEl.style.width = `${item.widthPercentage || 48}%`;
                            
                            const imgEl = document.createElement('img');
                            imgEl.src = image.src;
                            imgEl.alt = image.alt || '';
                            imgEl.style.width = '100%';
                            imgEl.style.height = 'auto';
                            imgEl.style.borderRadius = '8px';
                            
                            const captionEl = document.createElement('figcaption');
                            captionEl.textContent = image.caption || '';
                            captionEl.style.textAlign = 'center';
                            captionEl.style.fontSize = '1.2rem';
                            captionEl.style.marginTop = '8px';
                            
                            figureEl.appendChild(imgEl);
                            figureEl.appendChild(captionEl);
                            rowDiv.appendChild(figureEl);
                        });
                        
                        descriptionHtml += rowDiv.outerHTML;
                    }
                });
            } else {
                // Old format (array of strings) - for backward compatibility
                project.description.forEach(paragraph => {
                    descriptionHtml += `<p>${paragraph}</p>`;
                });
            }
        } else if (typeof project.description === 'string') {
            // Single string format - for backward compatibility
            descriptionHtml = `<p>${project.description}</p>`;
        }
        
        // Create content HTML with skills carousel placed between subtitle and description
        const contentHtml = `
            <div>
                <h2>${project.title}</h2>
                <em>${project.subtitle || 'Project Details'}</em>
                
                ${skillsCarouselHtml}
                
                <div class="project-description">
                    ${descriptionHtml}
                </div>
            </div>
        `;
        
        // Update the container and show it
        $('#project-content-container').html(contentHtml);
        $('.cd-project-content').addClass('is-visible');
        
        // Initialize the skills carousel
        initSkillsCarousel();
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
    
    // Function to build carousel items from skills array
    function buildSkillsCarouselItems(skills) {
      if (!skills || !Array.isArray(skills) || skills.length === 0) {
        return '<li class="skills-carousel__item" data-pos="0">No skills listed</li>';
      }
      
      // Generate HTML for each skill item
      return skills.map((skill, index) => {
        // Determine position for initial state
        let position = 0;
        if (index === 0) position = 0;
        else if (index === 1) position = 1;
        else if (index === skills.length - 1) position = -1;
        else if (index === 2) position = 2;
        else if (index === skills.length - 2) position = -2;
        else position = index > 2 ? 2 : -2; // Others go to the edges
        
        return `
          <li class="skills-carousel__item" data-pos="${position}" ${index === 0 ? 'data-active="true"' : ''}>
            <span>${skill}</span>
          </li>
        `;
      }).join('');
    }
    
    // Function to initialize the skills carousel
    function initSkillsCarousel() {
      const carouselList = document.querySelector('.skills-carousel__list');
      if (!carouselList) return;
      
      const carouselItems = document.querySelectorAll('.skills-carousel__item');
      const elems = Array.from(carouselItems);
      
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
    }
    
    // Function to update carousel positions when clicked
    function updateSkillsCarousel(newActive, elems) {
      const newActivePos = parseInt(newActive.dataset.pos);
      
      // Remove active status and illumination from current active
      elems.forEach(elem => {
        if (elem.dataset.active === "true") {
          elem.removeAttribute('data-active');
          elem.classList.remove('illuminated');
        }
      });
      
      // Set new active and add illumination
      newActive.dataset.active = "true";
      newActive.classList.add('illuminated');
      
      // Update positions of all items
      elems.forEach(item => {
        const itemPos = parseInt(item.dataset.pos);
        item.dataset.pos = getSkillsCarouselPos(itemPos, newActivePos);
      });
    }
    
    // Calculate new positions for carousel items
    function getSkillsCarouselPos(current, active) {
      const diff = current - active;
      
      if (Math.abs(diff) > 2) {
        return -current;
      }
      
      return diff;
    }
    
    /**
     * Formats skills array into a carousel HTML
     * @param {Array} skills - Array of skills from the JSON data
     * @returns {string} HTML for the skills carousel
     */
    function formatSkillsCarousel(skills) {
        if (!skills || !Array.isArray(skills) || skills.length === 0) return '';
        
        let skillsHtml = '<div class="skills-carousel-container">';
        skillsHtml += '<h2 class="skills-heading-illuminated"><center><span>Skills</span></center><div class="stage-light"><div class="light-beam"></div><div class="light-rays"></div></div></h2>';
        skillsHtml += '<div class="skills-carousel">';
        skillsHtml += '<ul class="skills-carousel__list">';
        
        skills.forEach((skill, index) => {
            const position = index === 0 ? 0 : (index % 2 === 0 ? -(Math.ceil(index/2)) : Math.ceil(index/2));
            const isActive = index === 0 ? 'true' : 'false';
            const activeClass = index === 0 ? 'illuminated' : '';
            
            skillsHtml += `<li class="skills-carousel__item ${activeClass}" data-pos="${position}" data-active="${isActive}">`;
            skillsHtml += `<span>${skill}</span>`;
            skillsHtml += '</li>';
        });
        
        skillsHtml += '</ul></div></div>';
        return skillsHtml;
    }
    
    // Function to render project content
    function renderProjectContent(project) {
        const contentContainer = $('#project-content-container');
        contentContainer.empty();
        
        // Set project title and subtitle
        const title = $('<h2>').text(project.title);
        const subtitle = $('<em>').text(project.subtitle || 'Project Details');
        
        contentContainer.append(title, subtitle);
        
        // Loop through description items
        project.description.forEach(item => {
            let element;
            
            switch(item.type) {
                case 'paragraph':
                    element = $('<p>').html(item.content);
                    break;
                    
                case 'image':
                    element = $('<figure>');
                    const img = $('<img>').attr({
                        src: item.src,
                        alt: item.alt || ''
                    });
                    element.append(img);
                    
                    if (item.caption) {
                        element.append($('<figcaption>').text(item.caption));
                    }
                    break;
                    
                case 'video':
                    element = createVideoElement(item);
                    break;
                    
                case 'image-row':
                    // Handle image-row content type
                    const rowDiv = document.createElement('div');
                    rowDiv.className = 'image-row';
                    rowDiv.style.display = 'flex';
                    rowDiv.style.justifyContent = 'space-between';
                    rowDiv.style.flexWrap = 'wrap';
                    rowDiv.style.marginBottom = '1.5em';
                    
                    item.images.forEach(image => {
                        const figureEl = document.createElement('figure');
                        figureEl.style.margin = '0';
                        figureEl.style.width = `${item.widthPercentage || 48}%`;
                        
                        const imgEl = document.createElement('img');
                        imgEl.src = image.src;
                        imgEl.alt = image.alt || '';
                        imgEl.style.width = '100%';
                        imgEl.style.height = 'auto';
                        imgEl.style.borderRadius = '8px';
                        
                        const captionEl = document.createElement('figcaption');
                        captionEl.textContent = image.caption || '';
                        captionEl.style.textAlign = 'center';
                        captionEl.style.fontSize = '1.2rem';
                        captionEl.style.marginTop = '8px';
                        
                        figureEl.appendChild(imgEl);
                        figureEl.appendChild(captionEl);
                        rowDiv.appendChild(figureEl);
                    });
                    
                    element = $(rowDiv);
                    break;
                    
                // ...existing cases...
            }
            
            if (element) {
                contentContainer.append(element);
            }
        });
        
        // Initialize the skills carousel
        initSkillsCarousel();
    }
    
    // Helper function to create video elements based on type
    function createVideoElement(videoData) {
        const videoContainer = $('<div>').addClass('video-container');
        let videoElement;
        
        if (videoData.responsive) {
            videoContainer.addClass('responsive-video');
        }
        
        switch(videoData.videoType) {
            case 'youtube':
                // Create YouTube iframe
                videoElement = $('<iframe>').attr({
                    src: videoData.src + (videoData.autoplay ? '?autoplay=1' : ''),
                    width: videoData.width || 640,
                    height: videoData.height || 360,
                    title: videoData.title || 'YouTube video player',
                    frameborder: 0,
                    allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
                    allowfullscreen: true
                });
                break;
                
            case 'vimeo':
                // Create Vimeo iframe
                videoElement = $('<iframe>').attr({
                    src: videoData.src + (videoData.autoplay ? '?autoplay=1' : ''),
                    width: videoData.width || 640,
                    height: videoData.height || 360,
                    title: videoData.title || 'Vimeo video player',
                    frameborder: 0,
                    allow: 'autoplay; fullscreen; picture-in-picture',
                    allowfullscreen: true
                });
                break;
                
            case 'direct':
            default:
                // Create HTML5 video element
                videoElement = $('<video>').attr({
                    src: videoData.src,
                    width: videoData.width || 640,
                    height: videoData.height || 360,
                    poster: videoData.poster || '',
                    controls: videoData.controls !== false,
                    autoplay: videoData.autoplay === true,
                    muted: videoData.autoplay === true, // Muted is needed for autoplay in most browsers
                    loop: videoData.loop === true,
                    preload: 'metadata'
                });
                break;
        }
        
        videoContainer.append(videoElement);
        
        // Add caption if provided
        if (videoData.caption) {
            videoContainer.append($('<p>').addClass('video-caption').text(videoData.caption));
        }
        
        // Wrap in figure if needed
        if (videoData.caption) {
            return $('<figure>').addClass('video-figure').append(videoContainer);
        } else {
            return videoContainer;
        }
    }
    
    // NEW FUNCTION: Create HTML string for video element (not a jQuery object)
    function createVideoHtml(videoData) {
        let videoHtml = `<div class="video-container${videoData.responsive ? ' responsive-video' : ''}">`;
        
        switch(videoData.videoType) {
            case 'youtube':
                videoHtml += `<iframe 
                    src="${videoData.src}${videoData.autoplay ? '?autoplay=1' : ''}"
                    width="${videoData.width || 640}"
                    height="${videoData.height || 360}"
                    title="${videoData.title || 'YouTube video player'}"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowfullscreen>
                </iframe>`;
                break;
                
            case 'vimeo':
                videoHtml += `<iframe 
                    src="${videoData.src}${videoData.autoplay ? '?autoplay=1' : ''}"
                    width="${videoData.width || 640}"
                    height="${videoData.height || 360}"
                    title="${videoData.title || 'Vimeo video player'}"
                    frameborder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowfullscreen>
                </iframe>`;
                break;
                
            case 'direct':
            default:
                videoHtml += `<video 
                    src="${videoData.src}"
                    width="${videoData.width || 640}"
                    height="${videoData.height || 360}"
                    ${videoData.poster ? `poster="${videoData.poster}"` : ''}
                    ${videoData.controls !== false ? 'controls' : ''}
                    ${videoData.autoplay === true ? 'autoplay muted' : ''}
                    ${videoData.loop === true ? 'loop' : ''}
                    preload="metadata">
                </video>`;
                break;
        }
        
        videoHtml += `</div>`;
        
        if (videoData.caption) {
            videoHtml = `<figure class="video-figure">${videoHtml}<figcaption class="video-caption">${videoData.caption}</figcaption></figure>`;
        }
        
        return videoHtml;
    }
});
