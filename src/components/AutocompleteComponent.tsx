import React, {SyntheticEvent} from 'react';
import FormControl from "@mui/material/FormControl";
import "./SelectField.css";
import {Autocomplete, AutocompleteValue, darken, lighten, TextField} from "@mui/material";
import {CreateFacultyRequest} from "../api/faculty/faculty";
import {styled} from "@mui/system";

type AutocompleteProps = {
    label: string;
    formData?: CreateFacultyRequest;
    defaultValue?: any;
    options: any[];
    property: string;
    handleChange: (event: SyntheticEvent, value: AutocompleteValue<any, any, any, any>) => void;
    error?: boolean;
    style?: React.CSSProperties;
    maxHeight?: any;
    size?: "small" | "medium" | undefined;
    myKey?: number;
    value?: any;
};


const GroupHeader = styled('div')(({theme}) => ({
    position: 'sticky',
    top: '-8px',
    padding: '4px 10px',
    color: theme.palette.primary.main,
    backgroundColor:
        theme.palette.mode === 'light'
            ? lighten(theme.palette.primary.light, 0.85)
            : darken(theme.palette.primary.main, 0.8),
}));

const GroupItems = styled('ul')({
    padding: 0,
});


export function AutocompleteComponent({
                                          label,
                                          defaultValue,
                                          formData,
                                          options,
                                          property,
                                          handleChange,
                                          error = false,
                                          style,
                                          size,
                                          maxHeight,
                                          myKey,
                                          value
                                      }: AutocompleteProps) {

    const sortedOptions = options.sort((a, b) => {
        return a.city.localeCompare(b.city);
    });

    return (
        <FormControl required
        >
            <Autocomplete
                id={"select-label" + label}
                defaultValue={defaultValue}
                value={value ? value : defaultValue}
                options={sortedOptions}
                key={myKey}
                groupBy={(option) => option.city}
                ListboxProps={{style: {maxHeight: maxHeight}}}
                onChange={(event, value) => {
                    handleChange(event, value);
                }}
                filterOptions={(options, {inputValue}) => {
                    return options.filter(option =>
                        option.name.toUpperCase().startsWith(inputValue.toUpperCase().trim())
                    );
                }}
                getOptionLabel={(option) => {
                    return option.name;
                }}
                renderOption={(props, option) => (
                    <li {...props} key={option.id}>
                        {option.name}
                    </li>
                )
                }
                isOptionEqualToValue={(option, value) => option.id === value.id}
                style={style}
                renderInput={(params) => (
                    <TextField {...params} label={label} size="small"/>
                )}
                noOptionsText={"Nema rezultata"}
            />
        </FormControl>
    );
}
