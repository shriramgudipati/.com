/**
 * content.js - Dedicated script for loading and displaying project content
 * This script handles loading project details from JSON files and 
 * displaying them in the content.html page.
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Content.js loaded and initialized');
      // Get URL parameters
    const params = new URLSearchParams(window.location.search);
    const category = params.get('category');
    
    // Support multiple parameter names for project identification
    const projectId = params.get('id') || params.get('project'); // Support both 'id' and 'project' parameters
    const itemIndex = params.get('item') !== null ? parseInt(params.get('item')) : null;
    
    // Container reference
    const contentContainer = document.getElementById('project-content');
      // Display error if parameters are missing
    if (!category || (projectId === null && itemIndex === null)) {
        showError('Missing Parameters', 
            'Please provide both category and either id, project, or item parameters in the URL.<br>' +
            'Example: content.html?category=Projects&id=project1<br>' +
            'Or: content.html?category=Projects&project=project1<br>' +
            'Or: content.html?category=Projects&item=0<br><br>' +
            `Current parameters: category=${category || 'none'}, ` +
            `id/project=${projectId || 'none'}, item=${params.get('item') || 'none'}`);
        return;
    }
    
    // Show loading indicator
    showLoading(category, projectId || itemIndex);
    
    // Load project data
    if (projectId !== null) {
        // Load by ID (string identifier)
        loadProjectById(category, projectId)
            .then(project => {
                if (project) {
                    renderProject(project);
                }
            })
            .catch(error => {
                showError('Error Loading Content', error.message);
            });
    } else {
        // Load by item index (numeric position)
        loadProjectByIndex(category, itemIndex)
            .then(project => {
                if (project) {
                    renderProject(project);
                }
            })
            .catch(error => {
                showError('Error Loading Content', error.message);
            });
    }
});

function loadProjectByIndex(category, itemIndex) {
    // Support both capitalized and non-capitalized filenames
    const fileNames = [
        `data/${category}_content.json`,
        `data/${category.charAt(0).toUpperCase() + category.slice(1)}_content.json` // Try with first letter capitalized
    ];
    
    console.log(`Attempting to load project data for index: ${itemIndex}`);
    console.log(`Trying file paths:`, fileNames);
    
    // Try each possible filename
    return tryLoadFromFiles(fileNames)
        .then(result => {
            const { data, usedPath } = result;
            console.log(`Successfully loaded data from: ${usedPath}`);
            
            if (!data || !data.projects || !Array.isArray(data.projects)) {
                console.error('Invalid data format:', data);
                throw new Error('Invalid data format - missing projects array');
            }
            
            console.log(`Number of projects found: ${data.projects.length}`);
            
            if (itemIndex < 0 || itemIndex >= data.projects.length) {
                console.error(`Index out of bounds: ${itemIndex} (max: ${data.projects.length - 1})`);
                throw new Error(`Invalid item index: ${itemIndex} (Max: ${data.projects.length - 1})`);
            }
            
            const project = data.projects[itemIndex];
            console.log('Found project:', project);
            return project;
        });
}

// Helper function to try loading from multiple file paths
function tryLoadFromFiles(filePaths) {
    // Try each path in sequence until one succeeds
    let currentIndex = 0;
    
    function tryNextPath() {
        if (currentIndex >= filePaths.length) {
            return Promise.reject(new Error(`Failed to load data from any of the paths: ${filePaths.join(', ')}`));
        }
        
        const currentPath = filePaths[currentIndex++];
        
        return fetch(currentPath)
            .then(response => {
                if (!response.ok) {
                    console.log(`Path ${currentPath} failed with status: ${response.status}`);
                    return tryNextPath();
                }
                return response.json().then(data => ({ data, usedPath: currentPath }));
            })
            .catch(error => {
                console.log(`Error fetching ${currentPath}:`, error);
                return tryNextPath();
            });
    }
    
    return tryNextPath();
}

/**
 * Load project data by ID from JSON file
 */
