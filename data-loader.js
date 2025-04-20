const dataLoader = {
	portfolioData: null,

	initialize: async function () {
		try {
			const response = await fetch("data/projects.json");
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			this.portfolioData = await response.json();
			return true;
		} catch (error) {
			console.error("Error loading JSON data:", error);
			this.portfolioData = { projects: [] };
			return false;
		}
	},

	getCurrentData: function () {
		// Return the 'projects' array from the loaded JSON
		return this.portfolioData && Array.isArray(this.portfolioData.projects)
			? this.portfolioData.projects
			: [];
	},

	getProjectContent: async function (id) {
		try {
			const response = await fetch("data/project-content.json");
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const contentData = await response.json();
			return contentData.find((item) => item.id === id) || null;
		} catch (error) {
			console.error("Error loading project content:", error);
			return null;
		}
	}
};
