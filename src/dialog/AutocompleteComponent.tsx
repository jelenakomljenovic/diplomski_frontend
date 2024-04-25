import React, {SyntheticEvent} from 'react';
import FormControl from "@mui/material/FormControl";
import {Autocomplete, AutocompleteValue, TextField} from "@mui/material";

type AutocompleteProps = {
    label?: string;
    formData?: any;
    defaultValue?: any;
    options?: any[];
    property?: string;
    handleChange?: (event: SyntheticEvent, value: AutocompleteValue<any, any, any, any>) => void;
    error?: boolean;
    style?: React.CSSProperties;
    maxHeight?: any;
    size?: "small" | "medium" | undefined;
    myKey?: number;
    value?: any;
};

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

    const options1 = [
        { label: 'The Godfather', id: 1 },
        { label: 'Pulp Fiction', id: 2 },
    ];

    return (
            <Autocomplete
                id={"select-label" + label}
                // freeSolo={true}
                defaultValue={defaultValue}
                value={value ? value : defaultValue}
                options={options1}
                key={myKey}
                ListboxProps={{style: {maxHeight: maxHeight}}}
                // onChange={(event, value) => {
                //     handleChange(event, value);
                // }}
                // getOptionLabel={(option) => {
                //         return option.name;
                // }}
                renderOption={(props, option) => (

                    <li {...props}>
                        {/*{option}*/}
                    </li>
                )
                }
                // isOptionEqualToValue={(option, value) => option.id === value.id}
                style={{width: "200px", height: "50px"}}
                renderInput={(params) => <TextField {...params} label="Movie"/>}
            />
    );
}