function loadProjectById(category, projectId) {
    // Support both capitalized and non-capitalized filenames
    const fileNames = [
        `data/${category}_content.json`,
        `data/${category.charAt(0).toUpperCase() + category.slice(1)}_content.json` // Try with first letter capitalized
    ];
    
    console.log(`Attempting to load project data for ID: ${projectId}`);
    console.log(`Trying file paths:`, fileNames);
    
    // Try each possible filename
    return tryLoadFromFiles(fileNames)
        .then(result => {
            const { data, usedPath } = result;
            console.log(`Successfully loaded data from: ${usedPath}`);
            
            if (!data || !data.projects || !Array.isArray(data.projects)) {
                console.error('Invalid data format:', data);
                throw new Error('Invalid data format - missing projects array');
            }
            
            console.log(`Number of projects found: ${data.projects.length}`);
            
            const project = data.projects.find(p => 
                p.id === projectId || 
                p.id === parseInt(projectId) || 
                (p.id && p.id.toString() === projectId)
            );
            
            if (!project) {
                console.error(`Project with ID "${projectId}" not found in ${usedPath}`);
                throw new Error(`Project with ID "${projectId}" not found in ${usedPath}`);
            }
            
            console.log('Found project:', project);
            return project;
        });
}

/**
 * Render project content to the page
 */
function renderProject(project) {
    const container = document.getElementById('project-content');
    
    // Create header
    const header = document.createElement('header');
    header.className = 'project-header';
    
    // Add title
    const title = document.createElement('h2');
    title.className = 'project-title';
    title.textContent = project.title || 'Unnamed Project';
    header.appendChild(title);
    
    // Add subtitle if available
    if (project.subtitle) {
        const subtitle = document.createElement('p');
        subtitle.className = 'project-subtitle';
        subtitle.textContent = project.subtitle;
        header.appendChild(subtitle);
    }
      // Add skills if available
    if (project.skills && Array.isArray(project.skills) && project.skills.length > 0) {
        const skillsContainer = document.createElement('div');
        skillsContainer.className = 'skills-carousel-container';
          // Add a heading
        const skillsHeading = document.createElement('h2');
        skillsHeading.className = 'skills-heading-illuminated';
        skillsHeading.innerHTML = '<center><span>Skills</span></center><div class="stage-light"><div class="light-beam"></div><div class="light-rays"></div></div>';
        skillsContainer.appendChild(skillsHeading);
        
        // Create carousel structure
        const skillsCarousel = document.createElement('div');
        skillsCarousel.className = 'skills-carousel';
        
        const skillsList = document.createElement('ul');
        skillsList.className = 'skills-carousel__list';
        
        // Add skills as carousel items
        project.skills.forEach((skill, index) => {
            const skillItem = document.createElement('li');
            skillItem.className = 'skills-carousel__item';
            skillItem.setAttribute('data-pos', index);
            skillItem.setAttribute('data-active', index === 0 ? 'true' : 'false');
            
            if (index === 0) {
                skillItem.classList.add('illuminated');
            }
            
            const skillSpan = document.createElement('span');
            skillSpan.textContent = skill;
            skillItem.appendChild(skillSpan);
            
            skillsList.appendChild(skillItem);
        });
        
        skillsCarousel.appendChild(skillsList);
        skillsContainer.appendChild(skillsCarousel);
        
        header.appendChild(skillsContainer);
        
        // Initialize the carousel after it's added to DOM
        setTimeout(() => {
            initSkillsCarousel();
        }, 100);
    }
    
    // Add header to main container
    container.innerHTML = '';
    container.appendChild(header);
    
    // Create content section
    const contentSection = document.createElement('div');
    contentSection.className = 'project-content-section';
    
    // Process description elements
    if (project.description && Array.isArray(project.description)) {
        project.description.forEach(item => {
            const element = createContentElement(item);
            if (element) {
                contentSection.appendChild(element);
            }
        });
    } else if (typeof project.description === 'string') {
        // Simple string description fallback
        const paragraph = document.createElement('p');
        paragraph.textContent = project.description;
        contentSection.appendChild(paragraph);
    }
    
    container.appendChild(contentSection);
    
    // Add link/button if available
    if (project.link) {
        const linkContainer = document.createElement('div');
        linkContainer.className = 'project-link-container';
        
        const link = document.createElement('a');
        link.href = project.link;
        link.className = 'project-link';
        link.textContent = project.linkText || 'Visit Project';
        link.target = '_blank';
        
        linkContainer.appendChild(link);
        container.appendChild(linkContainer);
    }
}

