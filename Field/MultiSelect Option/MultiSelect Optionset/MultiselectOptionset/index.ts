import { IInputs, IOutputs } from "./generated/ManifestTypes"
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Multiselect } from "./MultiSelect";

export class MultiselectOptionset implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    private container: HTMLDivElement;
    private notifyOutputChanged: () => void;

    private SelectedOptions?: number[] | null;
    private availableOptions: ComponentFramework.PropertyTypes.MultiSelectOptionSetProperty;

    constructor() { }

    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement): void {
        this.container = container;
        this.notifyOutputChanged = notifyOutputChanged;

        this.SelectedOptions = context.parameters.MultiSelect.raw;
    }

    public updateView(context: ComponentFramework.Context<IInputs>): void {
        // Add code to update control view

        this.SelectedOptions = context.parameters.MultiSelect.raw;
        this.renderControl(context);
    }

    public getOutputs(): IOutputs {
        return {
            MultiSelect: this.SelectedOptions || []
        };
    }

    public destroy(): void {
        // Add code to cleanup control if necessary
        ReactDOM.unmountComponentAtNode(this.container)
    }

    private async renderControl(context: ComponentFramework.Context<IInputs>) {
        debugger
        this.availableOptions = (context.parameters.MultiSelect as ComponentFramework.PropertyTypes.MultiSelectOptionSetProperty);

        const MultiSelector = React.createElement(Multiselect, {
            selectedRecordId: this.SelectedOptions || [],
            availableOptions: this.availableOptions,
            onChange: (selectedOption?: number[]) => {
                this.SelectedOptions = selectedOption && selectedOption.length > 0 ? selectedOption : undefined;
                this.notifyOutputChanged();
            }
        });

        ReactDOM.render(MultiSelector, this.container);
    }
}
