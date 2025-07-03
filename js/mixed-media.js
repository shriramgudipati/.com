/**
 * mixed-media.js
 * Handles mixed media content (images, videos, PDFs) for project details.
 */

/**
 * Create a mixed media row containing different types of media
 */
function createMixedMediaRow(item) {
    if (!item.media || !Array.isArray(item.media) || item.media.length === 0) {
        console.warn('No media items provided for mixed media row');
        return null;
    }
    
    const row = document.createElement('div');
    row.className = 'mixed-media-row';
    
    item.media.forEach(mediaItem => {
        let container;
        
        switch (mediaItem.type) {
            case 'image':
                container = createMediaImage(mediaItem);
                break;
                
            case 'video':
                container = createMediaVideo(mediaItem);
                break;
                
            case 'pdf':
                container = createMediaPdf(mediaItem);
                break;
                
            default:
                console.warn(`Unknown media type: ${mediaItem.type}`);
                return;
        }
        
        if (container) {
            row.appendChild(container);
        }
    });
    
    return row;
}

/**
 * Create an image element for mixed media row
 */
function createMediaImage(item) {
    const container = document.createElement('div');
    container.className = 'media-item image-item';
    
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
    
    container.appendChild(img);
    
    // Add caption if available
    if (item.caption) {
        const caption = document.createElement('div');
        caption.className = 'media-caption';
        caption.textContent = item.caption;
        container.appendChild(caption);
    }
    
    return container;
}

/**
 * Create a video element for mixed media row
 */
function createMediaVideo(item) {
    console.log('Creating mixed media video element:', item);
    
    const container = document.createElement('div');
    container.className = 'media-item video-item';
    
    if (item.embedType === 'youtube') {
        const iframe = document.createElement('iframe');
        iframe.width = '100%';
        iframe.height = '100%';
        iframe.src = item.src;
        iframe.title = item.title || 'Video';
        iframe.frameBorder = '0';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;
        
        // Add error handling for iframe
        iframe.onerror = function() {
            console.error('Error loading YouTube iframe in mixed media:', item.src);
        };
        
        // Log when iframe is loaded
        iframe.onload = function() {
            console.log('YouTube iframe loaded in mixed media:', item.src);
        };
        
        container.appendChild(iframe);
    } else {
        const video = document.createElement('video');
        video.width = '100%';
        video.height = '100%';
        video.controls = true;
        if (item.autoplay) video.autoplay = true;
        if (item.loop) video.loop = true;
        
        // Add error handling for video loading
        video.onerror = function() {
            console.error('Error loading video in mixed media:', item.src);
            const errorMessage = document.createElement('div');
            errorMessage.className = 'video-error';
            errorMessage.innerHTML = `<p>Error loading video from: ${item.src}</p>`;
            container.appendChild(errorMessage);
        };
        
        // Add load event for confirmation
        video.onloadeddata = function() {
            console.log('Video loaded successfully in mixed media:', item.src);
        };
          const source = document.createElement('source');
        source.src = fixPath(item.src);
        
        // Determine the MIME type based on file extension rather than a property
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
        console.log('Added mixed media video source:', source.src, 'with type:', source.type);
        
        container.appendChild(video);
    }
    
    // Add caption if available
    if (item.caption) {
        const caption = document.createElement('div');
        caption.className = 'media-caption';
        caption.textContent = item.caption;
        container.appendChild(caption);
    }
    
    return container;
}

/**
 * Create a PDF element for mixed media row
 */
function createMediaPdf(item) {
    const container = document.createElement('div');
    container.className = 'media-item pdf-item';
    
    // Create PDF viewer with iframe
    const iframe = document.createElement('iframe');
    iframe.src = `${fixPath(item.src)}#toolbar=0&navpanes=0`;
    iframe.className = 'pdf-preview';
    iframe.title = item.title || 'PDF Document';
    container.appendChild(iframe);
    
    // Add controls for PDF
    const controls = document.createElement('div');
    controls.className = 'pdf-controls';
    
    // Add download button
    const downloadLink = document.createElement('a');
    downloadLink.href = fixPath(item.src);
    downloadLink.download = item.filename || 'download.pdf';
    downloadLink.className = 'pdf-download-btn';
    downloadLink.textContent = item.downloadText || 'Download PDF';
    controls.appendChild(downloadLink);
    
    // Add view button
    const viewLink = document.createElement('a');
    viewLink.href = fixPath(item.src);
    viewLink.target = '_blank';
    viewLink.className = 'pdf-download-btn';
    viewLink.textContent = item.viewText || 'View Full PDF';
    controls.appendChild(viewLink);
    
    container.appendChild(controls);
    
    // Add caption if available
    if (item.caption) {
        const caption = document.createElement('div');
        caption.className = 'media-caption';
        caption.textContent = item.caption;
        container.appendChild(caption);
    }
    
    return container;
}

/**
 * Fix paths for media resources
 */
function fixPath(path) {
    if (!path) return '';
    
    // If already has http or https, return as is
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }
    
    // Otherwise, ensure path starts correctly
    if (!path.startsWith('/') && !path.startsWith('./')) {
        return './' + path;
    }
    
    return path;
}
