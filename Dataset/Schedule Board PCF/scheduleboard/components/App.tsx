import * as React from "react";
import { mapDatasetToBookings } from "../services/BookingMapper";
import { isSameDay } from "../utils/dateUtils";
import { DateFilter } from "./Filters/DateFilter";
import { StaffingChart } from "./Chart/StaffingChart";
import { TimelineGrid } from "./Scheduler/TimelineGrid";
import { Loader } from "./Common/Loader";

export const App = ({ context }: any) => {
	const dataset = context.parameters.Bookings;

	const [date, setDate] = React.useState(new Date());
	const [allBookings, setAllBookings] = React.useState<any[]>([]);
	const [loading, setLoading] = React.useState(true);
	const [selectedHour, setSelectedHour] = React.useState<number | null>(null);

	/* -------- Dataset Paging -------- */

	React.useEffect(() => {
		if (!dataset) return;

		if (dataset.loading) {
			setLoading(true);
			return;
		}

		const mapped = mapDatasetToBookings(dataset);

		setAllBookings((prev) => {
			const ids = new Set(prev.map((b) => b.id));
			const fresh = mapped.filter((b) => !ids.has(b.id));
			return [...prev, ...fresh];
		});

		if (dataset.paging?.hasNextPage) {
			dataset.paging.loadNextPage();
		} else {
			setLoading(false);
		}
	}, [dataset]);

	/* -------- Date Filter -------- */

	const bookings = allBookings.filter((b) => isSameDay(b.start, date));

	if (loading) {
		return <Loader text="Loading schedules..." />;
	}

	return (
		<div className="app-container">
			<DateFilter value={date} onChange={setDate} />

			<StaffingChart bookings={bookings} onSelectHour={setSelectedHour} />

			<TimelineGrid bookings={bookings} selectedHour={selectedHour} />
		</div>
	);
};
