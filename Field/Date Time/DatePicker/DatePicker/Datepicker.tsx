import * as React from 'react';
import { StyledEngineProvider } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Dayjs } from 'dayjs';
import * as dayjs from 'dayjs';
// import { makeStyles } from "@fluentui/react-components";

export interface DatePickerProps {
    selectedValue: Date | null;
    onChange: (changedDate?: Date | null) => void;
    isDisabled: boolean;
}

export const DatePickerElement: React.FC<DatePickerProps> = (datePickerProps) => {

    const selectedDate: Dayjs | null = datePickerProps.selectedValue != null ? dayjs().set('year', (datePickerProps.selectedValue).getFullYear()).set('month', (datePickerProps.selectedValue).getMonth()) : null;

    const maxDate: Dayjs = dayjs().set('year', (new Date()).getFullYear()).set('month', ((new Date()).getMonth()-1))

    return (
        <StyledEngineProvider injectFirst>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    views={['month', 'year']}
                    value={selectedDate}
                    onChange={(date: Dayjs | null) => {
                        datePickerProps.onChange(date ? date.toDate() : null);
                    }}
                    disabled={datePickerProps.isDisabled}
                    maxDate={maxDate}
                    sx={{
                        width: '100%', // Set full width
                        backgroundColor: '#F5F5F5', // Set background color
                        '& .MuiInputBase-root': {
                            backgroundColor: '#F5F5F5', // Set background color
                            border: 'none', // Remove border
                            '&:hover': {
                                border: 'none', // Remove border on hover
                            },
                            '&.Mui-focused': {
                                borderBottom: '2px solid #2C7DC4', // Bottom border on focus
                                borderRadius: '0px', // Remove any border radius
                            },
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                            border: 'none', // Ensure outline border is removed
                        },
                        '& .MuiOutlinedInput-input': {
                            padding: '7px 12px', // Adjust padding as needed
                        },
                    }}
                />
            </LocalizationProvider>
        </StyledEngineProvider>
    );
};