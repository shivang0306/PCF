import * as React from "react";
import * as ReactDom from 'react-dom';
import { DatePickerElement } from "./Datepicker";
import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class DatePicker implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    private container: HTMLDivElement;
    private notifyOutputChanged: () => void;

    private PreValue: Date | undefined;

    constructor()
    {
        // Empty constructor.
    }

    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement): void
    {
        this.container = container;
        this.notifyOutputChanged = notifyOutputChanged;
    }
    
    
    public updateView(context: ComponentFramework.Context<IInputs>): void
    {
        this.PreValue = context.parameters.DatePicker.raw!;

        const datePicker = React.createElement(DatePickerElement, {
            selectedValue: this.PreValue!,
            onChange: (changedDate?: Date | null) => {
                this.PreValue = changedDate != null ? changedDate : undefined;
                this.notifyOutputChanged();
            },
            isDisabled: context.mode.isControlDisabled
        });

        ReactDom.render(datePicker, this.container);
    }

    public getOutputs(): IOutputs
    {
        return {
            DatePicker: this.PreValue
        };
    }

    public destroy(): void
    {
        ReactDom.unmountComponentAtNode(this.container);
    }
}