/**
 * Create an element based on content type
 */
function createContentElement(item) {
    if (!item || !item.type) return null;
    
    switch(item.type) {
        case 'paragraph':
            return createParagraph(item);
            
        case 'image':
            return createImage(item);
            
        case 'image-row':
            return createImageRow(item);
            
        case 'video':
            return createVideo(item);
            
        case 'quote':
            return createQuote(item);
            
        case 'list':
            return createList(item);
              case 'pdf':
            return createPDF(item);
            
        case 'pdf-embed':
            return createPDFEmbed(item);
            
        case 'mixed-media-row':
            return createMixedMediaRow(item);
            
        default:
            console.warn(`Unknown content type: ${item.type}`);
            return null;
    }
}

/**
 * Create a paragraph element
 */
function createParagraph(item) {
    const p = document.createElement('p');
    p.className = 'content-paragraph';
    p.innerHTML = item.content || '';
    return p;
}

/**
 * Create a single image with caption
 */
function createImage(item) {
    const figure = document.createElement('figure');
    figure.className = 'content-image';
    
    // Set alignment if provided
    if (item.alignment) {
        figure.classList.add(`align-${item.alignment}`);
    }
    
    // Create image element
    const img = document.createElement('img');
    img.src = fixPath(item.src);
    img.alt = item.alt || '';
    
    // Add error handling
    img.onerror = function() {
        this.onerror = null;
        console.error('Failed to load image:', this.src);
        this.src = 'img/placeholder.png';
        this.style.opacity = 0.5;
    };
    
    figure.appendChild(img);
    
    // Add caption if available
    if (item.caption) {
        const figcaption = document.createElement('figcaption');
        figcaption.textContent = item.caption;
        figure.appendChild(figcaption);
    }
    
    return figure;
}

/**
 * Create a row of images
 */
function createImageRow(item) {
    console.log('Creating image row:', item);
    
    if (!item.images || !Array.isArray(item.images) || item.images.length === 0) {
        console.error('Invalid or empty images array in image-row:', item);
        return null;
    }
    
    const row = document.createElement('div');
    row.className = 'image-row';
    
    // Apply custom styles if provided
    if (item.style) {
        Object.assign(row.style, item.style);
    }
    
    // Calculate default width percentage if not specified
    const defaultWidthPercentage = Math.floor(100 / item.images.length) - 2; // Subtract for gap
    
    item.images.forEach(imgData => {
        const container = document.createElement('div');
        container.className = 'image-container';
        
        // Set width if specified for the row or individual image
        if (imgData.widthPercentage) {
            // Individual image width takes precedence
            container.style.width = `${imgData.widthPercentage}%`;
        } else if (item.widthPercentage) {
            // Row-level width setting
            container.style.width = `${item.widthPercentage}%`;
        } else {
            // Default based on number of images
            container.style.width = `${defaultWidthPercentage}%`;
        }
        
        // Create image
        const img = document.createElement('img');
        img.src = fixPath(imgData.src);
        img.alt = imgData.alt || '';
        
        // Set custom image styles if provided
        if (imgData.style) {
            Object.assign(img.style, imgData.style);
        }
        
        // Add error handling
        img.onerror = function() {
            this.onerror = null;
            console.error('Failed to load image:', this.src);
            this.src = 'img/placeholder.png';
            this.style.opacity = 0.5;
            
            const errorMsg = document.createElement('div');
            errorMsg.className = 'image-error';
            errorMsg.textContent = 'Image failed to load';
            container.appendChild(errorMsg);
        };
        
        container.appendChild(img);
        
        // Add caption if available
        if (imgData.caption) {
            const caption = document.createElement('div');
            caption.className = 'image-caption';
            caption.textContent = imgData.caption;
            container.appendChild(caption);
        }
        
        row.appendChild(container);
    });
    
    console.log('Created image row with', item.images.length, 'images');
    return row;
}

