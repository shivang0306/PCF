import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { cellRendererOverrides } from "./customizers/CellRendererOverrides";
import { cellEditorOverrides } from "./customizers/CellEditorOverrides";
import { PowerAppsProps } from "./types";
import { IPcfContextServiceProps, PcfContextService } from "./services/PcfContextService";
import * as React from "react";

export class ViewConfigurator implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    /**
     * Empty constructor.
     */
    constructor() {
        // do nothing.
    }

    private _eventName: string | null
    private _targetColumns: string

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     */
    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary
    ): void {
        this._eventName = context.parameters.EventName.raw
        
        this.getTartgetColumns(context).then((data)=>{
            // this._targetColumns = 'sscrm_country,sscrm_money,sscrm_multiselect,sscrm_name,sscrm_stage,sscrm_switch';
            this._targetColumns = data;
            if (this._eventName) {

                const pcfContextServiceProps: IPcfContextServiceProps = {
                    context: context,
                    instanceid: this._eventName
                }
    
                const eventName = context.parameters.EventName.raw;
    
                const pcfContextService = new PcfContextService(pcfContextServiceProps);
    
                const powerAppsProps: PowerAppsProps = { cellRendererOverrides: cellRendererOverrides(pcfContextService, this._targetColumns), cellEditorOverrides };
                (context as any).factory.fireEvent(eventName, powerAppsProps);
            }
        });
    }

    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     * @returns ReactElement root react element for the control
     */
    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
        return React.createElement(React.Fragment);
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    public getOutputs(): IOutputs {
        return {};
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        // Add code to cleanup control if necessary
    }

    private getTartgetColumns(context: ComponentFramework.Context<IInputs>): Promise<string> {
        debugger
        var entityName = context["page"]["entityTypeName"];
        var res;
        return new Promise((resolve, reject)=>{
            context.webAPI.retrieveMultipleRecords("environmentvariabledefinition", "?$select=defaultvalue&$filter=schemaname eq '" + entityName + "_TargetColumn'").then((data)=>{
                 resolve(data.entities[0]["defaultvalue"])
            }).catch((err)=>{
                reject(err);
            })

        })
        
    }
}
