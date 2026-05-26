import * as React from "react";
import {
  Dropdown,
  makeStyles,
  Option,
  shorthands,
  Input,
  Listbox,
  useId,
} from "@fluentui/react-components";
import { Checkbox } from "@fluentui/react-checkbox";

const useStyles = makeStyles({
  root: {
    display: "grid",
    gridTemplateRows: "repeat(1fr)",
    justifyItems: "start",
    ...shorthands.gap("8px"),
    maxWidth: "400px",
    padding: "10px",
    backgroundColor: "#f4f4f4",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  dropdown: {
    width: "100%",
  },
  listbox: {
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  option: {
    display: "flex",
    alignItems: "center",
    padding: "8px 12px",
    cursor: "pointer",
    backgroundColor: "#fff",
    '&:hover': {
      backgroundColor: "#e0e0e0",
    },
  },
  selectedOption: {
    backgroundColor: "#d0d0d0",
  },
  searchInput: {
    marginBottom: "8px",
  },
  checkbox: {
    marginRight: "8px",
    transform: "scale(0.8)",  // Adjust the scale to make the checkbox thinner
  },
});

export interface MultiselectProperty {
  selectedRecordId?: number[];
  availableOptions: ComponentFramework.PropertyTypes.MultiSelectOptionSetProperty;
  onChange: (selectedOptions?: number[]) => void;
}

export const Multiselect: React.FC<MultiselectProperty> = (multiselectProps) => {
  debugger;

  const styles = useStyles();
  const { selectedRecordId, availableOptions, onChange } = multiselectProps;
  const [searchTerm, setSearchTerm] = React.useState("");
  const dropdownId = useId('dropdown');

  const filteredOptions = availableOptions.attributes?.Options.filter(option =>
    option.Label.toLowerCase().includes(searchTerm.toLowerCase())
  ).map(option => ({
    key: option.Value.toString(),
    text: option.Label,
    selected: selectedRecordId?.includes(option.Value) || false,
  }));

  // return (
  //   <div className={styles.root}>
  //     <Input
  //       placeholder="Search options..."
  //       className={styles.searchInput}
  //       value={searchTerm}
  //       onChange={(e) => setSearchTerm(e.target.value)}
  //     />
  //     <Dropdown
  //       multiselect
  //       selectedOptions={selectedRecordId?.map(String)} // Convert to string if necessary
  //       onChange={(e: any, selectedOption?: number[]) => {
  //         onChange(selectedOption)
  //       }}
  //       className={styles.dropdown}
  //     >
  //       <Listbox className={styles.listbox}>
  //         {filteredOptions?.map((option) => (
  //           <Option key={option.Value} className={styles.option} text={option.Label}>
  //             <Checkbox
  //               label={option.Label}
  //               checked={selectedRecordId?.includes(option.Value) || false}
  //               onChange={() => {
  //                 const newSelectedRecordId = selectedRecordId?.includes(option.Value)
  //                   ? selectedRecordId.filter(id => id !== option.Value)
  //                   : [...(selectedRecordId || []), option.Value];
  //                 onChange(newSelectedRecordId);
  //               }}
  //               className={styles.checkbox}
  //             />
  //           </Option>
  //         ))}
  //       </Listbox>
  //     </Dropdown>
  //   </div>
  // );

  return (
    <div className={styles.root}>
      <Input
        placeholder="Search options..."
        className={styles.searchInput}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Dropdown
        multiselect
        selectedOptions={selectedRecordId?.map(String)}
        onChange={(e: any, selectedOption?: number[]) => {
          onChange(selectedOption)
        }}
        className={styles.dropdown}
        id={dropdownId}
      >
        <Listbox className={styles.listbox}>
          {filteredOptions?.map((option) => (
            <Option key={option.key} text={option.text} className={styles.option}>
              <Checkbox
                label={option.text}
                checked={option.selected}
                className={styles.checkbox}
                onChange={() => {
                  const newSelectedRecordId = option.selected && selectedRecordId != undefined
                    ? selectedRecordId.filter(id => id !== parseInt(option.key))
                    : [...(selectedRecordId || []), parseInt(option.key)];
                  onChange(newSelectedRecordId);
                }}
              />
            </Option>
          ))}
        </Listbox>
      </Dropdown>
    </div>
  );
};

// export interface MultiselectProperty {
//   selectedRecorId?: number[];
//   availableOptions: ComponentFramework.PropertyTypes.MultiSelectOptionSetProperty;
//   onChange: (selectedOptions?: number[]) => void;
// }

// export const Multiselect = (multiselectProps: MultiselectProperty) => {
//   const styles = useStyles();
//   return (
//     <div className={styles.root}>
//       <Dropdown
//         multiselect={true}
//         selectedOptions={multiselectProps.selectedRecorId?.map(String)}
//         onChange={(e: any, selectedOption?: number[]) => {
//           multiselectProps.onChange(selectedOption)
//         }}
//         // selectedKey = {multiselectProps.selectedRecorId}
//       >
//         {multiselectProps.availableOptions.attributes?.Options.map((option) => (
//           <Option key={option.Value}>
//             {option.Label}
//           </Option>
//         ))}
//       </Dropdown>
//     </div>
//   );
// };