/**
 * Create a video element
 */
function createVideo(item) {
    console.log('Creating video element:', item);
    
    const container = document.createElement('div');
    container.className = 'video-container';
    
    if (item.responsive) {
        container.classList.add('responsive-video');
    }
    
    if (item.videoType === 'direct') {
        const video = document.createElement('video');
        video.width = '100%';
        
        if (item.controls !== false) video.controls = true;
        if (item.autoplay) video.autoplay = true;
        if (item.loop) video.loop = true;
        
        // Add error handling for video loading
        video.onerror = function() {
            console.error('Error loading video:', item.src);
            const errorMessage = document.createElement('div');
            errorMessage.className = 'video-error';
            errorMessage.innerHTML = `<p>Error loading video from: ${item.src}</p>`;
            container.appendChild(errorMessage);
        };
        
        // Add load event for confirmation
        video.onloadeddata = function() {
            console.log('Video loaded successfully:', item.src);
        };
          const source = document.createElement('source');
        source.src = fixPath(item.src);
        
        // Determine the MIME type based on file extension rather than videoType
        const fileExtension = item.src.split('.').pop().toLowerCase();
        if (fileExtension === 'webm') {
            source.type = 'video/webm';
        } else if (fileExtension === 'mp4') {
            source.type = 'video/mp4';
        } else {
            // Default to mp4 if extension is unknown
            source.type = 'video/mp4';
        }
        
        video.appendChild(source);
        
        // Add a console log for debugging
        console.log('Added video source:', source.src, 'with type:', source.type);
        
        const fallback = document.createElement('p');
        fallback.textContent = 'Your browser does not support the video tag.';
        video.appendChild(fallback);
        
        container.appendChild(video);    } else if (item.videoType === 'youtube') {
        const iframe = document.createElement('iframe');
        iframe.src = item.src;
        iframe.title = item.title || 'YouTube video';
        iframe.frameBorder = '0';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;
        
        // Add error handling for iframe
        iframe.onerror = function() {
            console.error('Error loading YouTube iframe:', item.src);
        };
        
        // Log when iframe is loaded
        iframe.onload = function() {
            console.log('YouTube iframe loaded:', item.src);
        };
        
        container.appendChild(iframe);
    }
    
    if (item.caption) {
        const caption = document.createElement('div');
        caption.className = 'video-caption';
        caption.textContent = item.caption;
        container.appendChild(caption);
    }
    
    return container;
}

/**
 * Create a quote block
 */
function createQuote(item) {
    const blockquote = document.createElement('blockquote');
    blockquote.className = 'content-quote';
    blockquote.innerHTML = item.content || '';
    
    if (item.source) {
        const cite = document.createElement('cite');
        cite.textContent = item.source;
        blockquote.appendChild(cite);
    }
    
    return blockquote;
}

/**
 * Create a list (ordered or unordered)
 */
function createList(item) {
    if (!item.items || !Array.isArray(item.items) || item.items.length === 0) {
        return null;
    }
    
    const list = document.createElement(item.ordered ? 'ol' : 'ul');
    list.className = 'content-list';
    
    item.items.forEach(itemText => {
        const li = document.createElement('li');
        li.innerHTML = itemText;
        list.appendChild(li);
    });
    
    return list;
}

