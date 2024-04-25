import * as React from "react";
import "./password.css";
import img from "../../assets/kindpng_7554518.png";
import {Button, Typography} from "@mui/material";
import {paths} from "../../constants/urlConstants";
import {useNavigate} from "react-router-dom";


export function PasswordApproved() {
    const navigate = useNavigate();


    return (
        <div className="background" style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            position: 'relative',
        }}>
            <div style={{
                width: "26%",
                minWidth: "360px",
                minHeight: "465px",
                marginBottom: "2.5%",
                backgroundColor: "#f5f4f4",
                boxShadow: "5px 5px 20px 3px rgba(0,0,0,.08)",
                borderRadius: 15,
                position: 'relative',
            }}
            >
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: "column",
                    marginTop: "11%",
                    marginLeft: "13%",
                    marginRight: "13%"
                }}>
                    <Typography style={{fontSize: 18, fontWeight: "bold"}}>Lozinka je uspješno promijenjena!</Typography>
                    <img src={img} style={{
                        width: "80%",
                        height: "auto",
                        marginTop: "6%",
                        marginRight: "9%"
                    }} alt="Link expired" draggable="false"></img>
                    <Typography style={{marginTop: "8%", fontSize: 14, marginBottom: "3%"}}>Uspješno ste promijenili lozinku. Klikom na dugme "Idi na aplikaciju" možete se prijaviti koristeći novu lozinku.
                    </Typography>

                    <div style={{display: 'flex', justifyContent: 'center', width: '100%'}}>
                        <Button variant="contained" style={{
                            marginTop: "10px",
                            marginBottom: "50px",
                            backgroundColor: "rgba(28,130,196,0.79)",
                            textTransform: "none",
                            fontSize: 14
                        }}
                                onClick={() => navigate(paths.HOME)}
                        >
                            Idi na aplikaciju
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );


}

