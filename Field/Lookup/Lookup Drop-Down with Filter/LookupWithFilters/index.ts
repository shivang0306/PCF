import { IDropdownOption } from "@fluentui/react";
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { DropDownSelector } from "./DropDown";

export class LookupWithFilters implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    private container: HTMLDivElement;
    private notifyOutputChanged: () => void;
    private context: ComponentFramework.Context<IInputs>;
    private availableOptions: IDropdownOption[]
    private TargetEntity: string;
    private DisplayField: string | null;

    private FilteringEntity: string | null;
    private LookupEntityComparisonField: string | null;
    private SelectedRelatedEntity?: ComponentFramework.LookupValue[]; 

    private _formFilterFieldValue: ComponentFramework.PropertyTypes.Property;

    private currentValue?: ComponentFramework.LookupValue[];

    constructor() { }

    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement): void {
        this.context = context;
        this.container = container;
        this.notifyOutputChanged = notifyOutputChanged;

        this._formFilterFieldValue = context.parameters.FormFilterComparisonField;
        console.log('Form Filter Field Value:', this._formFilterFieldValue);

        // Get & Set target entity
        this.TargetEntity = context.parameters.lookup.getTargetEntityType();
        this.DisplayField = context.parameters.OptionDisplayField.raw;

        // Get & Set comparision Field
        this.LookupEntityComparisonField = context.parameters.LookupEntityComparisonField.raw;
        
        // Get & Set filter fields
        this.FilteringEntity = context.parameters.FormFilterComparisonField.getTargetEntityType();
        this.SelectedRelatedEntity = context.parameters.FormFilterComparisonField.raw;
    }

    public updateView(context: ComponentFramework.Context<IInputs>): void {
        this.SelectedRelatedEntity = context.parameters.FormFilterComparisonField.raw;
        this.renderControl(context);
    }

    public getOutputs(): IOutputs {
        return {
            lookup: this.currentValue
        };
    }

    public destroy(): void {
        ReactDOM.unmountComponentAtNode(this.container)
    }

    private async renderControl(context: ComponentFramework.Context<IInputs>) {
        // if (typeof (this.availableOptions) == "undefined") {
            try {
                await this.SetOptionsArray(context);
            } catch (error) {
                console.error("Error setting options array: ", error);
                return;
            }
        // }

        const recordId = context.parameters.lookup.raw && context.parameters.lookup.raw.length ? context.parameters.lookup.raw[0].id : undefined;
        console.log("selected recordId: " + recordId);

        const recordSelector = React.createElement(DropDownSelector, {
            selectedRecorId: recordId,
            availableOptions: this.availableOptions,
            onChange: (selectedOption?: IDropdownOption) => {
                this.currentValue = selectedOption ? [{
                    id: selectedOption.key as string,
                    name: selectedOption.text,
                    entityType: this.TargetEntity
                }] : undefined;
                this.notifyOutputChanged();
            }
        });

        ReactDOM.render(recordSelector, this.container);
    }

    private async SetOptionsArray(context: ComponentFramework.Context<IInputs>): Promise<void> {
        const metaData = await context.utils.getEntityMetadata(this.TargetEntity);
        const optionIdField = metaData.PrimaryIdAttribute;
        const optionNameField = this.DisplayField == null ? metaData.PrimaryNameAttribute : this.DisplayField;
        
        let webAPIquery = `?$select=${optionIdField},${optionNameField}`;

        if(this.FilteringEntity != null && this.LookupEntityComparisonField != null && this.SelectedRelatedEntity != null && this.SelectedRelatedEntity.length > 0) {
            webAPIquery += `&$filter=_${this.LookupEntityComparisonField}_value eq ${this.SelectedRelatedEntity[0].id}`;
        }
        
        const result = await context.webAPI.retrieveMultipleRecords(this.TargetEntity, webAPIquery);
        console.log("options: ", result);

        this.availableOptions = result.entities.map((r: any) => ({
            key: r[optionIdField],
            text: r[optionNameField]
        }));
    }
}