/**
 * Create a PDF viewer element
 */
function createPDF(item) {
    console.log('Creating PDF viewer:', item);
    
    const container = document.createElement('div');
    container.className = 'pdf-container';
    
    // Create iframe for PDF viewing
    const iframe = document.createElement('iframe');
    iframe.src = `${fixPath(item.src)}#toolbar=0&navpanes=0`;
    iframe.className = 'pdf-preview';
    iframe.title = item.title || 'PDF Document';
    iframe.setAttribute('scrolling', 'auto');
    
    // Set custom dimensions if provided
    if (item.width) {
        iframe.style.width = item.width;
    } else {
        iframe.style.width = '100%';
    }
    
    if (item.height) {
        iframe.style.height = item.height + 'px';
    }
    
    // Add error handling
    iframe.onerror = function() {
        console.error('Error loading PDF:', iframe.src);
        const errorMessage = document.createElement('div');
        errorMessage.className = 'pdf-error';
        errorMessage.innerHTML = `<p>Error loading PDF from: ${iframe.src}</p>`;
        container.appendChild(errorMessage);
    };
    
    // Add load event for confirmation
    iframe.onload = function() {
        console.log('PDF loaded successfully:', iframe.src);
    };
    
    container.appendChild(iframe);
    
    // Add controls
    const controls = document.createElement('div');
    controls.className = 'pdf-controls';
    
    // Add download button
    const downloadLink = document.createElement('a');
    downloadLink.href = fixPath(item.src);
    downloadLink.download = item.filename || 'document.pdf';
    downloadLink.className = 'pdf-download-btn';
    downloadLink.textContent = item.downloadText || 'Download PDF';
    controls.appendChild(downloadLink);
    
    // Add view button (opens in new tab)
    const viewLink = document.createElement('a');
    viewLink.href = fixPath(item.src);
    viewLink.target = '_blank';
    viewLink.className = 'pdf-download-btn';
    viewLink.textContent = item.viewText || 'View Full PDF';
    controls.appendChild(viewLink);
    
    container.appendChild(controls);
    
    return container;
}

/**
 * Create a PDF embed element for Google Drive PDFs
 */
function createPDFEmbed(item) {
    console.log('Creating PDF embed with Google Drive link:', item);
    
    const container = document.createElement('div');
    container.className = 'pdf-container pdf-embed-container';
    
    // Add title if available
    if (item.title) {
        const titleElement = document.createElement('h3');
        titleElement.className = 'pdf-title';
        titleElement.textContent = item.title;
        container.appendChild(titleElement);
    }
    
    // Create iframe for Google Drive PDF viewing
    const iframe = document.createElement('iframe');
    
    // Use the Google Drive link directly if provided
    if (item.googleDriveLink) {
        // Ensure the Google Drive link has the correct format for embedding
        if (item.googleDriveLink.includes('drive.google.com/file/d/')) {
            // Convert file link to embed format if needed
            const fileIdMatch = item.googleDriveLink.match(/\/file\/d\/([^\/]+)/);
            if (fileIdMatch && fileIdMatch[1]) {
                const fileId = fileIdMatch[1];
                iframe.src = `https://drive.google.com/file/d/${fileId}/preview`;
            } else {
                iframe.src = item.googleDriveLink;
            }
        } else {
            iframe.src = item.googleDriveLink;
        }
    } else if (item.src) {
        // Fallback to regular src
        iframe.src = fixPath(item.src);
    } else {
        console.error('No source provided for PDF embed:', item);
        const error = document.createElement('div');
        error.className = 'pdf-error';
        error.textContent = 'Error: No PDF source provided';
        container.appendChild(error);
        return container;
    }
    
    // Set iframe attributes
    iframe.className = 'pdf-preview';
    iframe.title = item.title || 'PDF Document';
    iframe.setAttribute('scrolling', 'auto');
    
    // A4 dimensions by default, but allow custom override
    if (item.width) {
        iframe.style.width = item.width;
    } else {
        iframe.style.width = '100%';
    }
    
    // Use custom height if provided, otherwise use the A4 height set in CSS
    if (item.height) {
        iframe.style.height = item.height + 'px';
    }
    
    // Set fullscreen option if provided
    if (item.allowFullscreen) {
        iframe.allowFullscreen = true;
        // Also add the allow attribute for better fullscreen support
        iframe.setAttribute('allow', 'fullscreen');
    }
    
    // Add error handling
    iframe.onerror = function() {
        console.error('Error loading PDF embed:', iframe.src);
        const errorMessage = document.createElement('div');
        errorMessage.className = 'pdf-error';
        errorMessage.innerHTML = `<p>Error loading PDF from: ${iframe.src}</p>`;
        container.appendChild(errorMessage);
    };
    
    // Add load event for confirmation
    iframe.onload = function() {
        console.log('PDF embed loaded successfully:', iframe.src);
    };
    
    container.appendChild(iframe);
    
    // Add description if available
    if (item.description) {
        const description = document.createElement('p');
        description.className = 'pdf-description';
        description.textContent = item.description;
        container.appendChild(description);
    }
    
    return container;
}

