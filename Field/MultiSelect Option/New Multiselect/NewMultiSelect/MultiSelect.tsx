import * as React from "react";
import {
    shorthands,
    Input,
    makeStyles
} from "@fluentui/react-components";
import {
    IDropdownOption,
    Dropdown,
    Stack,
    IStackTokens
} from "office-ui-fabric-react";

interface MultiselectProps {
    selectedRecordId?: number[];
    availableOptions: ComponentFramework.PropertyTypes.MultiSelectOptionSetProperty;
    onChange: (selectedOptions?: number[]) => void;
}

const useStyles = makeStyles({
    root: {
        // display: "grid",
        // gridTemplateRows: "repeat(1fr)",
        // justifyItems: "start",
        // ...shorthands.gap("8px"),
        // maxWidth: "100%",
        padding: "10px",
        backgroundColor: "#f4f4f4",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
    searchInput: {
        marginBottom: "8px",
    },
    option: {
        // width: "100%"
    }
})

const stackTokens: IStackTokens = { childrenGap: 10 };

export const Multiselect: React.FC<MultiselectProps> = ({
    selectedRecordId = [],
    availableOptions,
    onChange,
}) => {
    const styles = useStyles();

    const handleOptionChange = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption, index?: number): void => {
        if (option) {
            const optionValue = parseInt(option.key as string);
            let updatedSelectedValues: number[];

            if (option.selected) {
                updatedSelectedValues = [...selectedRecordId, optionValue];
            } else {
                updatedSelectedValues = selectedRecordId.filter(value => value !== optionValue);
            }
            onChange(updatedSelectedValues);
        }
    };

    const [searchTerm, setSearchTerm] = React.useState("");

    // const dropdownOptions: IDropdownOption[] = availableOptions.attributes?.Options
    //     ? availableOptions.attributes.Options.map(option => ({
    //         key: option.Value.toString(),
    //         text: option.Label,
    //         selected: selectedRecordId.includes(option.Value)
    //     }))
    //     : [];

    const filteredOptions = availableOptions.attributes?.Options.filter(option =>
        option.Label.toLowerCase().includes(searchTerm.toLowerCase())
    ).map(option => ({
        key: option.Value.toString(),
        text: option.Label,
        selected: selectedRecordId?.includes(option.Value) || false,
    })) || [];

    // const selectedOptionsText = selectedRecordId.map(id => {
    //     const selectedOption = availableOptions.attributes?.Options.find(option => option.Value === id);
    //     return selectedOption ? selectedOption.Label : "";
    // }).join(", ");

    return (
        <div className={styles.root}>
            <Input
                placeholder="Search options..."
                className={styles.searchInput}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Stack tokens={stackTokens} className={styles.option}>
                <Dropdown
                    placeholder="Select options"
                    multiSelect
                    options={filteredOptions}
                    onChange={handleOptionChange}
                />
            </Stack>
        </div>
    );
};
