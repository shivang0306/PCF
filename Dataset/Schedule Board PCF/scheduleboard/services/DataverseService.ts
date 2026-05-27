export const DataverseService = (context: any) => ({
	updateBooking: async (id: string, start: Date, end: Date) => {
		await context.webAPI.updateRecord("bookableresourcebooking", id, {
			starttime: start,
			endtime: end,
		});
	},

	createBooking: async (resourceId: string, start: Date, end: Date) => {
		await context.webAPI.createRecord("bookableresourcebooking", {
			"resource@odata.bind": `/bookableresources(${resourceId})`,
			starttime: start,
			endtime: end,
		});
	},
});
