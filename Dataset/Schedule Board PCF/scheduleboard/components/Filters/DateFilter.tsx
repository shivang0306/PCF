import * as React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export const DateFilter = ({ value, onChange }: any) => {
	return (
		<div className="date-filter">
			<input
				type="date"
				className="form-control"
				style={{ width: "120px" }}
				value={value.toISOString().substring(0, 10)}
				onChange={(e) => onChange(new Date(e.target.value))}
			/>
			<label>Date</label>
		</div>
	);
};
