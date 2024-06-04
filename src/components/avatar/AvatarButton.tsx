import React, {useEffect, useState} from 'react';
import Box from "@mui/material/Box";
import {ListItemIcon, Menu, Stack} from "@mui/material";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import {useNavigate} from "react-router-dom";
import {AccountCircle, Logout, Settings} from "@mui/icons-material";
import {logoutHandler} from "../../service/security.service";
import {useAuth} from "../../login/AuthProvider";
import {paths} from "../../constants/urlConstants";
import KeyIcon from '@mui/icons-material/Key';
import {ChangePasswordDialog} from "../administration/ChangePasswordDialog";
import {getIdFromToken} from "../../token/token";
import {findUserById} from "../../api/users/users";


const paperProps = {
    elevation: 0,
    sx: {
        overflow: 'visible',
        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
    },
}

type UserInfo = {
    firstName: string,
    lastName: string
}

export function AvatarButton() {
    const navigate = useNavigate();
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    const {toggleAdmin} = useAuth();
    const [changePasswordDialog, setOpenChangePasswordDialog] = useState(false);
    const [user, setUser] = useState<UserInfo>();

    useEffect(() => {
      const getUserInfo = async () => {
        try {
          const userId = getIdFromToken();
          const response = await findUserById(userId);
          setUser({ firstName: response.data.firstName, lastName: response.data.lastName});
        } catch (error: any) {
          // showErrorToast(`${i18next.t('errorMessages.find_user_by_id')}`);
        }
      }
      getUserInfo();
    }, [setUser]);

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleOnMenuItemClick = (path: string) => {
        handleCloseUserMenu();
        navigate(path);
    }

    return (
        <Box sx={{flexGrow: 0, marginLeft: "auto", marginRight: "0"}}>
            <Stack direction="row" alignItems={"center"}>
                <Tooltip title="Podesavanja">
                    <IconButton onClick={handleOpenUserMenu}>
                        <Avatar style={{backgroundColor: "#adc3c7"}}>{user?.firstName.charAt(0)}{user?.lastName.charAt(0)}</Avatar>
                    </IconButton>
                </Tooltip>
            </Stack>
            <Menu
                id="menu-appbar"
                anchorEl={anchorElUser}
                sx={{mt: '45px'}}
                keepMounted
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
                PaperProps={paperProps}
                anchorOrigin={{vertical: 'top', horizontal: 'right',}}
                transformOrigin={{vertical: 'top', horizontal: 'right',}}
            >
                <MenuItem key={"Profile"} onClick={() => handleOnMenuItemClick(paths.EDIT_PROFILE)}>
                    <ListItemIcon>
                        <AccountCircle fontSize="small"/>
                    </ListItemIcon>
                    <Typography textAlign="center">Profil</Typography>
                </MenuItem>
                <MenuItem key={"Settings"} onClick={() => handleOnMenuItemClick(paths.SETTINGS)}>
                    <ListItemIcon>
                        <Settings fontSize="small"/>
                    </ListItemIcon>
                    <Typography textAlign="center">Administracija</Typography>
                </MenuItem>
                <MenuItem key={"Change Password"} onClick={() => {
                    setOpenChangePasswordDialog(true);
                    handleCloseUserMenu();
                }}>
                    <ListItemIcon>
                        <KeyIcon fontSize="small"/>
                    </ListItemIcon>
                    <Typography textAlign="center">Izmjena lozinke</Typography>
                </MenuItem>
                <Divider/>
                <MenuItem key={"Logout"} onClick={() => logoutHandler(navigate, toggleAdmin)}>
                    <ListItemIcon>
                        <Logout fontSize="small"/>
                    </ListItemIcon>
                    <Typography textAlign="center">Odjavi se</Typography>
                </MenuItem>
            </Menu>
            <ChangePasswordDialog changePasswordDialog={changePasswordDialog}
                                  setOpenChangePasswordDialog={setOpenChangePasswordDialog}
            />
        </Box>
    );
}
