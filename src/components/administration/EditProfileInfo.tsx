import * as React from 'react';
import { useEffect, useState } from 'react';
import { Box, Button, Divider, Snackbar, TextField } from "@mui/material";
import avatar from "../../assets/avatar.png";
import { getIdFromToken } from "../../token/token";
import { UpdateUserType } from "../../api/users/userType";
import { findUserById, updateUser } from "../../api/users/users";
import { useNavigate } from "react-router-dom";
import { paths } from "../../constants/urlConstants";
import { isValidEmail } from "../../token/password";
import { useSnackbarHelper } from "../../util/toastUtil";

function EditProfileInfo() {
    const [user, setUser] = useState<UpdateUserType>({
        username: '',
        firstName: '',
        lastName: '',
        email: ''
    });

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
                setUser(oldUser => ({
                    ...oldUser,
                    ...response.data
                }));
            } catch (error: any) {
                handleClickVariant('error', {vertical: "top", horizontal: "right"}, "Došlo je do greške!");
            }
        };
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
                if (user?.firstName && user?.lastName && user?.username) {
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
                    } catch (exception) {
                        handleClickVariant('error', {vertical: "top", horizontal: "right"}, "Došlo je do greške!")();
                    }
                } else {
                    handleClickVariant('error', {
                        vertical: "top",
                        horizontal: "right"
                    }, "Popuni sva polja!")();
                }
            }
        } else {
            handleClickVariant('error', {vertical: "top", horizontal: "right"}, "Unesite ispravan e-mail!")();
        }
    }


    return (
        <div>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={2000}
                anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                onClose={handleCloseSnackbar}
            />
            <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", paddingTop: 5}}>
                <Box sx={{
                    backgroundColor: "white",
                    border: "1px solid lightgray",
                    height: "auto",
                    width: "95%",
                    minHeight: "72vh",
                    boxShadow: "5px 5px 20px 3px rgba(0,0,0,.08)",
                    paddingBottom: "20px",
                    boxSizing: "border-box"
                }}>
                    <div style={{maxHeight: "45px", display: "flex", flexDirection: "column", marginBottom: "1.5%"}}>
                        <p style={{
                            fontSize: 15,
                            paddingTop: "2px",
                            color: "#3696ab",
                            fontWeight: "bold",
                            marginLeft: "1%",
                            fontFamily: "openSans"
                        }}>Uredi profil</p>
                        <Divider style={{
                            backgroundColor: "rgba(84,90,109,0.13)",
                            width: "100%",
                            height: "0.1vh",
                        }}/>
                    </div>
                    <div style={{display: "flex", flexDirection: "row"}}>
                        <img src={avatar} alt="Profile Avatar"
                             style={{
                                 maxHeight: "30%",
                                 height: "25%",
                                 width: "11%",
                                 marginLeft: "4%",
                                 marginTop: "1.5%"
                             }}/>
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            marginLeft: "7%",
                            width: "70%",
                            maxWidth: "70%",
                            marginTop: "1%"
                        }}>
                            <TextField
                                label="Ime"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                required
                                value={user.firstName}
                                onChange={(e) => setUser({...user, firstName: e.target.value})}
                            />
                            <Box sx={{display: "flex", gap: 2, alignItems: "center"}}>
                                <TextField
                                    label="Prezime"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    required
                                    value={user.lastName}
                                    onChange={(e) => setUser({...user, lastName: e.target.value})}
                                />
                                <TextField
                                    label="Korisničko ime"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    required
                                    value={user.username}
                                    onChange={(e) => setUser({...user, username: e.target.value})}
                                />
                            </Box>
                            <TextField
                                label="E-mail"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                required
                                value={user.email}
                                onChange={(e) => setUser({...user, email: e.target.value})}
                            />
                            <Box sx={{display: "flex", justifyContent: "flex-end", gap: 2, marginTop: 5}}>
                                <Button onClick={() => updateButtonClicked()} style={{
                                    backgroundColor: "rgba(40,144,183,0.78)",
                                    color: "white",
                                }}>
                                    Sačuvaj
                                </Button>
                                <Button style={{
                                    backgroundColor: "rgba(110,106,106,0.62)",
                                    color: "white"
                                }} onClick={() => navigate(paths.HOME)}>
                                    Poništi
                                </Button>
                            </Box>
                        </div>
                    </div>
                </Box>
            </Box>
        </div>
    );
}

export default EditProfileInfo;
