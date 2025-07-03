/**
 * Projects category specific functionality
 */

const projectsProcessor = {
    // Process category-specific data
    processData: function(data) {
        // Any projects-specific data processing
        return data;
    },
    
    // Format item for display
    formatItem: function(item) {
        // Format specifically for project items
        return {
            title: item.title || 'Project',
            description: item.description || '',
            date: item.date || '',
            image: item.image || '',
            link: item.link || '',
            // Add any project-specific formatting
            technologies: item.technologies || [],
            github: item.github || ''
        };
    }
};

// Export for use in main integration
window.categoryProcessor = projectsProcessor;
