import * as React from 'react';
import {useEffect, useState} from 'react';
import {Button, Divider, InputLabel, Snackbar, TextField} from "@mui/material";
import university from "../../assets/university.png";
import {getIdFromToken} from "../../token/token";
import {UpdateUserType} from "../../api/users/userType";
import {findUserById, updateUser} from "../../api/users/users";
import {useNavigate} from "react-router-dom";
import {paths} from "../../constants/urlConstants";
import {generatePassword, isValidEmail} from "../../token/password";
import {useSnackbarHelper} from "../../util/toastUtil";

function EditProfileInfo() {
    const [user, setUser] = useState<UpdateUserType>();
    const navigate = useNavigate();
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const handleClickVariant = useSnackbarHelper();
    const userId = getIdFromToken();

    const handleCloseSnackbar = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackbar(false);
    };

    useEffect(() => {
        const getUserInfo = async () => {
            try {
                const userId = getIdFromToken();
                const response = await findUserById(userId);
                setUser(response.data);
            } catch (error: any) {
                // showErrorToast(`${i18next.t('errorMessages.find_user_by_id')}`);
                // setResponseError(`${i18next.t('errorMessages.find_user_by_id')}`)
            }
        }
        getUserInfo();
    }, [setUser]);


    const updateButtonClicked = async () => {
        if (isValidEmail(user?.email)) {
            if (user?.username && user.username.length < 5) {
                handleClickVariant('error', {
                    vertical: "top",
                    horizontal: "right"
                }, "Korisničko ime mora sadržati minimalno 5 karaktera!")();
            } else {
                if (user?.firstName  && user?.lastName && user?.username) {
                    try {
                        await updateUser({
                            username: user?.username,
                            firstName: user?.firstName,
                            lastName: user?.lastName,
                            email: user?.email,

                        }, userId);
                        handleClickVariant('success', {
                            vertical: "top",
                            horizontal: "right"
                        }, "Informacije su ažurirane!")();
                    } catch
                        (exception) {
                        handleClickVariant('error', {vertical: "top", horizontal: "right"}, "Došlo je do greške!")();
                    }
                } else {
                    handleClickVariant('error', {
                        vertical: "top",
                        horizontal: "right"
                    }, "Molimo ispunite sva polja!")();
                }
            }

        } else {
            handleClickVariant('error', {vertical: "top", horizontal: "right"}, "Unesite ispravan e-mail!")();
        }
    }


    // @ts-ignore
    return (
        <>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={2000}
                anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                onClose={handleCloseSnackbar}
            />
            <div style={{
                backgroundColor: "white",
                height: "72vh",
                width: "91%",
                boxShadow: "5px 5px 20px 3px rgba(0,0,0,.08)",
                marginLeft: "4.4%",
                marginTop: "3%",
            }}>
                <div style={{top: "1%"}}>
                    <p style={{
                        fontSize: 15,
                        color: "#3696ab",
                        fontWeight: "bold",
                        marginLeft: "1%",
                        fontFamily: "openSans"
                    }}>Uredi profil</p>
                </div>
                <Divider style={{
                    backgroundColor: "rgba(84,90,109,0.13)",
                    width: "100%",
                    height: "0.1vh"
                }}/>
                <div style={{display: "flex", flexDirection: "row"}}>
                    <img src={university} alt=""
                         style={{maxHeight: "20%", height: "15%", width: "10%", marginLeft: "4%", marginTop: "1%"}}/>
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        marginTop: "1.5%",
                        marginLeft: "9%",
                        width: "100%"
                    }}>
                        <div style={{display: "flex", flexDirection: "column", width: "74%"}}>
                            <InputLabel style={{color: "#858585", fontSize: 14, fontWeight: "bold"}}>Ime:
                                *</InputLabel>
                            <TextField
                                margin="normal"
                                required
                                value={user?.firstName}
                                id="name"
                                type="name"
                                inputProps={{
                                    style: {
                                        height: "12px",
                                    }
                                }}
                                //@ts-ignore
                                onChange={(e) => setUser({...user, firstName: e.target.value})}
                            />
                        </div>
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            flexDirection: "row",
                            gap: "3%",
                            marginTop: "1%",
                            width: "74%"
                        }}>
                            <div style={{display: "flex", flexDirection: "column", width: "48%"}}>
                                <InputLabel style={{color: "#858585", fontSize: 14, fontWeight: "bold"}}>Prezime:
                                    *</InputLabel>
                                <TextField
                                    margin="normal"
                                    required
                                    value={user?.lastName}
                                    id="address"
                                    type="address"
                                    inputProps={{
                                        style: {
                                            height: "12px",
                                            width: "400px"
                                        }
                                    }}
                                    //@ts-ignore
                                    onChange={(e) => setUser({...user, lastName: e.target.value})}
                                />
                            </div>
                            <div style={{display: "flex", flexDirection: "column", width: "49%"}}>
                                <InputLabel style={{color: "#858585", fontSize: 14, fontWeight: "bold"}}>Korisničko ime:
                                    *</InputLabel>
                                <TextField
                                    margin="normal"
                                    required
                                    value={user?.username}
                                    id="city"
                                    type="city"
                                    inputProps={{
                                        style: {
                                            height: "12px",
                                            width: "400px"
                                        }
                                    }}
                                    //@ts-ignore
                                    onChange={(e) => setUser({...user, username: e.target.value})}
                                />
                            </div>
                        </div>
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            flexDirection: "row",
                            gap: "3%",
                            marginTop: "1%",
                            width: "74%"
                        }}>
                            <div style={{display: "flex", flexDirection: "column", width: "100%"}}>
                                <InputLabel style={{color: "#858585", fontSize: 14, fontWeight: "bold"}}>E-mail:
                                    *</InputLabel>
                                <TextField
                                    margin="normal"
                                    required
                                    value={user?.email}
                                    id="country"
                                    type="country"
                                    inputProps={{
                                        style: {
                                            height: "12px",
                                            width: "400px"
                                        }
                                    }}
                                    //@ts-ignore
                                    onChange={(e) => setUser({...user, email: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{display: "flex", flexDirection: "row", gap: "3%", marginLeft: "86%", marginTop: "2%"}}>
                    <Button onClick={() => navigate(paths.HOME)}>Poništi</Button>
                    <Button onClick={updateButtonClicked}>Sačuvaj</Button>
                </div>
            </div>
        </>
    )
}

export default EditProfileInfo;