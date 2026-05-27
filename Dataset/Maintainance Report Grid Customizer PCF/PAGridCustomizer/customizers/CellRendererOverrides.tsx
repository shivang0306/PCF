import * as React from 'react';
import { CellRendererProps, GetRendererParams } from '../types';
import { IInputs } from '../generated/ManifestTypes';
import IncidentTypes, { IncidentProp } from './IncidentTypes';
// import DisplayPopup from './DisplayPopup';

export const BlockRenderer = (context: ComponentFramework.Context<IInputs>) => {

    return {
        ["TextArea"]: (props: CellRendererProps, rendererParams: GetRendererParams) => {
            const column = rendererParams.colDefs[rendererParams.columnIndex];
            if (rendererParams != undefined) {
                let id = rendererParams.rowData?.__rec_id.toString();
                let props1: IncidentProp = {
                    context: context,
                    id: id?.toString()
                }
                if (column.name == "gits_incidentstatus") {
                    return React.createElement(IncidentTypes, props1);
                }
                else {
                    return null;
                }
            }
        },
    }
}