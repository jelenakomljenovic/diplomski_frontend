import React, {useEffect, useState} from 'react';
import "./administration.css";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {UserType} from "../../api/users/userType";
import {deleteUser, getAllUsers} from "../../api/users/users";
import {removeAdminStyle} from "../../styles/administrationStyles";
import {IoRemoveCircleOutline} from "react-icons/io5";
import IconButton from "@mui/material/IconButton";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import {Box, Snackbar, TextField} from "@mui/material";
import {getIdFromToken} from "../../token/token";
import AlertDialog from "../dialogs/AlertDialog";
import {useNavigate} from "react-router-dom";
import {paths} from "../../constants/urlConstants";
import {useSnackbarHelper} from "../../util/toastUtil";


export function RemoveAdminRole() {

    const [textFilter, setTextFilter] = useState("");
    const [allUsers, setAllUsers] = useState<UserType[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<UserType[]>([]);
    const [idForDelete, setIdForDelete] = useState(-1);
    const [adminName, setAdminName] = useState("");
    const navigate = useNavigate();
    const handleClickVariant = useSnackbarHelper();

    const [open, setOpen] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handleCloseSnackbar = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackbar(false);
    };


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const deleteAdmin = async (id: number) => {
        try {
            await deleteUser(id);
            const getUsersList = async () => {
                const res = await getAllUsers();
                const resUsers: UserType[] = res.data;
                const removeCurrentUser = resUsers.filter(user => {
                    const id = getIdFromToken();
                    return id !== user.id;
                })
                setAllUsers(removeCurrentUser);
                setFilteredUsers(removeCurrentUser);
            }
            getUsersList();
            handleClose();
            handleClickVariant('success', {vertical: "top", horizontal: "right"}, "Korisnik je uspješno uklonjen!")();
        } catch
            (exception) {
            handleClickVariant('error', {vertical: "top", horizontal: "right"}, "Došlo je do greške!")();
        }
    }


    useEffect(() => {
        const getUsersList = async () => {
            const res = await getAllUsers();
            const resUsers: UserType[] = res.data;
            const removeCurrentUser = resUsers.filter(user => {
                const id = getIdFromToken();
                return id !== user.id;
            })
            setAllUsers(removeCurrentUser);
            setFilteredUsers(removeCurrentUser);
        }
        getUsersList();
    }, [])

    function getFilteredUsers(): UserType[] {
        if (textFilter.trim().length === 0)
            return allUsers;
        return allUsers.filter(user => (user.username.toUpperCase().startsWith(textFilter.toUpperCase().trim())) || (user.firstName.toUpperCase().startsWith(textFilter.toUpperCase().trim()))
            || (user.lastName.toUpperCase().startsWith(textFilter.toUpperCase().trim())) || (user.email.toUpperCase().startsWith(textFilter.toUpperCase().trim())));
    }

    useEffect(() => {
        setFilteredUsers(getFilteredUsers())
    }, [textFilter, allUsers]);


    const columns: GridColDef[] = [
        {
            field: 'username',
            headerName: `Korisničko ime`,
            headerAlign: "center",
            align: "center",
            flex: 1,
            disableColumnMenu: true
        },
        {
            field: 'firstName',
            headerName: `Ime`,
            headerAlign: "center",
            align: "center",
            flex: 1,
            disableColumnMenu: true
        },
        {
            field: 'lastName',
            headerName: `Prezime`,
            headerAlign: "center",
            align: "center",
            flex: 1,
            disableColumnMenu: true
        },
        {
            field: 'email',
            headerName: `E-mail`,
            headerAlign: "center",
            align: "center",
            flex: 1,
            disableColumnMenu: true
        },
        {
            field: 'actions',
            headerName: `Akcije`,
            flex: 0,
            headerClassName: 'lastcolumnSeparator',
            headerAlign: "center",
            renderCell: (params) => {
                return (
                    <div style={{display: "flex", justifyContent: "center", width: "100%"}}>
                        <IconButton
                            aria-label="more"
                            id="long-button"
                            aria-haspopup="true"
                            onClick={(event) => {
                                setAdminName(params.row.username);
                                setIdForDelete(params.row.id);
                                handleClickOpen();
                            }}
                        >
                            <IoRemoveCircleOutline style={{color: "darkred"}}/>
                        </IconButton>
                    </div>
                )
            }
        },
    ]

    return (
        <div>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={2000}
                anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                onClose={handleCloseSnackbar}
            />
            <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", paddingTop: 3}}>
                <Box sx={{
                    height: "auto",
                    width: "94.3%",
                    minHeight: "72vh",
                    paddingBottom: "20px",
                    boxSizing: "border-box"
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                        marginBottom: '27px'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '17px',
                            color: 'rgba(55,79,121,0.88)',
                            fontFamily: 'openSans'
                        }}>
                            <p style={{
                                fontWeight: 'bold',
                                margin: '0',
                                marginRight: '10px'
                            }}>
                                Upravljaj adminima
                            </p>
                            <ControlPointIcon
                                style={{
                                    color: 'rgba(55,79,121,0.88)',
                                    width: '20px',
                                    height: '20px',
                                    cursor: 'pointer'
                                }}
                                onClick={() => navigate(paths.ADD_ADMIN)}
                            />
                        </div>
                        <TextField
                            id="add-user-tfu"
                            style={{
                                backgroundColor: 'white',
                                borderRadius: "10px",
                                width: '280px',
                            }}
                            InputProps={{
                                style: {
                                    borderRadius: '10px',
                                }
                            }}
                            size="small"
                            onChange={e => setTextFilter(e.target.value)}
                            label="Pretrazi"
                            variant="outlined"
                        />
                    </div>
                    <DataGrid
                        sx={removeAdminStyle}
                        rows={filteredUsers}
                        columns={columns}
                    />
                    <AlertDialog open={open} setOpen={setOpen} handleClickOpen={handleClickOpen}
                                 handleClose={handleClose}
                                 handleSave={() => deleteAdmin(idForDelete)}
                                 dialogContent={"Da li si siguran/na da želiš ukloniti korisnika " + adminName + " iz grupe administratora?"}

                                 dialogTitle={"Brisanje korisnika"}/>
                </Box>
            </Box>
        </div>
    );
}
