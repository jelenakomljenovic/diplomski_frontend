import React, {Dispatch, SetStateAction, useState} from 'react';
import {Dialog, DialogTitle, Fab, Snackbar, TextField} from "@mui/material";
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
                        handleClickVariant('error', {vertical: "top", horizontal: "right"}, "Unesena e-mail adresa nije ispravna!")();
                    }
                    else {
                    try {
                        await resetPassword({
                            email: values.email
                        });
                        setOpenPopup(false);
                        formikSend.resetForm();
                        handleClickVariant('success', {vertical: "top", horizontal: "right"}, "Link je poslan. Provjerite svoj e-mail!")();
                    } catch (error) {
                        handleClickVariant('error', {vertical: "top", horizontal: "right"}, "Unijeli ste pogrešan email!")();
                    }
                    }
                },
            }
        )
    ;

    const handleDialogClose = () => {
        setOpenPopup(false);
        setForgotPassword(false);
        formik.resetForm();
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
                    minWidth: "55%",
                    minHeight: "70%",
                    maxWidth: "58%",
                    maxHeight: "70%",
                    backgroundImage: `url(${loginImg})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    borderRadius: 2
                }
            }}>
                <div style={{display: "flex", flexDirection: "row", height: "100%"}}>
                    {!forgotPassword &&
                        <div style={{
                            display: "flex",
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: "59%",
                            height: "65vh",
                            marginLeft: "42%"
                        }}>
                            <img src={loginIcon} alt={"loginIcon"}
                                 style={{width: "32%", height: "20%"}}></img>
                            <DialogTitle>Login</DialogTitle>
                            <form style={{
                                width: "100%", display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }} onSubmit={formik.handleSubmit}>
                                <TextField
                                    margin="normal"
                                    required
                                    id="username"
                                    label="Unesite korisničko ime: "
                                    autoComplete="current-username"
                                    inputProps={{
                                        style: {
                                            height: "20px",
                                            width: "300px"
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
                                            height: "20px",
                                            width: "300px",
                                            marginBottom: "1%"
                                        }
                                    }}
                                    {...formik.getFieldProps('password')}
                                />
                                <p style={{marginLeft: -170}} className={"forgot-p"}
                                   onClick={() => setForgotPassword(true)}>{"Zaboravili ste lozinku?"}</p>
                                <div className="fab-container">
                                    <Fab disabled={false}
                                         variant="extended"
                                         style={{minWidth: "58%", marginTop: "10%", maxHeight: "40px"}}
                                         type="submit"
                                         sx={{
                                             mt: 2,
                                             px: 4,
                                             fontWeight: "bold",
                                             background: 'rgba(0,176,116,0.73)',
                                             color: 'white',
                                             "&:hover": {
                                                 background: 'rgba(0,176,116,0.66)',
                                             }
                                         }}>Prijavi se
                                    </Fab>
                                </div>
                            </form>
                        </div>
                    }
                    {forgotPassword &&
                        <div style={{
                            display: "flex",
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: "59%",
                            height: "65vh",
                            marginLeft: "42%"
                        }}>
                            <img src={loginIcon} alt={"loginIcon"}
                                 style={{width: "32%", height: "20%"}}></img>
                            <DialogTitle>Zaboravljena lozinka?</DialogTitle>
                            <form style={{
                                width: "100%", display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }} onSubmit={formikSend.handleSubmit}>
                                <TextField
                                    margin="normal"
                                    required
                                    id="email"
                                    label="Unesite e-mail: "
                                    autoComplete="current-email"
                                    inputProps={{
                                        style: {
                                            height: "20px",
                                            width: "300px",
                                        }
                                    }}
                                    {...formikSend.getFieldProps('email')}
                                />
                                <div className="fab-container">
                                    <Fab disabled={false}
                                         variant="extended"
                                         style={{minWidth: "58%", marginTop: "18%", maxHeight: "40px"}}
                                         type="submit"
                                         sx={{
                                             mt: 2,
                                             px: 4,
                                             fontWeight: "bold",
                                             background: 'rgba(0,176,116,0.73)',
                                             color: 'white',
                                             "&:hover": {
                                                 background: 'rgba(0,176,116,0.66)',
                                             }
                                         }}>Pošalji
                                    </Fab>
                                </div>
                            </form>
                        </div>
                    }
                </div>
                {/*<DialogTitle align="center">Login</DialogTitle>*/}
                {/*<DialogContent className='dialog-content' aria-label="new board dialog aria label">*/}
                {/*</DialogContent>*/}
                {/*<DialogActions>*/}
                {/*    <Button size="small" variant={"outlined"} color={"error"} onClick={handleDialogClose}*/}
                {/*            style={{minWidth: 70}}></Button>*/}
                {/*    <Button size="small" variant={"outlined"} color={"success"}*/}
                {/*            style={{minWidth: 70}}></Button>*/}
                {/*</DialogActions>*/}
            </Dialog>
        </div>
    );
}
