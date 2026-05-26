import * as React from "react";
import { createRoot, Root } from "react-dom/client";
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { ScheduleEditor } from "./ScheduleEditor";
import { DaySchedule } from "./types";

export class DayWiseTime implements ComponentFramework.StandardControl<
	IInputs,
	IOutputs
> {
	constructor() {
		// Empty
	}

	private container: HTMLDivElement;
	private notifyOutputChanged: () => void;
	private value: string | undefined;
	private root: Root;

	public init(
		context: ComponentFramework.Context<IInputs>,
		notifyOutputChanged: () => void,
		state: ComponentFramework.Dictionary,
		container: HTMLDivElement,
	): void {
		this.container = container;
		this.notifyOutputChanged = notifyOutputChanged;
		this.value = context.parameters.schedule_JSON.raw ?? "";
		this.root = createRoot(this.container);
	}

	public updateView(context: ComponentFramework.Context<IInputs>): void {
		// Add code to update control view
		this.value = context.parameters.schedule_JSON.raw ?? "";

		const data = this.parseJson(this.value);

		this.root.render(
			React.createElement(ScheduleEditor, {
				value: data,
				onChange: (updatedData) => {
					this.value = JSON.stringify(
						updatedData.map((d) => ({
							...d,
							start: d.start ? d.start.toISOString() : null,
							end: d.end ? d.end.toISOString() : null,
						})),
					);
					this.notifyOutputChanged();
				},
			}),
		);
	}

	public getOutputs(): IOutputs {
		return {
			schedule_JSON: this.value,
		};
	}

	public destroy(): void {
		this.root.unmount();
	}

	private parseJson(value: string): DaySchedule[] {
		try {
			if (!value) {
				return this.defaultSchedule();
			}

			const parsed = JSON.parse(value);

			if (!Array.isArray(parsed) || parsed.length === 0) {
				return this.defaultSchedule();
			}

			return parsed.map((d: any) => ({
				dayIndex: d.dayIndex,
				day: d.day,
				enabled: !!d.enabled,
				start: d.start ? new Date(d.start) : null,
				end: d.end ? new Date(d.end) : null,
			}));
		} catch {
			return this.defaultSchedule();
		}
	}

	private defaultSchedule(): DaySchedule[] {
		const days = [
			"Sunday",
			"Monday",
			"Tuesday",
			"Wednesday",
			"Thursday",
			"Friday",
			"Saturday",
		];
		return days.map((d, i) => ({
			dayIndex: i,
			day: d,
			enabled: false,
			start: null,
			end: null,
		}));
	}
}
