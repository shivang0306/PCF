import * as React from "react";
import { Stack, Text, Toggle } from "@fluentui/react";
import { TimePicker } from "@fluentui/react-timepicker-compat";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";
import { DaySchedule } from "./types";

interface Props {
	value: DaySchedule[];
	onChange: (data: DaySchedule[]) => void;
}

type UiDay = Omit<DaySchedule, "start" | "end"> & {
	start: Date | null; // LOCAL (viewer timezone)
	end: Date | null;
};

export const ScheduleEditor: React.FC<Props> = ({ value, onChange }) => {
	const [ui, setUi] = React.useState<UiDay[]>([]);
	const [errors, setErrors] = React.useState<Record<number, string>>({}); // UTC (stored) → LOCAL (viewer timezone)

	const utcToLocal = (utc: Date | null): Date | null => {
		if (!utc) return null;
		return new Date(utc);
	}; // UI display

	const formatTime = (d: Date | null): string =>
		d ?
			d.toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			})
		:	"";

	React.useEffect(() => {
		setUi(
			value.map((d) => ({
				...d,
				start: utcToLocal(d.start),
				end: utcToLocal(d.end),
			})),
		);
	}, [value]);

	const update = (index: number, changes: Partial<UiDay>) => {
		const next = [...ui];
		const row = { ...next[index], ...changes };
		next[index] = row;

		const nextErrors = { ...errors };

		if (row.start && row.end && row.end < row.start) {
			nextErrors[index] = "End time must be after Start time";
		} else {
			delete nextErrors[index];
		}

		setUi(next);
		setErrors(nextErrors);

		onChange(
			next.map((d) => ({
				dayIndex: d.dayIndex,
				day: d.day,
				enabled: d.enabled,
				start: d.start ?? null,
				end: d.end ?? null,
			})),
		);
	};

	return (
		<Stack tokens={{ childrenGap: 12 }}>
			{ui.map((d, i) => {
				const startHour = d.start ? d.start.getHours() : undefined;
				return (
					<Stack key={d.dayIndex} tokens={{ childrenGap: 4 }}>
						<Stack
							horizontal
							wrap
							verticalAlign="center"
							tokens={{ childrenGap: 20 }}>
							{/* LEFT SECTION */}
							<Stack
								horizontal
								verticalAlign="center"
								tokens={{ childrenGap: 12 }}
								styles={{ root: { minWidth: 220 } }}>
								<Text
									styles={{
										root: { width: 100, fontWeight: 600, textAlign: "left" },
									}}>
									{d.day}
								</Text>

								<Toggle
									checked={d.enabled}
									onText="On"
									styles={{
										root: { margin: "0 auto" },
									}}
									offText="Off"
									onChange={(_, checked) =>
										update(i, {
											enabled: !!checked,
											start: checked ? d.start : null,
											end: checked ? d.end : null,
										})
									}
								/>
							</Stack>

							{/* RIGHT SECTION */}
							<Stack
								horizontal
								wrap
								tokens={{ childrenGap: 16 }}
								styles={{ root: { flexGrow: 1 } }}>
								<Stack.Item grow styles={{ root: { minWidth: 120 } }}>
									<FluentProvider theme={webLightTheme}>
										<TimePicker
											style={{ width: "100%" }}
											appearance="filled-darker"
											clearable
											dateAnchor={new Date(2000, 0, 1)}
											placeholder="Start Time"
											hourCycle="h12"
											disabled={!d.enabled}
											selectedTime={d.start}
											value={formatTime(d.start)}
											onTimeChange={(_, data) =>
												update(i, {
													start: data.selectedTime,
													end: !data.selectedTime ? null : d.end,
												})
											}
											increment={15}
										/>
									</FluentProvider>
								</Stack.Item>

								<Stack.Item grow styles={{ root: { minWidth: 120 } }}>
									<FluentProvider theme={webLightTheme}>
										<TimePicker
											style={{ width: "100%" }}
											appearance="filled-darker"
											clearable
											dateAnchor={new Date(2000, 0, 1)}
											placeholder="End Time"
											hourCycle="h12"
											disabled={!d.enabled || !d.start}
											selectedTime={d.end}
											value={formatTime(d.end)}
											startHour={startHour as any}
											onTimeChange={(_, data) =>
												update(i, { end: data.selectedTime })
											}
											increment={15}
										/>
									</FluentProvider>
								</Stack.Item>
							</Stack>
						</Stack>

						{/* Error */}
						{errors[i] && (
							<Text
								variant="small"
								styles={{
									root: {
										color: "#a80000",
										marginLeft: 110,
									},
								}}>
								{errors[i]}
							</Text>
						)}
					</Stack>
				);
			})}
		</Stack>
	);
};
