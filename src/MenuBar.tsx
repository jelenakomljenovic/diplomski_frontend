import * as React from 'react';
import {useState} from 'react';
import Toolbar from '@mui/material/Toolbar';
import {IoIosArrowDown} from "react-icons/io";
import {Box, CssBaseline, ListItemButton, ListItemText, MenuList, Theme, useScrollTrigger} from "@mui/material";
import {makeStyles} from "@mui/styles";
import {paths} from "./constants/urlConstants";
import {useNavigate} from "react-router-dom";
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

export function MenuBar() {
    const trigger = useScrollTrigger();
    const classes = useStyles();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [addPopup, setAddPopup] = useState(false);
    const [open, setOpen] = useState(false);
    const {isAdmin} = useAuth();


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
            <Box sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
                backgroundColor: "#fff",
                height: 55,
                boxShadow: "0 0 20px 3px rgba(0,0,0,.05)"
            }}>
            <CssBaseline/>
                <Toolbar>
                    <MenuList style={{marginBottom: "0.6%", display: "flex"}}>
                        <ListItemButton className={classes.nested}
                                        style={{backgroundColor: "transparent"}}
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
                                        sx={{
                                            width: "auto",
                                            minWidth: "12%",
                                            backgroundColor: "transparent",
                                            whiteSpace: 'normal',
                                            '@media (max-width: 900px)': {
                                                marginLeft: "-1%",
                                                marginRight: "1%",
                                            }
                                        }}
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
            </Box>
    );
}

export default MenuBar;