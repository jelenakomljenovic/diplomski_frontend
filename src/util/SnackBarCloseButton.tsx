import { useSnackbar } from 'notistack';
import * as React from 'react';
import { Close as IconClose } from '@mui/icons-material';
import {IconButton} from "@mui/material";

function SnackbarCloseButton({ snackbarKey} : any) {
    const { closeSnackbar } = useSnackbar();

    return (
        <IconButton onClick={() => closeSnackbar(snackbarKey)}>
            <IconClose style={{color: "white", width: "18px", height: "18px"}}/>
        </IconButton>
    );
}

export default SnackbarCloseButton;