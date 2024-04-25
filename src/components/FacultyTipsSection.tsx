import * as React from 'react';
import {Typography} from "@mui/material";
import faculty from '../../src/assets/faculty.png';
import exam from '../../src/assets/exam.png';
import fee from '../../src/assets/fee.png';
import {useState} from "react";

function FacultyTipsSection() {
    const [firstMouseClick, setFirstMouseClick] = useState(false);
    const [secondMouseClick, setSecondMouseClick] = useState(false);
    const [thirdMouseClick, setThirdMouseClick] = useState(false);

    return (
        <div style={{minHeight: "660px", backgroundColor: "#f9fbfe", height: "auto"}}>
            <Typography variant="h2" style={{
                fontSize: 32,
                color: "#262566",
                fontFamily: "roboto",
                textAlign: "center",
                paddingTop: "3%",
                fontWeight: 700
            }}>Šta je potrebno znati prije upisa na fakultet?</Typography>
            <Typography style={{
                fontSize: 16,
                color: "#6E6E6E",
                width: "54%",
                marginTop: "1%",
                fontFamily: "openSans",
                marginLeft: "24%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                textAlign: "center",
                alignItems: "center"
            }}>Upis na fakultet predstavlja važan korak u životu svakog studenta.
                Upravo iz tog razloga, informisanost igra ključnu ulogu.
                Da biste se adekvatno pripremili za sam proces upisa, korisno je obratiti pažnju na
                sljedeće:</Typography>
            <div style={{display: "flex", gap: "3%", justifyContent: "center", paddingTop: "3%"}}>
                <div style={{
                    width: "21%",
                    minHeight: "365px",
                    height: "auto",
                    backgroundColor: "transparent",
                    border: "1px solid #12b48b",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: firstMouseClick ? "-7px" : "0px"
                }}
                     onMouseEnter={() => setFirstMouseClick(true)}
                     onMouseLeave={() => setFirstMouseClick(false)}>
                    <div style={{
                        height: "22%",
                        width: "26%",
                        borderRadius: "50%",
                        backgroundColor: "white",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        boxShadow: "0 0 20px 3px rgba(0,0,0,.05)"
                    }}>
                        <img style={{height: "56%", width: "65%"}}
                             src={faculty}
                             alt={"t"}/>
                    </div>
                    <p style={{
                        color: "#204066",
                        fontFamily: "roboto",
                        fontSize: 20,
                        marginTop: "9%",
                        fontWeight: "bold"
                    }}>Izbor fakulteta</p>
                    <Typography style={{
                        fontSize: 14,
                        color: "#6E6E6E",
                        marginLeft: "4%",
                        marginRight: "4%",
                        marginBottom: "5%",
                        fontFamily: "openSans",
                        textAlign: "center"
                    }}>
                        Kako biste donijeli
                        odluku koja je u skladu sa vašim interesovanjima i poslovnim ambicijama, najvažnije je
                        dobro se informisati o studijskom planu i programu svakog fakulteta.
                        Takođe, dobro je uzeti u obzir i alternativnu opciju, ukoliko se desi da ne ispunite
                        kriterijume
                        za upis na željeni fakultet.
                    </Typography>
                </div>
                <div style={{
                    width: "21%",
                    minHeight: "365px",
                    height: "auto",
                    backgroundColor: "transparent",
                    border: "1px solid #12b48b",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: secondMouseClick ? "-7px" : "0px"
                }}
                     onMouseEnter={() => setSecondMouseClick(true)}
                     onMouseLeave={() => setSecondMouseClick(false)}>
                    <div style={{
                        height: "22%",
                        width: "26%",
                        borderRadius: "50%",
                        backgroundColor: "white",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        boxShadow: "0 0 20px 3px rgba(0,0,0,.05)"
                    }}>
                        <img style={{height: "36%", width: "36%"}}
                             src={exam}
                             alt={"t"}/>
                    </div>
                    <p style={{
                        color: "#204066",
                        fontFamily: "roboto",
                        fontSize: 20,
                        marginTop: "9%",
                        fontWeight: "bold",
                        justifyContent: "center"
                    }}>Prijemni ispit</p>
                    <Typography style={{
                        fontSize: 14,
                        color: "#6E6E6E",
                        marginLeft: "4%",
                        marginRight: "4%",
                        marginBottom: "5%",
                        fontFamily: "openSans",
                        textAlign: "center"
                    }}>
                        Prijemni ispit igra ključnu ulogu u selekciji studenata i predstavlja mjerilo
                        sposobnosti kandidata u određenoj oblasti.
                        Na svakom fakultetu postoji posebna literatura, koja se
                        koristi za efikasnu pripremu prijemnog ispita,
                        dok određeni fakulteti drže i pripremnu nastavu kako bi dodatno upoznali studente sa
                        strukturom ispita.

                    </Typography>
                </div>
                <div style={{
                    width: "21%",
                    minHeight: "365px",
                    height: "auto",
                    backgroundColor: "transparent",
                    border: "1px solid #12b48b",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: thirdMouseClick ? "-7px" : "0px"
                }}
                     onMouseEnter={() => setThirdMouseClick(true)}
                     onMouseLeave={() => setThirdMouseClick(false)}>
                    <div style={{
                        height: "22%",
                        width: "26%",
                        borderRadius: "50%",
                        backgroundColor: "white",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        boxShadow: "0 0 20px 3px rgba(0,0,0,.05)"
                    }}>
                        <img style={{height: "45%", width: "52%"}}
                             src={fee}
                             alt={"t"}/>
                    </div>
                    <p style={{
                        color: "#204066",
                        fontFamily: "roboto",
                        fontSize: 20,
                        marginTop: "7%",
                        fontWeight: "bold",
                        justifyContent: "center"
                    }}>Školarina</p>
                    <Typography style={{
                        fontSize: 14,
                        color: "#6E6E6E",
                        marginLeft: "4%",
                        marginRight: "4%",
                        marginBottom: "5%",
                        fontFamily: "openSans",
                        textAlign: "center"
                    }}>
                        Školarina predstavlja dodatni faktor koji bi trebalo uzeti u obzir prilikom odabira
                        fakulteta.
                        Pažljivo istražite dostupne opcije finansijske podrške tokom studiranja poput:
                        stipendija, mogućnosti za rad tokom studija kao i drugih načina podrške koji mogu
                        značajno uticati na budžet i iskustvo tokom fakultetskog obrazovanja.
                    </Typography>
                </div>
            </div>
        </div>
    );
}

export default FacultyTipsSection;