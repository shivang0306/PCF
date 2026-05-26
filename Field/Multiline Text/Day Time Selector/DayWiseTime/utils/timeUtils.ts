export const utcDateToLocalTimeString = (date: Date | null): string => {
	if (!date) return "";

	const local = new Date(date);
	const hh = local.getHours().toString().padStart(2, "0");
	const mm = local.getMinutes().toString().padStart(2, "0");

	return `${hh}:${mm}`;
};

export const localTimeStringToUtcDate = (time: string): Date => {
	const [hh, mm] = time.split(":").map(Number);

	const local = new Date();
	local.setHours(hh, mm, 0, 0);

	return new Date(
		Date.UTC(
			local.getFullYear(),
			local.getMonth(),
			local.getDate(),
			local.getHours(),
			local.getMinutes(),
			0,
		),
	);
};
