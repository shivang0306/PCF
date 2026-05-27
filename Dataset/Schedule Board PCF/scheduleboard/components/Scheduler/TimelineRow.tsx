// import * as React from "react";
// import { Booking } from "../../models/Booking";
// import { getStatusClass } from "../../utils/statusColor";

// export const TimelineRow = ({
//   name,
//   bookings,
// }: {
//   name: string;
//   bookings: Booking[];
// }) => {

//   return (
//     <div className="timeline-row">
//       <div className="agent-column">{name}</div>

//       <div className="timeline-track">
//         {bookings.map((b) => {
//           const startMinutes =
//             b.start.getHours() * 60 + b.start.getMinutes();
//           const endMinutes =
//             b.end.getHours() * 60 + b.end.getMinutes();

//           const leftPercent = (startMinutes / 1440) * 100;
//           const widthPercent =
//             ((endMinutes - startMinutes) / 1440) * 100;

//           return (
//             <div
//               key={b.id}
//               className={`segment ${getStatusClass(b.statusCode)}`}
//               title={`${b.statusLabel} (${b.start.toLocaleTimeString()} - ${b.end.toLocaleTimeString()})`}
//               style={{
//                 left: `${leftPercent}%`,
//                 width: `${widthPercent}%`,
//               }}
//             />
//           );
//         })}
//       </div>
//     </div>
//   );
// };

import * as React from "react";
import { Booking } from "../../models/Booking";
import { getStatusClass } from "../../utils/statusColor";
import { AGENT_COL_WIDTH, HOUR_WIDTH } from "../../utils/timelineConstants";

export const TimelineRow = ({
	name,
	bookings,
}: {
	name: string;
	bookings: Booking[];
}) => {
	return (
		<div className="timeline-row">
			{/* Left fixed column */}
			<div className="agent-column" style={{ width: AGENT_COL_WIDTH }}>
				{name}
			</div>

			{/* Timeline track */}
			<div
				className="timeline-track"
				style={{
					width: HOUR_WIDTH * 24,
				}}>
				{bookings.map((b) => {
					const startMinutes = b.start.getHours() * 60 + b.start.getMinutes();
					const endMinutes = b.end.getHours() * 60 + b.end.getMinutes();

					const leftPx = (startMinutes / 60) * HOUR_WIDTH;

					const widthPx = ((endMinutes - startMinutes) / 60) * HOUR_WIDTH;

					return (
						<div
							key={b.id}
							className={`segment ${getStatusClass(b.statusLabel)}`}
							title={`${b.statusLabel} (${b.start.toLocaleTimeString()} - ${b.end.toLocaleTimeString()})`}
							style={{
								left: leftPx,
								width: widthPx,
							}}
						/>
					);
				})}
			</div>
		</div>
	);
};
