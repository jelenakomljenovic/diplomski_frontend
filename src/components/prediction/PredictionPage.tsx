import * as React from 'react';
import "./prediction.css";
import {Button, Typography} from "@mui/material";
import learningImage from "../../assets/learning.png";
import {HiOutlineQuestionMarkCircle} from "react-icons/hi";
import {RiQuestionAnswerFill} from "react-icons/ri";
import {IoMdMailUnread} from "react-icons/io";

function PredictionPage() {
    return (
        <div style={{
            minHeight: "86.8vh",
            backgroundColor: "rgba(207, 243, 233, 0.42)",
            paddingLeft: "9%",
            paddingRight: "9%",
        }}>
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
            }}>
                <div style={{width: "50%", paddingTop: "7%"}}>
                    <Typography variant="h2" style={{
                        fontSize: 35,
                        color: "#262566",
                        fontFamily: "roboto",
                        fontWeight: 700
                    }}>Otkrij koji fakultet nudi programe prilagođene tvojim ciljevima</Typography>
                    <Typography style={{
                        fontSize: 16,
                        color: "#6E6E6E",
                        marginTop: "3%",
                        fontFamily: "openSans",
                        marginBottom: "1%"
                    }}>Kada otvoriš upitnik prikazaće ti se niz pažljivo osmišljenih pitanja, koja će ti pomoći da
                        otkriješ fakultet na kojem možeš dodatno unaprijediti svoje talente.</Typography>
                    <Button style={{
                        backgroundColor: "#12b48b",
                        color: "white",
                        height: window.innerWidth <= 768 ? "38px !important" : "46px",
                        width: "140px",
                        fontWeight: "bold",
                        textAlign: "center",
                        marginTop: "3%",
                        borderRadius: 20,
                        fontSize: 13,
                    }}>Otvori upitnik</Button>
                </div>
                <div style={{width: "50%", display: 'flex', justifyContent: 'flex-end'}}>
                    <img style={{
                        maxWidth: "58%",
                        height: "auto",
                        objectFit: "contain"
                    }} src={learningImage} alt="Learning"/>
                </div>
            </div>
            <div style={{display: "flex", flexWrap: "wrap", gap: 35, paddingTop: "2%"}}>
                <div style={{
                    width: "20%",
                    minWidth: "350px",
                    minHeight: "165px",
                    height: "auto",
                    boxShadow: " 0 2px 4px rgba(0, 0, 0, 0.1)",
                    backgroundColor: "rgba(166,210,200,0.49)",
                    borderRadius: 10,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    paddingLeft: 12,
                    paddingRight: 12,
                    transition: 'transform 0.3s ease-in-out',
                    marginBottom: "2%"
                }}
                >
                    <div style={{
                        display: 'flex',
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginLeft: "5%",
                        paddingRight: "10%"
                    }}>
                        <div style={{
                            flexGrow: 1,
                            marginRight: '20px',
                        }}>
                            <p style={{
                                fontFamily: "roboto",
                                fontSize: 20,
                                color: "#204066",
                                fontWeight: "bold"
                            }}>Pitanja</p>
                        </div>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: "32px",
                            width: "35px",
                        }}>
                            <HiOutlineQuestionMarkCircle style={{height: 28, width: 25, color: "#204066"}}/>
                        </div>
                    </div>
                    <Typography style={{
                        fontSize: 14,
                        color: "#282828",
                        paddingLeft: 12,
                        paddingRight: 12,
                        paddingBottom: 12,
                        fontFamily: "openSans",
                    }}>
                        Upitnik se sastoji od ukupno 7 pitanja, podijeljenih u tri dijela. Prvi dio se odnosi na lične
                        informacije, drugi na srednjoškolsko obrazovanje i treći na tvoje sposobnosti i vještine.
                    </Typography>
                </div>
                <div style={{
                    width: "20%",
                    minWidth: "350px",
                    minHeight: "165px",
                    height: "auto",
                    boxShadow: " 0 2px 4px rgba(0, 0, 0, 0.1)",
                    backgroundColor: "rgba(166,210,200,0.49)",
                    borderRadius: 10,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    paddingLeft: 12,
                    paddingRight: 12,
                    transition: 'transform 0.3s ease-in-out',
                    marginBottom: "2%"
                }}
                >
                    <div style={{
                        display: 'flex',
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginLeft: "5%",
                        paddingRight: "10%"
                    }}>
                        <div style={{
                            flexGrow: 1,
                            marginRight: '20px',
                        }}>
                            <p style={{
                                fontFamily: "roboto",
                                fontSize: 20,
                                color: "#204066",
                                fontWeight: "bold"
                            }}>Rezultati</p>
                        </div>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: "32px",
                            width: "35px",
                        }}>
                            <RiQuestionAnswerFill style={{height: 28, width: 25, color: "#204066"}}/>
                        </div>
                    </div>
                    <Typography style={{
                        fontSize: 14,
                        color: "#282828",
                        paddingLeft: 12,
                        paddingRight: 12,
                        paddingBottom: 12,
                        fontFamily: "openSans",
                    }}>
                        Nakon što uspješno popuniš upitnik, dobićeš preporuku dva fakulteta na osnovu unesenih odgovora.
                        Klikom na svaki fakultet moći ćeš pronaći više informacija. </Typography>
                </div>
                <div style={{
                    width: "20%",
                    minWidth: "350px",
                    minHeight: "165px",
                    height: "auto",
                    boxShadow: " 0 2px 4px rgba(0, 0, 0, 0.1)",
                    backgroundColor: "rgba(166,210,200,0.49)",
                    borderRadius: 10,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    paddingLeft: 12,
                    paddingRight: 12,
                    transition: 'transform 0.3s ease-in-out',
                    marginBottom: "2%"
                }}
                >
                    <div style={{
                        display: 'flex',
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginLeft: "5%",
                        paddingRight: "10%"
                    }}>
                        <div style={{
                            flexGrow: 1,
                            marginRight: '20px',
                        }}>
                            <p style={{
                                fontFamily: "roboto",
                                fontSize: 20,
                                color: "#204066",
                                fontWeight: "bold"
                            }}>Izvještaj</p>
                        </div>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: "32px",
                            width: "35px",
                        }}>
                            <IoMdMailUnread style={{height: 28, width: 25, color: "#204066"}}/>
                        </div>
                    </div>
                    <Typography style={{
                        fontSize: 14,
                        color: "#282828",
                        paddingLeft: 12,
                        paddingRight: 12,
                        paddingBottom: 12,
                        fontFamily: "openSans",
                    }}>
                        Na kraju upitnika, možeš zatražiti detaljan izvještaj sa svim informacijama o preporučenim
                        fakultetima. Izvještaj se šalje direktno na e-mail adresu koju si prethodno unio.
                    </Typography>
                    </div>
            </div>
        </div>
);
}

export default PredictionPage;
