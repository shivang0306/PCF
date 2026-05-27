// import * as React from "react";

// export const CurrentTimeLine = () => {
// 	const minutes = new Date().getHours() * 60 + new Date().getMinutes();

// 	return (
// 		<div className="current-time" style={{ left: minutes * (2400 / 1440) }} />
// 	);
// };

import * as React from "react";
import { HOUR_WIDTH } from "../../utils/timelineConstants";

export const CurrentTimeLine = () => {
	const now = new Date();
	const minutes = now.getHours() * 60 + now.getMinutes();

	const leftPx = (minutes / 60) * HOUR_WIDTH;

	return <div className="current-time" style={{ left: leftPx }} />;
};
