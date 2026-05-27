export const getStatusClass = (statusCode: string): string => {
	switch (statusCode) {
		case "Canceled":
			return "status-Canceled";
		case "Completed":
			return "status-Completed";
		case "In Progress":
			return "status-In-Progress";
		case "On Break":
			return "status-On-Break";
		case "Scheduled":
			return "status-Scheduled";
		case "Traveling":
			return "status-Traveling";
		default:
			return "status-default";
	}
};
