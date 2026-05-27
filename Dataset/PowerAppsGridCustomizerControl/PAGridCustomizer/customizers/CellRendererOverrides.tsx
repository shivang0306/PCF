import { Label } from '@fluentui/react';
import * as React from 'react';
import { CellRendererProps, GetRendererParams, RECID } from '../types';
import { PcfContextService } from '../services/PcfContextService';
import RecordImageCellApp from '../component/RecordImageCellApp';
import { Field, ProgressBar, Switch } from '@fluentui/react-components';

export const cellRendererOverrides =
    (pcfContextService: PcfContextService, targetColumns: string) => {

        var _multiSelectOptionCount: number;

        const targetColumnsArr = targetColumns.split(',');
        const trimmedtargetColumnsArrArray = targetColumnsArr.map(item => item.trim());

        return {

            ["Text"]: (props: CellRendererProps, rendererParams: GetRendererParams) => {
                const { columnIndex, colDefs, rowData } = rendererParams;
                const columnName = colDefs[columnIndex].name;

                if (trimmedtargetColumnsArrArray.length > 0 && trimmedtargetColumnsArrArray.includes(columnName)) {
                    const { columnIndex, colDefs, rowData } = rendererParams;
                    const isPrimary = colDefs[columnIndex].isPrimary;

                    // Renders only for the PrimaryName of the entity
                    if (!isPrimary) {
                        return null;
                    }

                    // Depending on pagetype, get the entityname
                    const pageType = (pcfContextService.context as any).factory._customControlProperties.pageType

                    const entityname = pageType == 'EntityList' ?
                        (pcfContextService.context as any).page.entityTypeName :
                        (pcfContextService.context as any).factory._customControlProperties.descriptor.Parameters.TargetEntityType

                    const recordid = rowData?.[RECID]

                    return (
                        <RecordImageCellApp
                            entityname={entityname}
                            recordid={recordid!}
                            name={props.formattedValue!}
                            startEditing={props.startEditing}
                            pcfContextService={pcfContextService}
                        />

                    )
                }
                else {
                    return null;
                }
            },
            ["Lookup"]: (props: CellRendererProps, rendererParams: GetRendererParams) => {
                const { columnIndex, colDefs, rowData } = rendererParams;
                const columnName = colDefs[columnIndex].name;

                if (trimmedtargetColumnsArrArray.length > 0 && trimmedtargetColumnsArrArray.includes(columnName)) {

                    // Extract the entityname and recordid from dynamic property (columnName)
                    type ObjectKey = keyof typeof rowData;
                    const columnNameProperty = columnName as ObjectKey;

                    const lookup = rowData?.[columnNameProperty] as any
                    if (lookup == null) {
                        return null
                    }
                    const entityname = lookup.etn
                    const recordid = lookup.id.guid

                    return (
                        <RecordImageCellApp
                            entityname={entityname}
                            recordid={recordid}
                            name={props.formattedValue!}
                            startEditing={props.startEditing}
                            pcfContextService={pcfContextService}
                        />

                    )
                }
                else {
                    return null;
                }
            },
            ["Currency"]: (props: CellRendererProps, rendererParams: GetRendererParams) => {
                const { columnIndex, colDefs, rowData } = rendererParams;
                const columnName = colDefs[columnIndex].name;

                if (trimmedtargetColumnsArrArray.length > 0 && trimmedtargetColumnsArrArray.includes(columnName)) {
                    // Render the cell value in green when the value is blue than $100,000 and red otherwise
                    if ((props.value as number) > 100) {
                        return <Label style={{ color: 'green' }}>{props.formattedValue}</Label>
                    }
                    else {
                        return <Label style={{ color: 'red' }}>{props.formattedValue}</Label>
                    }
                }
                else {
                    return null;
                }
            },
            ["MultiSelectPicklist"]: (props: CellRendererProps, rendererParams: GetRendererParams) => {
                debugger;
                const { columnIndex, colDefs, rowData } = rendererParams;
                const columnName = colDefs[columnIndex].name;

                const rowValue: number[] = rowData[columnName];
                const cell = rendererParams.colDefs[rendererParams.columnIndex];
                _multiSelectOptionCount = (cell as any).customizerParams.dropDownOptions.length;

                if (trimmedtargetColumnsArrArray.length > 0 && trimmedtargetColumnsArrArray.includes(columnName)) {
                    return (
                        <div>
                            <Field validationMessage="Large ProgressBar" validationState="none">
                                <ProgressBar
                                    style={{ margin: '20px 0px' }}
                                    thickness="large"
                                    value={(rowValue.length / _multiSelectOptionCount)}
                                />
                            </Field>
                        </div>
                    )
                }
                else {
                    return null;
                }
            },
            ["TwoOptions"]: (props: CellRendererProps, rendererParams: GetRendererParams) => {
                const { columnIndex, colDefs, rowData } = rendererParams;
                const columnName = colDefs[columnIndex].name;

                const rowValue: boolean = rowData[columnName];

                if (trimmedtargetColumnsArrArray.length > 0 && trimmedtargetColumnsArrArray.includes(columnName)) {

                    // if (rowValue) {
                    return (
                        <>
                            <Switch checked={rowValue} disabled />
                        </>
                    )
                    // }
                    // else {
                    //     return (
                    //         <>
                    //             <Switch />
                    //         </>
                    //     )
                    // }
                }
                else {
                    return null;
                }
            }
        }
    }
