import * as React from "react";

export const HourHighlight = ({ hour }: { hour: number | null }) => {
	if (hour === null) return null;

	const leftPercent = (hour / 24) * 100;
	const widthPercent = (1 / 24) * 100;

	return (
		<div
			className="hour-highlight"
			style={{
				left: `${leftPercent}%`,
				width: `${widthPercent}%`,
			}}
		/>
	);
};
