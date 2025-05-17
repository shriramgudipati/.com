/**
 * Certifications category specific functionality
 */

const certificationsProcessor = {
    // Process category-specific data
    processData: function(data) {
        // Any certifications-specific data processing
        return data;
    },
    
    // Format item for display
    formatItem: function(item) {
        // Format specifically for certification items
        return {
            title: item.title || 'Certification',
            description: item.description || '',
            date: item.date || '',
            image: item.image || '',
            link: item.link || '',
            // Add any certification-specific formatting
            issuer: item.issuer || 'Unknown Issuer',
            validUntil: item.validUntil || 'No Expiration'
        };
    }
};

// Export for use in main integration
window.categoryProcessor = certificationsProcessor;
