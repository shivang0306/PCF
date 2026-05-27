import { IInputs, IOutputs } from "./generated/ManifestTypes";
import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;
type DataSet = ComponentFramework.PropertyTypes.DataSet;

export class GroupingGrid implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    private _container: HTMLDivElement;

    constructor() {

    }

    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement): void {
        // Add control initialization code
        this._container = container;
    }

    public updateView(context: ComponentFramework.Context<IInputs>): void {
        // Add code to update control view
        // Extract all unique incident types
        const incidentTypes: Set<string> = new Set();
        const datasetRows = context.parameters.WorkOrderDataSet.sortedRecordIds.map((recordId: string | number) => {
            const record = context.parameters.WorkOrderDataSet.records[recordId];
            const incidentType = record.getFormattedValue("msdyn_primaryincidenttype");
            if (incidentType) {
                incidentTypes.add(incidentType);
            }
        });

        // Convert the Set to an Array for easier processing
        const uniqueIncidentTypes = Array.from(incidentTypes);

        // Create table columns dynamically, starting with Property and Unit
        const columns = ["Property", "Unit", ...uniqueIncidentTypes]; // dynamically add unique incident types

        // Create rows based on the dataset
        const rows = context.parameters.WorkOrderDataSet.sortedRecordIds.map((recordId: string | number) => {
            const record = context.parameters.WorkOrderDataSet.records[recordId];

            // Retrieve the values for the "Property" and "Unit" fields
            const property = record.getFormattedValue("gits_property") || "";
            const unit = record.getFormattedValue("gits_unit") || "";

            // Create an object to hold the system status values for each incident type
            const incidentStatusMap: { [key: string]: string } = {};

            // For each incident type, store the system status in the map
            uniqueIncidentTypes.forEach((type: string) => {
                if (record.getFormattedValue("msdyn_primaryincidenttype") === type) {
                    incidentStatusMap[type] = record.getFormattedValue("msdyn_systemstatus") || "";
                } else {
                    incidentStatusMap[type] = ""; // Empty if no matching type for this row
                }
            });

            // Create the row dynamically, starting with Property and Unit, then adding the system statuses for each type
            return [
                property,
                unit,
                ...uniqueIncidentTypes.map(type => incidentStatusMap[type]) // Map the system status for each incident type
            ];
        });

        // Now build the HTML for the table
        let tableHtml = "";
        tableHtml = `
     <style>
         table {
             width: 100%;
             border-collapse: collapse;
             margin-top: 10px;
             font-size: 13px;
             font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
         }
         th, td {
             padding: 10px;
             text-align: left;
             border: 1px solid #d0d0d0;
         }
         th {
             background-color: #0078d4; /* Primary D365 Color */
             color: white;
             font-weight: normal; /* Lighten the header font */
         }
         tr:nth-child(even) {
             background-color: #f7f7f7; /* Light gray for even rows */
         }
         tr:hover {
             background-color: #e2e2e2; /* Light gray for row hover */
         }
         tr:last-child td {
             border-bottom: none;
         }
         .table-container {
             border: 1px solid #d0d0d0;
             border-radius: 5px;
             overflow: hidden;
         }
     </style>
     <div class="table-container">
         <table>
             <thead>
                 <tr>${columns.map(col => `<th>${col}</th>`).join("")}</tr>
             </thead>
             <tbody>
                 ${rows.map((row: any[]) => `<tr>${row.map((cell: any) => `<td>${cell}</td>`).join("")}</tr>`).join("")}
             </tbody>
         </table>
     </div>
 `;

        this._container.innerHTML = tableHtml;
    }

    public getOutputs(): IOutputs {
        return {};
    }

    public destroy(): void {
        // Add code to cleanup control if necessary
    }
}
