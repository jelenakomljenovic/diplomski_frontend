import * as React from 'react';
import {useEffect, useState} from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import logo from '../src/assets/logo3.png';
import blueLogo from '../src/assets/logo33.png';
import textLogo from '../src/assets/textLogo.png';
import blueTextLogo from '../src/assets/recolor_textLogo.png';
import {IoIosArrowDown} from "react-icons/io";
import {Box, CssBaseline, ListItemButton, ListItemText, MenuList, Slide, Theme, useScrollTrigger} from "@mui/material";
import LockIcon from '@mui/icons-material/Lock';
import {makeStyles} from "@mui/styles";
import {paths} from "./constants/urlConstants";
import {useNavigate} from "react-router-dom";
import {LoginDialog} from "./login/LoginDialog";
import {AvatarButton} from "./components/avatar/AvatarButton";
import {hasRole} from "./token/token";
import {Roles} from "./constants/constants";
import {useAuth} from "./login/AuthProvider";

const useStyles = makeStyles((theme: Theme) => ({
    nested: {
        paddingLeft: theme.spacing(2),
    },
    nestedSecondLevel: {
        paddingLeft: theme.spacing(5)
    }
}));

const paperProps = {
    elevation: 0,
    sx: {
        overflow: 'visible',
        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
    },
}

