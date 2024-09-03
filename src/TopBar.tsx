import * as React from 'react';
import {useEffect, useState} from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import logo from '../src/assets/logo3.png';
import blueLogo from '../src/assets/logo33.png';
import textLogo from '../src/assets/tr.png';
import blueTextLogo from '../src/assets/recolor_textLogo.png';
import {IoIosArrowDown} from "react-icons/io";
import {Box, CssBaseline, ListItemButton, ListItemText, MenuList, Slide, Theme, useScrollTrigger} from "@mui/material";
import LockIcon from '@mui/icons-material/Lock';
import {makeStyles} from "@mui/styles";
import {paths} from "./constants/urlConstants";
import {useLocation, useNavigate} from "react-router-dom";
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


export function TopBar() {
    const trigger = useScrollTrigger();
    const classes = useStyles();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [addPopup, setAddPopup] = useState(false);
    const [open, setOpen] = useState(false);
    const { isAdmin } = useAuth();
    const location = useLocation();

    const hoverColor = "rgba(99,135,145,0.82)";



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
                <AppBar
                    component="nav"
                    sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: "#204066", maxHeight: 68, height: 68 }}
                >
                    <LoginDialog openPopup={addPopup} setOpenPopup={setAddPopup} />
                    <Toolbar>
                        <div style={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <img src={logo} alt="logo" style={{ width: "auto", height: "auto" }} />
                                <img src={textLogo} alt="textLogo" style={{ width: "140px", height: "22px", marginLeft: "3%", marginTop: "0.3%" }} />
                            </div>
                            <div style={{ display: "flex", alignItems: "center" }}>
                                {isAdmin ? (
                                    <AvatarButton />
                                ) : (
                                    <LockIcon
                                        style={{ height: 25, width: 25, color: "#fff", cursor: "pointer" }}
                                        onClick={onLockIconClick}
                                    />
                                )}
                            </div>
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
                        <MenuList style={{marginBottom: "0.6%", display: "flex"}}>
                            <ListItemButton className={classes.nested}
                                            style={{ backgroundColor: "transparent"}}
                                            onClick={() => navigate(paths.HOME)}>
                                <ListItemText disableTypography sx={{
                                    color: location.pathname === paths.HOME ? hoverColor : "rgba(32,64,102,0.79)",
                                    fontWeight: "bold",
                                    fontSize: 14,
                                    fontFamily: "roboto"
                                }}>Početna
                                    stranica</ListItemText>
                            </ListItemButton>
                            <ListItemButton className={classes.nested}
                                            aria-owns={anchorEl ? "simple-menu" : undefined}
                                            sx={{
                                                width: "auto",
                                                minWidth: "12%",
                                                backgroundColor: "transparent",
                                                whiteSpace: 'normal',
                                                '&:hover': {
                                                    backgroundColor: 'transparent',
                                                },
                                                '@media (max-width: 900px)': {
                                                    marginLeft: "-1%",
                                                    marginRight: "1%",
                                                }
                                            }}
                                            onClick={() => navigate(paths.FACULTIES)}
                                            aria-haspopup="true">
                                <ListItemText disableTypography style={{
                                    color: location.pathname === paths.FACULTIES ? hoverColor : "rgba(32,64,102,0.79)",
                                    fontWeight: "bold",
                                    fontSize: 14,
                                    fontFamily: "roboto"
                                }} onClick={() => handleClick}>Fakulteti</ListItemText>
                            </ListItemButton>
                            <ListItemButton className={classes.nested}
                                            aria-owns={anchorEl ? "simple-menu" : undefined}
                                            style={{paddingLeft: 18, backgroundColor: "transparent"}}
                                            onClick={() => navigate(paths.LOCATIONS)}
                                            aria-haspopup="true">
                                <ListItemText disableTypography style={{
                                    color: location.pathname === paths.LOCATIONS ? hoverColor : "rgba(32,64,102,0.79)",
                                    fontWeight: "bold",
                                    fontSize: 14,
                                    fontFamily: "roboto"
                                }} onClick={() => handleClick}>Fakulteti u blizini</ListItemText>
                            </ListItemButton>
                            <ListItemButton className={classes.nested}
                                            aria-owns={anchorEl ? "simple-menu" : undefined}
                                            style={{paddingLeft: 19, backgroundColor: "transparent"}}
                                            onClick={() => navigate(paths.PREDICTION)}
                                            aria-haspopup="true">
                                <ListItemText disableTypography style={{
                                    color:  location.pathname === paths.PREDICTION ? hoverColor : "rgba(32,64,102,0.79)",
                                    fontWeight: "bold",
                                    fontSize: 14,
                                    fontFamily: "roboto"
                                }} onClick={() => handleClick}>Upitnik</ListItemText>
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
                        <Box sx={{ display: 'flex', alignItems: 'center', width: "100%", justifyContent: "space-between" }}>
                            <img src={logo} alt="logo" style={{ width: "auto", height: "auto" }} />
                            <MenuList sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                flexWrap: 'nowrap',
                                marginBottom: "0.6%",
                                paddingTop: "21px",
                                marginLeft: "1.5%",
                                width: "100%",
                                overflowX: 'auto',
                                '@media (max-width: 900px)': {
                                    justifyContent: 'space-around',
                                }
                            }}>
                                <ListItemButton className={classes.nested}
                                                sx={{
                                                    width: "auto",
                                                    maxWidth: "140px",
                                                    whiteSpace: 'normal',
                                                    '@media (max-width: 900px)': {
                                                        marginLeft: "1%",
                                                        maxWidth: "120px",
                                                        flexShrink: 1,
                                                        marginRight: "1%",
                                                    },
                                                    '&:hover': {
                                                        backgroundColor: 'transparent',
                                                    }
                                                }}
                                                onClick={() => navigate(paths.HOME)}>
                                    <ListItemText disableTypography sx={{
                                        color: location.pathname === paths.HOME ? "lightgray" : "white",
                                        fontWeight: "bold",
                                        fontSize: 12,
                                        whiteSpace: 'normal',
                                    }}>Početna stranica</ListItemText>
                                </ListItemButton>

                                <ListItemButton className={classes.nested}
                                                aria-owns={anchorEl ? "simple-menu" : undefined}
                                                sx={{
                                                    marginRight: "0%",
                                                    width: "auto",
                                                    maxWidth: "120px",
                                                    flexShrink: 1,
                                                    whiteSpace: 'normal',
                                                    '@media (max-width: 900px)': {
                                                        marginLeft: "-11%",
                                                        marginRight: "1%",
                                                    },
                                                    '&:hover': {
                                                        backgroundColor: 'transparent',
                                                    }
                                                }}
                                                onClick={() => navigate(paths.FACULTIES)}
                                                aria-haspopup="true">
                                    <ListItemText disableTypography sx={{
                                        color: location.pathname === paths.FACULTIES ? "lightgray" : "white",
                                        fontWeight: "bold",
                                        fontSize: 12,
                                        whiteSpace: 'normal',
                                    }} onClick={() => handleClick}>Fakulteti</ListItemText>
                                </ListItemButton>

                                <ListItemButton className={classes.nested}
                                                aria-owns={anchorEl ? "simple-menu" : undefined}
                                                sx={{
                                                    marginLeft: "-2%",
                                                    width: "auto",
                                                    maxWidth: "140px",
                                                    whiteSpace: 'normal',
                                                    '@media (max-width: 900px)': {
                                                        marginLeft: "1%",
                                                        maxWidth: "120px",
                                                        flexShrink: 1,
                                                    },
                                                    '&:hover': {
                                                        backgroundColor: 'transparent',
                                                    }
                                                }}
                                                onClick={() => navigate(paths.LOCATIONS)}
                                                aria-haspopup="true">
                                    <ListItemText disableTypography sx={{
                                        color: location.pathname === paths.LOCATIONS ? "lightgray" : "white",
                                        fontWeight: "bold",
                                        fontSize: 12,
                                        whiteSpace: 'normal',
                                    }} onClick={() => handleClick}>Fakulteti u blizini</ListItemText>
                                </ListItemButton>

                                <ListItemButton className={classes.nested}
                                                aria-owns={anchorEl ? "simple-menu" : undefined}
                                                sx={{
                                                    width: "auto",
                                                    maxWidth: "120px",
                                                    flexShrink: 1,
                                                    whiteSpace: 'normal',
                                                    '@media (max-width: 900px)': {
                                                        marginLeft: "1%",
                                                    },
                                                    '&:hover': {
                                                        backgroundColor: 'transparent',
                                                    }
                                                }}
                                                onClick={() => navigate(paths.PREDICTION)}
                                                aria-haspopup="true">
                                    <ListItemText disableTypography sx={{
                                        color: location.pathname === paths.PREDICTION ? "lightgray" : "white",
                                        fontWeight: "bold",
                                        fontSize: 12,
                                        whiteSpace: 'normal',
                                    }} onClick={() => handleClick}>Upitnik</ListItemText>
                                </ListItemButton>
                            </MenuList>

                            {isAdmin ? (
                                <AvatarButton />
                            ) : (
                                <LockIcon
                                    sx={{ marginLeft: 'auto', height: 25, width: 25, color: "#fff", cursor: 'pointer' }}
                                    onClick={onLockIconClick}
                                />
                            )}
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