/**
 * Fix relative paths (remove leading slash if present)
 * Preserves external URLs (starting with http:// or https://)
 */
function fixPath(path) {
    if (!path) return '';
    
    // If it's an external URL, return as is
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }
    
    // Otherwise fix local paths
    return path.startsWith('/') ? path.substring(1) : path;
}

/**
 * Show loading indicator
 */
function showLoading(category, identifier) {
    const container = document.getElementById('project-content');
    
    container.innerHTML = `
        <div class="loading-indicator" style="text-align: center; padding: 40px 20px;">
            <h2 style="color: #e87464; margin-bottom: 15px;">Loading Project</h2>
            <p style="margin-bottom: 20px;">Loading ${category}, ${typeof identifier === 'number' ? 'item #' + identifier : 'ID: ' + identifier}...</p>
            <div class="loading-spinner" style="display: inline-block; width: 40px; height: 40px; border: 4px solid rgba(232, 116, 100, 0.3); border-radius: 50%; border-top-color: #e87464; animation: spin 1s ease-in-out infinite;"></div>
            <p style="margin-top: 20px; font-size: 12px; color: #999;">
                File being checked: data/${category}_content.json<br>
                Alternate path: data/${category.charAt(0).toUpperCase() + category.slice(1)}_content.json
            </p>
        </div>
    `;
    
    // Add the CSS animation for the spinner
    if (!document.getElementById('loading-spinner-style')) {
        const style = document.createElement('style');
        style.id = 'loading-spinner-style';
        style.textContent = `
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Show error message
 */
function showError(title, message) {
    const container = document.getElementById('project-content');
    
    // Get URL params for debugging
    const params = new URLSearchParams(window.location.search);
    const allParams = {};
    params.forEach((value, key) => {
        allParams[key] = value;
    });
      const debugInfo = JSON.stringify({
        url: window.location.href,
        params: allParams,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
    }, null, 2);
    
    container.innerHTML = `
        <div class="error-message" style="padding: 20px; background-color: rgba(255, 0, 0, 0.1); border-left: 5px solid #e87464; margin-bottom: 20px; border-radius: 5px;">
            <h2 style="color: #e87464; margin-bottom: 10px;">${title}</h2>
            <p style="line-height: 1.5;">${message}</p>
            
            <div style="margin-top: 20px; padding-top: 15px; border-top: 1px dashed rgba(255,255,255,0.2);">
                <details style="margin-top:10px;">
                    <summary style="cursor:pointer;">Debug Info</summary>
                    <pre style="font-size:11px; color:#555; background:#f9f9f9; border-radius:4px; padding:10px; overflow-x:auto;">${debugInfo}</pre>
                </details>            </div>
        </div>
    `;
}