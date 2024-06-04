import * as React from "react";
import {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {savePassword} from "../../api/users/users";
import "./password.css";
import man from "../../assets/image-removebg-preview (11).png";

import {SavePasswordType} from "../../api/users/userType";
import {Button, Snackbar, TextField, Typography} from "@mui/material";
import {paths} from "../../constants/urlConstants";
import {useSnackbarHelper} from "../../util/toastUtil";


export function PasswordReset() {
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordInfo, setPasswordInfo] = useState<SavePasswordType>({
        password: '',
        token: ''
    });
    const location = useLocation();
    const handleClickVariant = useSnackbarHelper();
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const navigate = useNavigate();

    const handleCloseSnackbar = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackbar(false);
    };

    function validatePassword(password: any) {
        const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

        return regex.test(password);
    }


    const getTokenFromUrl = () => {
        const queryParams = new URLSearchParams(location.search);
        return queryParams.get('token');
    };

    useEffect(() => {
        const token1 = getTokenFromUrl();
        setPasswordInfo({...passwordInfo, token: token1});

    }, [])

    const resetPassword = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        if (confirmPassword === passwordInfo.password) {
            if (validatePassword(passwordInfo.password)) {
                try {
                    await savePassword(passwordInfo);
                    navigate(paths.APPROVED);
                }
                catch (e){
                    handleClickVariant('error', {vertical: "top", horizontal: "right"}, "Link više nije validan!")();
                }
            } else {
                handleClickVariant('error', {
                    vertical: "top",
                    horizontal: "right"
                }, "Nova lozinka ne ispunjava pravila!")();
            }
        } else {
            handleClickVariant('error', {vertical: "top", horizontal: "right"}, "Lozinke nisu iste!")();
        }
    };

    return (
        <div className="background" style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            position: 'relative',
        }}>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={2000}
                anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                onClose={handleCloseSnackbar}
            />
            <div style={{
                width: "26%",
                minWidth: "360px",
                minHeight: "465px",
                marginBottom: "2.5%",
                backgroundColor: "#f5f4f4",
                boxShadow: "5px 5px 20px 3px rgba(0,0,0,.08)",
                borderRadius: 15,
                position: 'relative',
            }}
            >
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: "column",
                    marginTop: "11%",
                    marginLeft: "13%",
                    marginRight: "13%"
                }}>
                    <Typography style={{fontSize: 18, fontWeight: "bold"}}>Resetuj lozinku</Typography>
                    <Typography style={{marginTop: "8%", fontSize: 14, marginBottom: "5%"}}>Lozinka mora sadržati
                        najmanje 8 znakova, barem 1 broj, barem jedan specijalni karakter i barem jedno veliko slovo!</Typography>
                    <form>
                        <TextField
                            label="Nova lozinka"
                            type="password"
                            value={passwordInfo.password}
                            onChange={(e) => setPasswordInfo({...passwordInfo, password: e.target.value})}
                            variant="outlined"
                            fullWidth
                            style={{margin: '10px 0'}}
                        />
                        <TextField
                            label="Potvrdite novu lozinku"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            variant="outlined"
                            fullWidth
                            style={{margin: '10px 0'}}
                        />
                        <div style={{display: 'flex', justifyContent: 'center', width: '100%'}}>
                            <Button variant="contained" style={{
                                margin: '25px 0',
                                borderRadius: 12,
                                backgroundColor: "rgba(28,130,196,0.79)",
                                textTransform: "none",
                                fontSize: 14
                            }}
                                    onClick={resetPassword}>
                                Sačuvaj lozinku
                            </Button>
                        </div>
                    </form>
                    <img src={man} style={{
                        width: "auto",
                        height: "auto",
                        position: 'absolute',
                        zIndex: 1,
                        left: "81%",
                        top: "18%",
                    }} alt="Man" draggable="false"></img>
                </div>
            </div>
        </div>
    );


}

