import * as React from 'react';
import {Button, responsiveFontSizes, Typography} from "@mui/material";
import homePageImage from '../../src/assets/tes.png';
import {createTheme} from "@mui/material/styles";
import {ThemeProvider} from "@mui/styles";
import {useNavigate} from "react-router-dom";
import {paths} from "../constants/urlConstants";


function HomePageImg() {
    const navigate = useNavigate();

    return (
        <div>
            <div style={{
                backgroundImage: `url(${homePageImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '78vh',
                height: "auto",
                width: 'auto'
            }}>
                <div
                    style={{ marginLeft: "15%", height: "auto", maxWidth: "40%", paddingTop: "8.5%"}}>
                        <Typography style={{fontSize: 16, fontFamily: "roboto", fontWeight: "bold", color: "#12b48b"}}>Pomoć
                            pri odabiru fakulteta</Typography>
                        <Typography
                            style={{
                                fontSize: 34,
                                fontFamily: "roboto",
                                fontWeight: "bold",
                                color: "#262566",
                                marginTop: "1.5%"
                            }}>Pronađite
                            fakultet koji odgovara<br/>vašim interesovanjima</Typography>
                        <Typography style={{fontSize: 16, fontFamily: "roboto", color: "#6E6E6E", marginTop: "2%"}}>Odabir
                            fakulteta
                            može biti izazovan kada imate različita interesovanja<br/> i niste sasvim sigurni koji pravac
                            odabrati.</Typography>
                    <Button style={{
                        backgroundColor: "#12b48b",
                        color: "white",
                        height: "46px",
                        width: "140px",
                        fontWeight: "bold",
                        textAlign: "center",
                        marginTop: "13%"
                    }} onClick={() => navigate(paths.PREDICTION)}>Pogledaj više</Button>
                </div>
            </div>
        </div>
);
}

export default HomePageImg;