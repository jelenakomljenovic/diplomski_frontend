import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {Dispatch, SetStateAction} from "react";


type AlertType = {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    handleClickOpen: () => void;
    handleClose: () => void;
    dialogTitle: string;
    dialogContent: string;
    handleSave: () => void;
}

export default function AlertDialog({open, setOpen, handleClickOpen, handleClose, dialogTitle, dialogContent, handleSave} : AlertType) {

    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title" sx={{fontWeight: "normal !important"}}>
                    {dialogTitle}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {dialogContent}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant={"outlined"} color={"error"} size={"small"} onClick={handleClose}>Poništi</Button>
                    <Button variant={"outlined"} color={"success"} size={"small"} onClick={handleSave} autoFocus>
                        Potvrdi
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
