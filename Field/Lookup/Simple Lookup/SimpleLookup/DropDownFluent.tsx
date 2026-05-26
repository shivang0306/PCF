import * as React from "react";
import { Dropdown, IDropdownOption } from "@fluentui/react";

export interface LookupControlProperty {
    selectedRecorId: string | undefined;
    availableOptions: IDropdownOption[];
    onChange: (selectedOption? : IDropdownOption) => void;
}

export const DropDownSelector: React.FunctionComponent<LookupControlProperty> = (prop => {
    return(
        <Dropdown
            selectedKey={prop.selectedRecorId}
            options={prop.availableOptions}
            onChange={(e: any, selectedOption?: IDropdownOption) => {
                prop.onChange(selectedOption)
            }}
        />
    )
})