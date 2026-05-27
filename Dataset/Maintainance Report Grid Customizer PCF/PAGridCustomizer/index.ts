import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { BlockRenderer } from "./customizers/CellRendererOverrides";
import { cellEditorOverrides } from "./customizers/CellEditorOverrides";
import { PowerAppsProps } from "./types";
import * as React from "react";

export class WorkOrderGrid implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    constructor() { }

    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary
    ): void {
        const eventName = context.parameters.EventName.raw;
        if (eventName) {
            const PowerAppsProps: PowerAppsProps = { cellRendererOverrides:BlockRenderer(context), cellEditorOverrides };
            (context as any).factory.fireEvent(eventName, PowerAppsProps);
        }
    }

    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
        return React.createElement(React.Fragment);
    }

    public getOutputs(): IOutputs {
        return {};
    }

    public destroy(): void {
       
    }
}