import React, {Dispatch, SetStateAction, useState} from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    InputLabel,
    Snackbar,
    TextField,
    Typography
} from "@mui/material";
import "../Department.css";
import IconButton from "@mui/material/IconButton";
import CloseIcon from '@mui/icons-material/Close';
import {styled} from "@mui/material/styles";
import {changePassword} from "../../api/users/users";
import {ChangePasswordType} from "../../api/users/userType";
import {getIdFromToken} from "../../token/token";
import {useSnackbarHelper} from "../../util/toastUtil";


type ChangePasswordDialogProps = {
    changePasswordDialog: boolean;
    setOpenChangePasswordDialog: Dispatch<SetStateAction<boolean>>;
};

const BootstrapDialog = styled(Dialog)(({theme}) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));


export function ChangePasswordDialog({
                                         changePasswordDialog,
                                         setOpenChangePasswordDialog
                                     }: ChangePasswordDialogProps) {
    const [passwordInfo, setPasswordInfo] = useState<ChangePasswordType>({
        currentPassword: '',
        newPassword: '',
        confirmationPassword: '',
    });

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const handleClickVariant = useSnackbarHelper();

    const handleCloseSnackbar = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackbar(false);
    };

    const resetValues = () => {
        setPasswordInfo({currentPassword: '', newPassword: '', confirmationPassword: ''});
    }

    function validatePassword(password: any) {
        const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

        return regex.test(password);
    }


    const handleSaveButton = async () => {
        if (passwordInfo.currentPassword === "" || passwordInfo.newPassword === "" || passwordInfo.confirmationPassword === "") {
            handleClickVariant('error', {vertical: "top", horizontal: "right"}, "Popuni sva polja!")();
        } else {
            if (passwordInfo.newPassword === passwordInfo.confirmationPassword) {
                if (validatePassword(passwordInfo.newPassword)) {
                    const userId = getIdFromToken();
                    try {
                        await changePassword(passwordInfo, userId);
                        setOpenChangePasswordDialog(false);
                        resetValues();
                        handleClickVariant('success', {
                            vertical: "top",
                            horizontal: "right"
                        }, "Lozinka je uspješno promijenjena!")();
                    } catch (e) {
                        handleClickVariant('error', {
                            vertical: "top",
                            horizontal: "right"
                        }, "Unesite ispravnu trenutnu lozinku!")();
                    }
                } else {
                    handleClickVariant('error', {
                        vertical: "top",
                        horizontal: "right"
                    }, "Nova lozinka ne ispunjava pravila!")();
                }
            } else {
                handleClickVariant('error', {vertical: "top", horizontal: "right"}, "Lozinke se ne podudaraju!")();
            }
        }
    };

    const handleCancelButton = () => {
        setOpenChangePasswordDialog(false);
        resetValues();
    }


    return (
        <div>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={2000}
                anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                onClose={handleCloseSnackbar}
                style={{whiteSpace: "pre-wrap"}}
                ContentProps={{
                    style: {
                        whiteSpace: 'pre-line',
                    }
                }}
            />
            <BootstrapDialog
                onClose={handleCancelButton}
                aria-labelledby="customized-dialog-title"
                open={changePasswordDialog}
            >
                <DialogTitle sx={{m: 0, p: 2, ml: "2%", fontWeight: "normal !important"}} id="customized-dialog-title">
                    Izmjena lozinke
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleCancelButton}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon/>
                </IconButton>
                <DialogContent dividers>
                    <div style={{marginLeft: "2%"}}>
                        <Typography gutterBottom>
                            Nova lozinka mora sadržati
                            najmanje 8 znakova, barem jedan broj, barem jedan specijalni karakter i barem jedno veliko slovo!
                        </Typography>
                        <div style={{display: "flex", flexDirection: "column", width: "91%", paddingTop: "2%"}}>
                            <InputLabel style={{color: "rgba(133,133,133,0.84)", fontSize: 14, fontWeight: "bold"}}>Trenutna
                                lozinka:
                                *</InputLabel>
                            <TextField
                                margin="normal"
                                required
                                id="name"
                                type="password"
                                inputProps={{
                                    style: {
                                        height: "12px",
                                    }
                                }}
                                onChange={(e) => setPasswordInfo({...passwordInfo, currentPassword: e.target.value})}
                            />
                        </div>
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            flexDirection: "row",
                            gap: "3%",
                            marginBottom: "2%",
                            width: "100%"
                        }}>
                            <div style={{display: "flex", flexDirection: "column", width: "44%", paddingTop: "2%"}}>
                                <InputLabel style={{color: "rgba(133,133,133,0.84)", fontSize: 14, fontWeight: "bold"}}>Nova
                                    lozinka:
                                    *</InputLabel>
                                <TextField
                                    margin="normal"
                                    required
                                    id="name"
                                    type="password"
                                    inputProps={{
                                        style: {
                                            height: "12px",
                                        }
                                    }}
                                    onChange={(e) => setPasswordInfo({...passwordInfo, newPassword: e.target.value})}
                                />
                            </div>
                            <div style={{display: "flex", flexDirection: "column", width: "44%", paddingTop: "2%"}}>
                                <InputLabel style={{color: "rgba(133,133,133,0.84)", fontSize: 14, fontWeight: "bold"}}>Potvrdi
                                    novu lozinku:
                                    *</InputLabel>
                                <TextField
                                    margin="normal"
                                    required
                                    id="name"
                                    type="password"
                                    inputProps={{
                                        style: {
                                            height: "12px",
                                        }
                                    }}
                                    onChange={(e) => setPasswordInfo({
                                        ...passwordInfo,
                                        confirmationPassword: e.target.value
                                    })}
                                />
                            </div>
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleSaveButton}>
                        Sačuvaj izmjene
                    </Button>
                </DialogActions>
            </BootstrapDialog>
        </div>
    );
}