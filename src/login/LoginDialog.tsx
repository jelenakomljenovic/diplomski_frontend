import React, {Dispatch, SetStateAction, useState} from 'react';
import {Dialog, DialogTitle, Fab, IconButton, Snackbar, TextField} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import loginIcon from "../assets/ima.png";
import {LoginValidationSchema, ResetPasswordSchema} from "./LoginValidationSchema";
import {paths} from "../constants/urlConstants";
import {useFormik} from "formik";
import {useNavigate} from "react-router-dom";
import {loginRequest} from "../service/security.service";
import "../index.css";
import {useAuth} from "./AuthProvider";
import loginImg from "../assets/loginBg4_colored.jpg";
import {resetPassword} from "../api/users/users";
import {useSnackbarHelper} from "../util/toastUtil";

type CreateDialogProps = {
    openPopup: boolean;
    setOpenPopup: Dispatch<SetStateAction<boolean>>;
};

export type LoginData = {
    username: string;
    password: string;
}

export function LoginDialog({
                                openPopup,
                                setOpenPopup,
                            }: CreateDialogProps) {
    const navigate = useNavigate();
    const {toggleAdmin} = useAuth();
    const [forgotPassword, setForgotPassword] = useState(false);
    const handleClickVariant = useSnackbarHelper();
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handleCloseSnackbar = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackbar(false);
    };

    const formik = useFormik({
        initialValues: {
            username: '',
            email: '',
            password: ''
        },
        validationSchema: LoginValidationSchema,
        onSubmit: async values => {
            try {
                await loginRequest({
                    username: values.username,
                    password: values.password
                });
                setOpenPopup(false);
                formik.resetForm();
                localStorage.setItem('isAdmin', 'true');
                toggleAdmin(true);
                navigate(paths.HOME);
            } catch (error) {
                handleClickVariant('error', {vertical: "top", horizontal: "right"}, "Podaci nisu ispravni!")();
            }
        },
    });

    const formikSend = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema: ResetPasswordSchema,
        onSubmit: async values => {
            if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
                handleClickVariant('error', {
                    vertical: "top",
                    horizontal: "right"
                }, "Unesena e-mail adresa nije ispravna!")();
            } else {
                try {
                    await resetPassword({
                        email: values.email
                    });
                    setOpenPopup(false);
                    formikSend.resetForm();
                    handleClickVariant('success', {
                        vertical: "top",
                        horizontal: "right"
                    }, "Link je poslan. Provjerite svoj e-mail!")();
                } catch (error) {
                    handleClickVariant('error', {
                        vertical: "top",
                        horizontal: "right"
                    }, "Unijeli ste pogrešan email!")();
                }
            }
        },
    });

    const handleDialogClose = () => {
        setOpenPopup(false);
        setForgotPassword(false);
        formik.resetForm();
    }

    const handleBackToLogin = () => {
        setForgotPassword(false);
    }

    return (
        <div>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={2000}
                anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                onClose={handleCloseSnackbar}
            />
            <Dialog open={openPopup} onClose={handleDialogClose} PaperProps={{
                sx: {
                    width: '90%',
                    maxWidth: '800px',
                    height: "auto",
                    maxHeight: '90vh',
                    backgroundImage: `url(${loginImg})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    borderRadius: 2,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                    '@media (min-width:1500px)': {
                        height: '60%',
                    },
                    '@media (max-width:1500px)': {
                        height: "auto",
                        minHeight: '73%',
                    },
                }
            }}>
                {forgotPassword && (
                    <IconButton onClick={handleBackToLogin}
                                style={{position: 'absolute', top: '10px', left: '10px', color: 'white'}}>
                        <ArrowBackIcon/>
                    </IconButton>
                )}
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    justifyContent: 'center',
                    width: "100%",
                    padding: "20px"
                }}>
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: 'center',
                        marginRight: "11%"
                    }}>
                        <img src={loginIcon} alt={"loginIcon"} style={{width: "40%", height: "40%"}}/>
                        <DialogTitle sx={{fontWeight: "normal"}}>{forgotPassword ? "Zaboravljena lozinka?" : "Login"}</DialogTitle>
                        <form style={{
                            width: "100%",
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }} onSubmit={forgotPassword ? formikSend.handleSubmit : formik.handleSubmit}>
                            {forgotPassword ? (
                                <>
                                    <TextField
                                        margin="normal"
                                        required
                                        id="email"
                                        label="Unesite e-mail: "
                                        autoComplete="current-email"
                                        inputProps={{
                                            style: {
                                                height: "24px",
                                                width: "250px",
                                            }
                                        }}
                                        {...formikSend.getFieldProps('email')}
                                    />
                                    <div className="fab-container">
                                        <Fab
                                            variant="extended"
                                            type="submit"
                                            sx={{
                                                mt: 2,
                                                px: 4,
                                                fontWeight: "bold",
                                                background: 'rgba(0,176,116,0.73)',
                                                color: 'white',
                                                "&:hover": {
                                                    background: 'rgba(0,176,116,0.66)',
                                                },
                                                minWidth: "58%",
                                                maxHeight: "40px"
                                            }}
                                        >Pošalji
                                        </Fab>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <TextField
                                        margin="normal"
                                        required
                                        id="username"
                                        label="Unesite korisničko ime: "
                                        autoComplete="current-username"
                                        inputProps={{
                                            style: {
                                                height: "24px",
                                                width: "250px"
                                            }
                                        }}
                                        {...formik.getFieldProps('username')}
                                    />
                                    <TextField
                                        margin="normal"
                                        required
                                        id="password"
                                        type="password"
                                        label="Unesite lozinku: "
                                        autoComplete="current-password"
                                        inputProps={{
                                            style: {
                                                height: "24px",
                                                width: "250px",
                                                marginBottom: "1%"
                                            }
                                        }}
                                        {...formik.getFieldProps('password')}
                                    />
                                    <p className={"forgot-p"} onClick={() => setForgotPassword(true)}
                                       style={{alignSelf: 'flex-end', marginLeft: 0}}>
                                        {"Zaboravili ste lozinku?"}
                                    </p>
                                    <div className="fab-container">
                                        <Fab
                                            variant="extended"
                                            type="submit"
                                            sx={{
                                                mt: 2,
                                                px: 4,
                                                fontWeight: "bold",
                                                background: 'rgba(0,176,116,0.73)',
                                                color: 'white',
                                                "&:hover": {
                                                    background: 'rgba(0,176,116,0.66)',
                                                },
                                                minWidth: "58%",
                                                maxHeight: "40px"
                                            }}
                                        >Prijavi se
                                        </Fab>
                                    </div>
                                </>
                            )}
                        </form>
                    </div>
                </div>
            </Dialog>
        </div>
    );
}
