import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { App } from "./components/App";
import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;
type DataSet = ComponentFramework.PropertyTypes.DataSet;

export class ScheduleBoard
	implements ComponentFramework.StandardControl<IInputs, IOutputs>
{
	constructor() {
		// Empty
	}

	private container!: HTMLDivElement;
	private context!: ComponentFramework.Context<IInputs>;

	public init(
		context: ComponentFramework.Context<IInputs>,
		notifyOutputChanged: () => void,
		state: ComponentFramework.Dictionary,
		container: HTMLDivElement
	): void {
		this.context = context;
		this.container = container;
	}

	public updateView(context: ComponentFramework.Context<IInputs>): void {
		ReactDOM.render(
			React.createElement(App, { context: context }),
			this.container
		);
	}

	public getOutputs(): IOutputs {
		return {};
	}

	destroy(): void {
		ReactDOM.unmountComponentAtNode(this.container);
	}
}
