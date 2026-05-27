import * as React from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import withDragAndDrop, {
	withDragAndDropProps,
} from "react-big-calendar/lib/addons/dragAndDrop";

import { format, parse, startOfWeek, getDay } from "date-fns";
import { Booking } from "../../models/Booking";
import { DataverseService } from "../../services/DataverseService";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import { IInputs } from "../../generated/ManifestTypes";

const localizer = dateFnsLocalizer({
	format,
	parse,
	startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
	getDay,
	locales: {},
});

const DragAndDropCalendar = withDragAndDrop(Calendar as any);

interface ScheduleBoardProps {
	bookings: Booking[];
	context: ComponentFramework.Context<IInputs>;
}

export const ScheduleBoard: React.FC<ScheduleBoardProps> = ({
	bookings,
	context,
}) => {
	//debugger;
	const dv = DataverseService(context);

	const onEventDrop: withDragAndDropProps["onEventDrop"] = async ({
		event,
		start,
		end,
	}) => {
		const booking = event as Booking;

		await dv.updateBooking(booking.id, start as Date, end as Date);
	};

	return (
		<div style={{ height: "100%" }}>
			<DragAndDropCalendar
				localizer={localizer}
				events={bookings}
				startAccessor="start"
				endAccessor="end"
				titleAccessor={(event: any) => (event as Booking).resourceName}
				defaultView="day"
				views={["day"]}
				step={30}
				timeslots={2}
				onEventDrop={onEventDrop}
				resizable
				style={{ height: "100%" }}
			/>
		</div>
	);
};
