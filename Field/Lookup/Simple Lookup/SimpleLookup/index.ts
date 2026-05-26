import { IDropdownOption } from "@fluentui/react";
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as React from "react";
import * as ReactDom from 'react-dom';
import { DropDownSelector } from "./DropDownFluent";

export class SimpleLookup implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    private container: HTMLDivElement;
    private notifyOutputChanged: () => void;
    private entityName: string;
    private OptionsArray: IDropdownOption[];

    private currentValue?: ComponentFramework.LookupValue[];

    constructor() {
    }

    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement): void {
        this.container = container;
        this.notifyOutputChanged = notifyOutputChanged;
        // this.context = context;

        this.entityName = context.parameters.lookup.getTargetEntityType();
        console.log("entityName: " + this.entityName);
    }

    public updateView(context: ComponentFramework.Context<IInputs>): void {
        this.renderControl(context);

        // const formContext = context.mode as ComponentFramework.Mode;

        // (formContext as any).getAttribute(context.parameters.sample.attributes?.LogicalName).setValue("test");
    }

    public getOutputs(): IOutputs {
        return {
            lookup: this.currentValue,
            sample: "test"
        };
    }

    public destroy(): void {
        ReactDom.unmountComponentAtNode(this.container);
    }

    private async renderControl(context: ComponentFramework.Context<IInputs>): Promise<void> {
        if (typeof (this.OptionsArray) == "undefined") {
            try {
                await this.SetOptionsArray(context);
            } catch (error) {
                console.error("Error setting options array: ", error);
                return;
            }
        }

        const recordId = context.parameters.lookup.raw && context.parameters.lookup.raw.length ? context.parameters.lookup.raw[0].id : undefined;
        console.log("selected recordId: " + recordId);

        const recordSelector = React.createElement(DropDownSelector, {
            selectedRecorId: recordId,
            availableOptions: this.OptionsArray,
            onChange: (selectedOption?: IDropdownOption) => {
                this.currentValue = selectedOption ? [{
                    id: selectedOption.key as string,
                    name: selectedOption.text,
                    entityType: this.entityName
                }] : undefined;
                this.notifyOutputChanged();
            }
        });

        ReactDom.render(recordSelector, this.container);
    }

    private async SetOptionsArray(context: ComponentFramework.Context<IInputs>): Promise<void> {
        const metaData = await context.utils.getEntityMetadata(this.entityName);
        const entityIdField = metaData.PrimaryIdAttribute;
        console.log("entityIdField: " + entityIdField);
        const entityNameField = metaData.PrimaryNameAttribute;
        console.log("entityNameField: " + entityNameField);
        const webAPIquery = `?$select=${entityIdField},${entityNameField}`;
        
        const result = await context.webAPI.retrieveMultipleRecords(this.entityName, webAPIquery);
        console.log("options: ", result);

        this.OptionsArray = result.entities.map((r: any) => ({
            key: r[entityIdField],
            text: r[entityNameField]
        }));
    }
}

