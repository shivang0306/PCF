// import * as React from "react";

// export const TimeHeader = () => (
// 	<div className="time-header">
// 		{Array.from({ length: 24 }).map((_, h) => (
// 			<div key={h} className="time-cell">
// 				{h}:00
// 			</div>
// 		))}
// 	</div>
// );

import * as React from "react";
import {
	AGENT_COL_WIDTH,
	HOUR_WIDTH,
	TOTAL_HOURS,
} from "../../utils/timelineConstants";

export const TimeHeader = () => {
	return (
		<div
			className="time-header"
			style={{
				// marginLeft: AGENT_COL_WIDTH,
				width: HOUR_WIDTH * TOTAL_HOURS + 224,
			}}>
			<div
				className="time-cell"
				style={{
					backgroundColor: "#fafafa",
					padding: "4px",
					boxSizing: "border-box",
					position: "sticky",
					left: 0,
					borderRight: "1px solid #ddd",
					width: AGENT_COL_WIDTH,
				}}></div>
			{Array.from({ length: TOTAL_HOURS }).map((_, h) => (
				<div key={h} className="time-cell" style={{ width: HOUR_WIDTH }}>
					{h}:00
				</div>
			))}
		</div>
	);
};
