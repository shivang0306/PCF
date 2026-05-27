import { Booking } from "../models/Booking";

export const mapDatasetToBookings = (
	dataset: ComponentFramework.PropertyTypes.DataSet
): Booking[] => {
	if (!dataset?.sortedRecordIds) return [];

	return dataset.sortedRecordIds.map((id) => {
		const record = dataset.records[id] as any;
		const statusLabel = record.getFormattedValue("bookingstatus");
		return {
			id,
			resourceId: record.getValue("resource")?.id as string,
			resourceName: record.getFormattedValue("resource"),
			start: new Date(record.getValue("starttime") as Date),
			end: new Date(record.getValue("endtime") as Date),
			statusLabel,
		};
	});
};
