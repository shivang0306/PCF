// import { TimeHeader } from "./TimeHeader";
// import { TimelineRow } from "./TimelineRow";
// import { CurrentTimeLine } from "./CurrentTimeLine";
// import { HourHighlight } from "./HourHighlight";
// import * as React from "react";

// export const TimelineGrid = ({
// 	bookings,
// 	selectedHour,
// }: {
// 	bookings: any[];
// 	selectedHour: number | null;
// }) => {
// 	const grouped = bookings.reduce((acc: any, b: any) => {
// 		acc[b.resourceName] = acc[b.resourceName] || [];
// 		acc[b.resourceName].push(b);
// 		return acc;
// 	}, {});

// 	return (
// 		<div className="timeline-container">
// 			<TimeHeader />

// 			<div className="timeline-overlay">
// 				<HourHighlight hour={selectedHour} />
// 				<CurrentTimeLine />
// 			</div>

// 			{Object.keys(grouped).map((name) => (
// 				<TimelineRow key={name} name={name} bookings={grouped[name]} />
// 			))}
// 		</div>
// 	);
// };

import { TimeHeader } from "./TimeHeader";
import { TimelineRow } from "./TimelineRow";
import { HourHighlight } from "./HourHighlight";
import { CurrentTimeLine } from "./CurrentTimeLine";
import { AGENT_COL_WIDTH, TIMELINE_WIDTH } from "../../utils/timelineConstants";
import * as React from "react";

export const TimelineGrid = ({ bookings, selectedHour }: any) => {
	const grouped = bookings.reduce((acc: any, b: any) => {
		acc[b.resourceName] = acc[b.resourceName] || [];
		acc[b.resourceName].push(b);
		return acc;
	}, {});

	return (
		<div className="timeline-wrapper">
			<TimeHeader />

 			<div className="timeline-overlay">
 				<HourHighlight hour={selectedHour} />
 			</div>

			<div className="timeline-body">
				<div
					className="timeline-overlay"
					style={{
						left: AGENT_COL_WIDTH,
						width: TIMELINE_WIDTH,
					}}>
					<CurrentTimeLine />
				</div>

				{Object.keys(grouped).map((name) => (
					<TimelineRow key={name} name={name} bookings={grouped[name]} />
				))}
			</div>
		</div>
	);
};
