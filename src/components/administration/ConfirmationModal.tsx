import React from "react";

import { createStyles, makeStyles } from "@mui/styles";
import {Button, Dialog, DialogActions, DialogContent, Theme, Typography} from "@mui/material";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        margin: {
            margin: theme.spacing(0, 3, 0, 0),
        },
        closeButton: {
            position: "absolute",
            fontSize: theme.spacing(2),
            right: theme.spacing(1.7),
            top: theme.spacing(1.5),
            display: "inline-block",
            color: theme.palette.primary.main,
        },
        title: {
            color: theme.palette.primary.main,
            display: "inline-block",
        },
        background: {
            background: theme.palette.grey[100],
            padding: theme.spacing(3, 3),
        },
    })
);

type ConfirmationModalProps = {
    modalOpen: boolean;
    handleClose: () => void;
    handleAction?: () => void;
    modalText: string;
    title: string;
};

export default function ConfirmationModal({
                                              modalOpen,
                                              handleClose,
                                              handleAction,
                                              modalText,
                                              title,
                                          }: ConfirmationModalProps) {
    const classes = useStyles();

    return (
        <Dialog onClose={handleClose} open={modalOpen} maxWidth="xs">
            {/*<ModalDialogTitle id="dialog-title" onClose={handleClose}>*/}
            {/*    <Typography className={classes.title} variant="body2">*/}
            {/*        {title}*/}
            {/*    </Typography>*/}
            {/*</ModalDialogTitle>*/}
            <DialogContent className={classes.background}>
                <Typography gutterBottom>{modalText}</Typography>
            </DialogContent>
            <DialogActions>
                {handleAction && (
                    <Button
                        variant="outlined"
                        onClick={handleClose}
                        className={classes.margin}
                        style={{ marginRight: 0 }}
                    >
                        Odustani
                    </Button>
                )}
                <Button
                    onClick={() => {
                        if (handleAction) {
                            handleAction();
                        } else {
                            handleClose();
                        }
                    }}
                    className={classes.margin}
                >
                    U redu
                </Button>
            </DialogActions>
        </Dialog>
    );
}
