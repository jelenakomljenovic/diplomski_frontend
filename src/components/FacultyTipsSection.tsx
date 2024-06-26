import * as React from 'react';
import {useState} from 'react';
import {Typography} from "@mui/material";
import faculty from '../../src/assets/faculty.png';
import exam from '../../src/assets/exam.png';
import fee from '../../src/assets/fee.png';
import "./tips.css";
import TipsDialog from './TipsDialog';

function FacultyTipsSection() {
    const [firstMouseClick, setFirstMouseClick] = useState(false);
    const [secondMouseClick, setSecondMouseClick] = useState(false);
    const [thirdMouseClick, setThirdMouseClick] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [openExamDialog, setOpenExamDialog] = useState(false);

    const handleMenuClick = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleMenuExamClick = () => {
        setOpenExamDialog(true);
    };

    const handleCloseExamDialog = () => {
        setOpenExamDialog(false);
    };


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
            <div style={{display: "flex", flexWrap: "wrap", gap: "3%", justifyContent: "center", paddingTop: "3%"}}>
                <div style={{
                    width: "21%",
                    minWidth: "300px",
                    minHeight: "365px",
                    height: "auto",
                    backgroundColor: "transparent",
                    border: "1px solid #12b48b",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    transform: firstMouseClick ? "scale(1.02)" : "scale(1)",
                    transition: "transform 0.3s ease",
                    marginBottom: "2%"
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
                        Kako biste donijeli odluku koja je u skladu sa vašim interesovanjima i poslovnim ambicijama,
                        najvažnije je
                        dobro se informisati o studijskom planu i programu svakog fakulteta.
                        Takođe, dobro je uzeti u obzir i alternativnu opciju, ukoliko se desi da ne ispunite kriterijume
                        za upis na željeni fakultet.
                    </Typography>
                </div>
                <div style={{
                    width: "21%",
                    minWidth: "300px",
                    minHeight: "365px",
                    height: "auto",
                    backgroundColor: "transparent",
                    border: "1px solid #12b48b",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    transform: secondMouseClick ? "scale(1.02)" : "scale(1)",
                    transition: "transform 0.3s ease",
                    marginBottom: "2%"
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
                        <span style={{textDecoration: "underline", color: "rgb(13,73,227)", cursor: "pointer"}}
                              onClick={handleMenuExamClick}>Prijemni ispit</span> igra
                        ključnu ulogu u selekciji studenata i predstavlja mjerilo
                        sposobnosti kandidata u određenoj oblasti.
                        Na svakom fakultetu postoji posebna literatura, koja se koristi za efikasnu prepremu prijemnog
                        ispita,
                        dok određeni fakulteti drže i pripremnu nastavu kako bi dodatno upoznali studente sa strukturom
                        ispita.

                    </Typography>
                </div>
                <div style={{
                    width: "21%",
                    minWidth: "300px",
                    minHeight: "365px",
                    height: "auto",
                    backgroundColor: "transparent",
                    border: "1px solid #12b48b",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    transform: thirdMouseClick ? "scale(1.02)" : "scale(1)",
                    transition: "transform 0.3s ease",
                    marginBottom: "2%"
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
                        <span style={{textDecoration: "underline", color: "rgb(13,73,227)", cursor: "pointer"}}
                              onClick={handleMenuClick}> stipendija</span>, mogućnosti za rad tokom studija kao i drugih
                        načina podrške koji mogu
                        značajno uticati na budžet i iskustvo tokom fakultetskog obrazovanja.
                    </Typography>
                    <TipsDialog openDialog={openDialog}
                                handleCloseDialog={handleCloseDialog}
                                exam={false}
                                title={"Stipendije"}
                                contentText={" Pronadjite spisak dostupnih stipendija u zavisnosti od toga u kojoj državi želite studirati:"}
                    />
                    <TipsDialog openDialog={openExamDialog}
                                handleCloseDialog={handleCloseExamDialog}
                                exam={true}
                                title={"Prijemni ispiti"}
                                contentText={" Pronadjite informacije o prijemnim ispitima u zavisnosti od toga u kojoj državi želite studirati:"}/>
                </div>
            </div>
        </div>
    );
}

export default FacultyTipsSection;