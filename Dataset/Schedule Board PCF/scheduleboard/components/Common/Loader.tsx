import * as React from "react";

export const Loader = ({ text = "Loading..." }: { text?: string }) => {
	return (
		<div
			style={{
				padding: "20px",
				textAlign: "center",
				fontSize: "14px",
			}}>
			<span>{text}</span>
		</div>
	);
};
