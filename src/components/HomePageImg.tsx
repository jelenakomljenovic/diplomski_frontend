import * as React from 'react';
import {Button, Typography} from "@mui/material";
import homePageImage from '../../src/assets/tes.png';
import {useNavigate} from "react-router-dom";
import {paths} from "../constants/urlConstants";


function HomePageImg() {
    const navigate = useNavigate();

    const styles = {
        container: {
            backgroundImage: `url(${homePageImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '78vh',
            height: "auto",
            width: 'auto',
            display: 'flex',
            alignItems: 'center',
            padding: "2%"
        },
        contentContainer: {
            marginLeft: "14%",
            height: "auto",
            maxWidth: "40%",
        },
        contentContainerResponsive: {
            marginLeft: "5%",
            maxWidth: "90%",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)"
        },
        heading: {
            fontSize: 16,
            fontFamily: "roboto",
            fontWeight: "bold",
            color: "#12b48b"
        },
        headingResponsive: {
            fontSize: 14
        },
        title: {
            fontSize: 34,
            fontFamily: "roboto",
            fontWeight: "bold",
            color: "#262566",
            marginTop: "1.5%"
        },
        titleResponsive: {
            fontSize: 31
        },
        description: {
            fontSize: 15,
            fontFamily: "roboto",
            color: "#6E6E6E",
            marginTop: "2%"
        },
        descriptionResponsive: {
            fontSize: 14
        },
        button: {
            backgroundColor: "#12b48b",
            color: "white",
            height: "46px",
            width: "140px",
            fontWeight: "bold",
            textAlign: "center",
            marginTop: "6%"
        },
    };

    return (
        <div>
            <div style={styles.container}>
                <div
                    className="content-container"
                    style={window.innerWidth <= 768 ? styles.contentContainerResponsive : styles.contentContainer}
                >
                    <Typography
                        style={window.innerWidth <= 768 ? {...styles.heading, ...styles.headingResponsive} : styles.heading}>Pomoć
                        pri odabiru fakulteta</Typography>
                    <Typography
                        style={window.innerWidth <= 768 ? {...styles.title, ...styles.titleResponsive} : styles.title}>Pronađi
                        fakultet koji odgovara<br/>tvojim interesovanjima</Typography>
                    <Typography
                        style={window.innerWidth <= 768 ? {...styles.description, ...styles.descriptionResponsive} : styles.description}>
                        Odabir fakulteta može biti izazovan kada imaš različita interesovanja<br/> i nisi sasvim
                        siguran/na koji pravac odabrati.<br/>
                        Upravo iz tog razloga je kreiran upitnik koji će ti pomoći <br/> da riješiš sve nedoumice.
                    </Typography>
                    <Button style={{
                        backgroundColor: "#12b48b",
                        color: "white",
                        height: window.innerWidth <= 768 ? "38px !important" : "46px",
                        width: "140px",
                        fontWeight: "bold",
                        textAlign: "center",
                        marginTop: "6%",
                        borderRadius: 20,
                    }} onClick={() => navigate(paths.PREDICTION)}>Pogledaj više</Button>
                </div>
                <style>
                    {`
                @media (max-width: 768px) {
                    .content-container {
                        margin-left: 5% !important;
                        max-height: 85% !important;
                        max-width: 85% !important;
                        background-color: rgba(255, 255, 255, 0.8) !important;
                        padding: 20px !important;
                        border-radius: 10px !important;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1) !important;
                    }
                    .content-container h6 {
                        font-size: 18px !important;
                    }
                    .content-container h4 {
                        font-size: 43px !important;
                    }
                    .content-container p {
                        font-size: 16px !important;
                    }
                }
                `}
                </style>
            </div>
        </div>

    );
}

export default HomePageImg;