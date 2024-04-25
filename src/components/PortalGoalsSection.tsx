import * as React from 'react';
import {useContext} from 'react';
import {List, ListItem, ListItemIcon, Typography} from "@mui/material";
import homePageGoalsImage from '../../src/assets/GoalsImage.png';
import {KeyboardDoubleArrowRight} from "@mui/icons-material";
import {Link} from "react-router-dom";
import {ScrollContext} from "./HomePage";

function PortalGoalsSection() {
    const executeScroll = useContext(ScrollContext);

    return (
        <div style={{backgroundColor: "white", marginTop: -6}}>
            <div style={{
                display: "flex",
                minHeight: "500px",
                height: "auto",
                backgroundColor: "white",
                marginLeft: "15%",
                marginRight: "15%"
            }}>
                <div style={{width: "60%", display: 'flex', flexDirection: 'column'}}>
                    <Typography variant="h2" style={{
                        fontSize: 35,
                        color: "#262566",
                        marginTop: "10%",
                        fontFamily: "roboto",
                        fontWeight: 700
                    }}>Koji su ciljevi portala?</Typography>
                    <Typography style={{
                        fontSize: 16,
                        color: "#6E6E6E",
                        marginTop: "3%",
                        fontFamily: "openSans",
                        marginBottom: "1%"
                    }}>Portal
                        je namijenjen za pružanje podrške u procesu upisa na fakultet i pronalaženju
                        idealnog studijskog programa.
                        Pored toga, na portalu se mogu pronaći korisne smjernice vezane za sam proces upisa, kao i
                        sve ostale informacije koje mogu biti od suštinskog značaja na početku akademskog
                        obrazovanja.
                        Neki od resursa koji se mogu pronaći, a koji mogu biti od pomoći,
                        uključuju:</Typography>
                    <div>
                        <List>
                            <ListItem disableGutters={true}>
                                <ListItemIcon>
                                    <KeyboardDoubleArrowRight style={{color: "#262566"}}/>
                                </ListItemIcon>
                                <Link to={`/faculties`} style={{textDecoration: 'none'}}>
                                    <Typography style={{
                                        color: "#262566",
                                        fontSize: 16,
                                        fontFamily: "openSans",
                                        fontWeight: "bold",
                                        marginLeft: -20
                                    }}>Detaljne informacije o fakultetima</Typography>
                                </Link>
                            </ListItem>
                            <ListItem disableGutters={true} onClick={() => executeScroll && executeScroll()} sx={{
                                cursor: 'pointer'
                            }}>
                                <ListItemIcon>
                                    <KeyboardDoubleArrowRight style={{color: "#262566"}}/>
                                </ListItemIcon>
                                <Typography style={{
                                    color: "#262566",
                                    fontSize: 16,
                                    fontFamily: "openSans",
                                    fontWeight: "bold",
                                    marginLeft: -20
                                }}>Vodič kroz osnovne studentske pojmove</Typography>
                            </ListItem>
                            <Link to={`/prediction`} style={{textDecoration: 'none'}}>
                                <ListItem disableGutters={true}>
                                    <ListItemIcon>
                                        <KeyboardDoubleArrowRight style={{color: "#262566"}}/>
                                    </ListItemIcon>
                                    <Typography style={{
                                        color: "#262566",
                                        fontSize: 16,
                                        fontFamily: "openSans",
                                        fontWeight: "bold",
                                        marginLeft: -20
                                    }}>Preporuke fakulteta na osnovu vaših ambicija</Typography>
                                </ListItem>
                            </Link>
                            <Link to={`/locations`} style={{textDecoration: 'none'}}>
                                <ListItem disableGutters={true}>
                                    <ListItemIcon>
                                        <KeyboardDoubleArrowRight style={{color: "#262566"}}/>
                                    </ListItemIcon>
                                    <Typography
                                        style={{
                                            color: "#262566",
                                            fontSize: 16,
                                            fontFamily: "openSans",
                                            fontWeight: "bold",
                                            marginLeft: -20
                                        }}>Prikaz fakulteta koji se nalaze u neposrednoj blizini</Typography>
                                </ListItem>
                            </Link>
                        </List>
                    </div>
                </div>
                <div style={{
                    width: "40%",
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: "10%"
                }}>
                    <img style={{maxHeight: "100%", maxWidth: "100%"}} src={homePageGoalsImage} alt=""/>
                </div>
            </div>
        </div>
    );
}

export default PortalGoalsSection;