export function TopBar() {
    const trigger = useScrollTrigger();
    const classes = useStyles();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [addPopup, setAddPopup] = useState(false);
    const [open, setOpen] = useState(false);
    const { isAdmin } = useAuth();


    const onLockIconClick = async () => {
        setAddPopup(true);
    }

    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };


    return (
        <Box sx={{display: 'flex'}}>
            <CssBaseline/>
            <Slide appear={false} direction="down" in={!trigger}>
                <AppBar component="nav"
                        sx={{zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: "#204066", maxHeight: 68, height: 68}}>
                    <LoginDialog openPopup={addPopup}
                                 setOpenPopup={setAddPopup}

                    />
                    <Toolbar>
                        <div style={{marginLeft: "2.3%", display: "flex", alignItems: "centar", width: "100%"}}>
                            <img src={logo} alt="logo" style={{width: "auto", height: "auto"}}/>
                            <img src={textLogo} alt="textLogo"
                                 style={{width: "140px", height: "40px", margin: "auto", marginLeft: -7, marginTop: "0.3%"}}/>
                            {isAdmin &&
                                <AvatarButton/>
                            }
                            {!isAdmin &&
                                <LockIcon
                                    style={{height: 25, width: 25, color: "#fff", marginTop: "16px", marginRight: "38px"
                                }}
                                    onClick={onLockIconClick}/>
                            }
                        </div>
                    </Toolbar>
                </AppBar>
            </Slide>
            <Slide appear={false} direction="down" in={!trigger}>
                <AppBar sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    backgroundColor: "#fff",
                    height: 55,
                    marginTop: 8,
                    boxShadow: "0 0 20px 3px rgba(0,0,0,.05)"
                }} elevation={0}>
                    <Toolbar>
                        <MenuList style={{marginBottom: "0.6%", marginLeft: "2%", display: "flex"}}>
                            <ListItemButton className={classes.nested}
                                            style={{paddingLeft: 24, backgroundColor: "transparent"}}
                                            onClick={() => navigate(paths.HOME)}>
                                <ListItemText disableTypography sx={{
                                    color: "rgba(32,64,102,0.79)",
                                    fontWeight: "bold",
                                    fontSize: 14,
                                    fontFamily: "roboto"
                                }}>Početna
                                    stranica</ListItemText>
                            </ListItemButton>
                            <ListItemButton className={classes.nested}
                                            aria-owns={anchorEl ? "simple-menu" : undefined}
                                            style={{paddingLeft: 24, backgroundColor: "transparent"}}
                                            onClick={() => navigate(paths.FACULTIES)}
                                            aria-haspopup="true">
                                <ListItemText disableTypography style={{
                                    color: "rgba(32,64,102,0.79)",
                                    fontWeight: "bold",
                                    fontSize: 14,
                                    fontFamily: "roboto"
                                }} onClick={() => handleClick}>Fakulteti</ListItemText>
                                <IoIosArrowDown style={{
                                    color: "rgba(32,64,102,0.79)",
                                    width: "15px",
                                    height: "15px",
                                    marginLeft: 6,
                                    marginTop: 1.2
                                }}/>
                            </ListItemButton>
                            <ListItemButton className={classes.nested}
                                            aria-owns={anchorEl ? "simple-menu" : undefined}
                                            style={{paddingLeft: 24, backgroundColor: "transparent"}}
                                            onClick={() => navigate(paths.LOCATIONS)}
                                            aria-haspopup="true">
                                <ListItemText disableTypography style={{
                                    color: "rgba(32,64,102,0.79)",
                                    fontWeight: "bold",
                                    fontSize: 14,
                                    fontFamily: "roboto"
                                }} onClick={() => handleClick}>Fakulteti u blizini</ListItemText>
                            </ListItemButton>
                        </MenuList>
                    </Toolbar>
                </AppBar>
            </Slide>
            <Slide appear={true} direction="down" in={trigger}>
                <AppBar sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    backgroundColor: "#204066",
                    height: 65
                }}>
                    <Toolbar>
                        <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: "2.2%", width: "100%"}}>
                            <img src={logo} alt="logo" style={{width: "auto", height: "auto"}}/>
                            <MenuList sx={{
                                marginBottom: "0.6%",
                                paddingTop: "21px",
                                marginLeft: "2%",
                                display: "flex",
                                flexDirection: "row",
                                alignItems: 'center',
                            }}>
                                <ListItemButton className={classes.nested}
                                                style={{paddingLeft: 24, width: "160px", flexWrap: 'nowrap'}}
                                                onClick={() => navigate(paths.HOME)}>
                                    <ListItemText disableTypography sx={{
                                        color: "white",
                                        fontWeight: "bold",
                                        fontSize: 13
                                    }}>Početna
                                        stranica</ListItemText>
                                </ListItemButton>
                                <ListItemButton className={classes.nested}
                                                aria-owns={anchorEl ? "simple-menu" : undefined}
                                                style={{paddingLeft: 25}}
                                                onClick={() => navigate(paths.FACULTIES)}
                                                aria-haspopup="true">
                                    <ListItemText disableTypography style={{
                                        color: "white",
                                        fontWeight: "bold",
                                        fontSize: 13,
                                    }} onClick={() => handleClick}>Fakulteti</ListItemText>
                                    <IoIosArrowDown style={{
                                        color: "white",
                                        width: "15px",
                                        height: "15px",
                                        marginLeft: 6,
                                        marginTop: 1.2
                                    }}/>
                                </ListItemButton>
                                <ListItemButton className={classes.nested}
                                                aria-owns={anchorEl ? "simple-menu" : undefined}
                                                style={{paddingLeft: 24, width: "160px"}}
                                                onClick={() => navigate(paths.LOCATIONS)}
                                                aria-haspopup="true">
                                    <ListItemText disableTypography style={{
                                        color: "white",
                                        fontWeight: "bold",
                                        fontSize: 13,
                                    }} onClick={() => handleClick}>Fakulteti u blizini</ListItemText>
                                </ListItemButton>
                            </MenuList>
                            <LockIcon
                                style={{ marginLeft: 'auto', marginRight: "40px", height: 25, width: 25, color: "#fff" }}
                                onClick={onLockIconClick}/>
                        </Box>
                    </Toolbar>
                </AppBar>
            </Slide>
            <Box component="main" sx={{marginTop: 6}}>
                <Toolbar/>
                <div>
                </div>
            </Box>
        </Box>
    );
}

export default TopBar;