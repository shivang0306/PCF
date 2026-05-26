import React from "react";
import { createRoot, Root } from "react-dom/client";
import TimePickerControlNewLook from "./components/TimePickerControlNewLook";
import { convertDate, getUtcDate } from "./services/dateService";
import { IExtendedContext } from "./types/extendedContext";
import { TimePickerControlProps } from "./types/typings";
import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class TimePicker
	implements ComponentFramework.StandardControl<IInputs, IOutputs>
{
	private context: IExtendedContext;
	private container: HTMLDivElement;
	private notifyOutputChanged: () => void;
	private root: Root;
	private outputValue: Date | null;

	constructor() {
		// empty
	}

	public init(
		context: IExtendedContext,
		notifyOutputChanged: () => void,
		state: ComponentFramework.Dictionary,
		container: HTMLDivElement
	): void {
		this.context = context;
		this.container = container;
		this.notifyOutputChanged = notifyOutputChanged;
		this.root = createRoot(this.container);
	}

	public updateView(context: IExtendedContext): void {
		this.context = context;
		this.render();
	}

	public getOutputs(): IOutputs {
		return {
			boundField: this.outputValue ?? undefined,
		};
	}

	public destroy(): void {
		this.root.unmount();
	}

	public render(): void {
		const boundValue = this.convertToLocalDate(
			this.context.parameters.boundField
		);
		const dateAnchor = new Date(2000, 1, 1, 0, 0);

		const props: TimePickerControlProps = {
			inputValue: boundValue,
			dateAnchor: dateAnchor,
			disabled: this.context.mode.isControlDisabled,
			placeholder: this.context.parameters.placeholder.raw ?? undefined,
			increment: this.context.parameters.increment.raw ?? undefined,
			hourCycle12: this.context.parameters.hourCycle12.raw === "1",
			freeform: this.context.parameters.freeform.raw === "1",
			startHour: this.context.parameters.startHour.raw ?? undefined,
			endHour: this.context.parameters.endHour.raw ?? undefined,
			fluentDesign: this.context.fluentDesignLanguage,
			onTimeChange: (time) => {
				this.outputValue = time;
				this.notifyOutputChanged();
			},
		};

		const key = boundValue ? boundValue.getTime() : 0;

		this.root.render(
			React.createElement(TimePickerControlNewLook, { key, ...props })
		);
	}

	public convertToLocalDate(
		dateProperty: ComponentFramework.PropertyTypes.DateTimeProperty
	) {
		if (dateProperty.attributes?.Behavior === 1) {
			// user local
			if (!dateProperty.raw) return null;

			return convertDate(
				dateProperty.raw,
				this.context.userSettings.getTimeZoneOffsetMinutes(dateProperty.raw)
			);
		} else {
			return getUtcDate(dateProperty.raw);
		}
	}
}
