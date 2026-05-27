// import {
// 	Chart as ChartJS,
// 	BarElement,
// 	CategoryScale,
// 	LinearScale,
// 	Tooltip,
// 	Legend,
// } from "chart.js";
// import { Bar } from "react-chartjs-2";
// import { Booking } from "../../models/Booking";
// import * as React from "react";
// import { Chart } from "react-chartjs-2";

// export const StaffingChart = ({
// 	bookings,
// 	onSelectHour,
// }: {
// 	bookings: Booking[];
// 	onSelectHour: (hour: number | null) => void;
// }) => {
// 	const hours = Array.from({ length: 24 }, (_, i) => i);

// 	const data = hours.map(
// 		(h) => bookings.filter((b) => b.start.getHours() === h).length
// 	);

// 	return (
// 		<Bar
// 			data={{
// 				labels: hours.map((h) => `${h}:00`),
// 				datasets: [{ label: "Bookings", data }],
// 			}}
// 			options={{
// 				onClick: (_, elements) => {
// 					if (elements.length) {
// 						onSelectHour(elements[0].index);
// 					} else {
// 						onSelectHour(null);
// 					}
// 				},
// 			}}
// 		/>
// 	);
// };

import * as React from "react";
import {
	Chart as ChartJS,
	BarElement,
	CategoryScale,
	LinearScale,
	Tooltip,
	Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Booking } from "../../models/Booking";

/* ---------------- REGISTER ---------------- */

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

/* ---------------- COMPONENT ---------------- */

export const StaffingChart = ({
	bookings,
	onSelectHour,
}: {
	bookings: Booking[];
	onSelectHour: (hour: number | null) => void;
}) => {
	const hours = Array.from({ length: 24 }, (_, i) => i);

	const data = hours.map(
		(h) => bookings.filter((b) => b.start.getHours() === h).length
	);

	return (
		<div className="staffing-chart-container">
			<Bar
				data={{
					labels: hours.map((h) => `${h}:00`),
					datasets: [
						{
							label: "Bookings",
							data,
							backgroundColor: "#4CAF50",
							borderRadius: 4,
							barThickness: 18,
						},
					],
				}}
				options={{
					responsive: true,
					maintainAspectRatio: false, // 🔑 CRITICAL

					onClick: (_, elements) => {
						if (elements.length > 0) {
							onSelectHour(elements[0].index);
						} else {
							onSelectHour(null);
						}
					},

					plugins: {
						legend: {
							display: true,
							position: "top",
						},
					},

					scales: {
						x: {
							grid: { display: false },
						},
						y: {
							beginAtZero: true,
							ticks: { stepSize: 1 },
						},
					},
				}}
			/>
		</div>
	);
};
