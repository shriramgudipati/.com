document.addEventListener('DOMContentLoaded', function() {
  const categoryTabs = document.querySelectorAll('.category-tab');
  const selectElement = document.getElementById('category');
  
  // Add click event to each tab
  categoryTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      // Remove active class from all tabs
      categoryTabs.forEach(t => t.classList.remove('active'));
      
      // Add active class to clicked tab
      this.classList.add('active');
      
      // Update the hidden select element
      const categoryValue = this.getAttribute('data-value');
      selectElement.value = categoryValue;
      
      // Trigger change event on select to maintain compatibility with existing code
      const event = new Event('change');
      selectElement.dispatchEvent(event);
    });
  });
});
