import React, {SyntheticEvent, useEffect, useState} from 'react';
import FormControl from "@mui/material/FormControl";
import {Autocomplete, AutocompleteValue, TextField} from "@mui/material";
import { Popper } from '@mui/material';
import { styled } from '@mui/system';

type AutocompleteProps = {
    label: string;
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

const StyledPopper = styled(Popper)(({ theme }) => ({
    zIndex: 1300,
}));

const CustomPopperComponent = (props: any) => {
    return <StyledPopper {...props} placement="bottom-start" />;
};

export function AutocompleteComponent({
                                          label,
                                          defaultValue,
                                          options,
                                          property,
                                          handleChange,
                                          style,
                                          size,
                                          maxHeight,
                                          myKey,
                                          value
                                      }: AutocompleteProps) {

    const [user, setUser] = useState<any>(defaultValue);

    useEffect(() => {
        if (defaultValue !== null) {
            setUser(defaultValue);
        }
    }, [defaultValue])

    return (
        <FormControl required style={style}>
            <Autocomplete
                id={"select-label" + label}
                freeSolo={true}
                defaultValue={defaultValue}
                value={value ? value : user}
                options={options}
                key={myKey}
                ListboxProps={{style: {maxHeight: maxHeight}}}
                onChange={(event, value) => {
                    handleChange(event, value);
                    setUser(value);
                }}
                PopperComponent={CustomPopperComponent}
                getOptionLabel={(option) => option[property]}
                renderOption={(props, option) => (
                    <li {...props}>
                        {option[property]}
                    </li>
                )}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                    <TextField {...params} label={label} size={size} style={{minWidth: "100%"}}/>
                )}
            />
        </FormControl>
    );
}
