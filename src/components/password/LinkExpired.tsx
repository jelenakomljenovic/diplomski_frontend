import * as React from "react";
import "./password.css";
import linkExpired from "../../assets/tta.png";
import {Button, Typography} from "@mui/material";


export function LinkExpired() {


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
                    <Typography style={{fontSize: 18, fontWeight: "bold"}}>Link je istekao</Typography>
                    <img src={linkExpired} style={{
                        width: "95%",
                        height: "auto",
                        marginTop: "3%"
                    }} alt="Link expired" draggable="false"></img>
                    <Typography style={{marginTop: "8%", fontSize: 14, marginBottom: "5%"}}>Link kojem pokušavate
                        pristupiti je istekao. Kliknite na dugme "Ponovo pošalji" kako bismo Vam ponovo poslali
                        link za promjenu lozinke.</Typography>

                    <div style={{display: 'flex', justifyContent: 'center', width: '100%'}}>
                        <Button variant="contained" style={{
                            marginTop: "10px",
                            marginBottom: "50px",
                            backgroundColor: "rgba(28,130,196,0.79)",
                            textTransform: "none",
                            fontSize: 14
                        }}
                        >
                            Ponovo pošalji
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );


}

