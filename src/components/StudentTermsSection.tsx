import * as React from 'react';
import {useState} from 'react';
import {Typography} from "@mui/material";


function StudentTermsSection() {

    const [freshmanEntered, setFreshmanEntered] = useState(false);
    const [bachelorEntered, setBachelorEntered] = useState(false);
    const [transcriptEntered, setTranscriptEntered] = useState(false);
    const [semesterEntered, setSemesterEntered] = useState(false);
    const [colloquiumEntered, setColloquiumEntered] = useState(false);
    const [examEntered, setExamEntered] = useState(false);
    const [ectsEntered, setEctsEntered] = useState(false);
    const [lectureEntered, setLectureEntered] = useState(false);

    return (
        <div style={{minHeight: "700px", height: "auto", backgroundColor: "#ffffff"}}>
            <Typography variant="h2" style={{
                fontSize: 32,
                color: "#262566",
                fontFamily: "roboto",
                textAlign: "center",
                paddingTop: "3.5%",
                fontWeight: 700
            }}>Koja su značenja osnovnih studentskih pojmova?</Typography>
            <Typography style={{
                fontSize: 16,
                color: "#6E6E6E",
                width: "68%",
                marginTop: "1%",
                fontFamily: "openSans",
                marginLeft: "16%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                textAlign: "center",
                alignItems: "center"
            }}> Sigurno ste već mnogo puta čuli razne izraze koji se koriste u svakodnevnom govoru između
                studenata, ali možda niste bili potpuno sigurni šta tačno znače.
                Upravo iz tog razloga, pripremili smo vodič koji će vam pružiti jasna i jednostavna objašnjenja,
                te omogućiti lakše snalaženje.</Typography>
            <div style={{display: "flex", flexWrap: "wrap", gap: "2%", justifyContent: "center", paddingTop: "3%"}}>
                <div style={{
                    width: "18%",
                    minWidth: "300px",
                    minHeight: "165px",
                    height: "auto",
                    backgroundColor: freshmanEntered ? "rgba(19,157,112,0.75)" : "#effffb",
                    border: "1px solid #12b48b",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    transform: freshmanEntered ? 'scale(1.09)' : 'none',
                    transition: 'transform 0.3s ease-in-out',
                    marginBottom: "2%"
                }}
                     onMouseEnter={() => setFreshmanEntered(true)}
                     onMouseLeave={() => setFreshmanEntered(false)}
                >
                    <p style={{
                        color: freshmanEntered ? "white" : "#204066",
                        fontFamily: "roboto",
                        fontSize: 20,
                        marginTop: "2%",
                        fontWeight: "bold"
                    }}>Brucoš</p>
                    <Typography style={{
                        fontSize: 14,
                        color: freshmanEntered ? "white" : "#6E6E6E",
                        marginLeft: "4%",
                        marginRight: "4%",
                        marginBottom: "5%",
                        fontFamily: "openSans",
                        textAlign: "center"
                    }}>
                        Termin koji se koristi za označavanje osobe koja je upravo upisala fakultet i započela svoju prvu godinu studija.
                    </Typography>
                </div>
                <div style={{
                    width: "18%",
                    minWidth: "300px",
                    minHeight: "165px",
                    height: "auto",
                    backgroundColor: bachelorEntered ? "rgba(19,157,112,0.75)" : "#effffb",
                    border: "1px solid #12b48b",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    transform: bachelorEntered ? 'scale(1.09)' : 'none',
                    transition: 'transform 0.3s ease-in-out',
                    marginBottom: "2%"
                }}
                     onMouseEnter={() => setBachelorEntered(true)}
                     onMouseLeave={() => setBachelorEntered(false)}
                >
                    <p style={{
                        color: bachelorEntered ? "white" : "#204066",
                        fontFamily: "roboto",
                        fontSize: 20,
                        marginTop: "2%",
                        fontWeight: "bold",
                        justifyContent: "center"
                    }}>Bachelor</p>
                    <Typography style={{
                        fontSize: 14,
                        color: bachelorEntered ? "white" : "#6E6E6E",
                        marginLeft: "4%",
                        marginRight: "4%",
                        marginBottom: "5%",
                        fontFamily: "openSans",
                        textAlign: "center"
                    }}>
                        Akademski naziv kojim se označava stepen obrazovanja koji se stiče završetkom prvog ciklusa studija.
                    </Typography>
                </div>
                <div style={{
                    width: "18%",
                    minWidth: "300px",
                    minHeight: "165px",
                    height: "auto",
                    backgroundColor: semesterEntered ? "rgba(19,157,112,0.75)" : "#effffb",
                    border: "1px solid #12b48b",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    transform: semesterEntered ? 'scale(1.09)' : 'none',
                    transition: 'transform 0.3s ease-in-out',
                    marginBottom: "2%"
                }} onMouseEnter={() => setSemesterEntered(true)}
                     onMouseLeave={() => setSemesterEntered(false)}
                >
                    <p style={{
                        color: semesterEntered ? "white" : "#204066",
                        fontFamily: "roboto",
                        fontSize: 20,
                        marginTop: "2%",
                        fontWeight: "bold",
                        justifyContent: "center"
                    }}>Semestar</p>
                    <Typography style={{
                        fontSize: 14,
                        color: semesterEntered ? "white" : "#6E6E6E",
                        marginLeft: "4%",
                        marginRight: "4%",
                        marginBottom: "5%",
                        fontFamily: "openSans",
                        textAlign: "center"
                    }}>
                        Semestar je period u akademskoj godini, podijeljen na zimski i ljetni dio, što je analogno polugodištu u osnovnim i srednjim školama.
                    </Typography>
                </div>
                <div style={{
                    width: "18%",
                    minWidth: "300px",
                    minHeight: "165px",
                    height: "auto",
                    backgroundColor: transcriptEntered ? "rgba(19,157,112,0.75)" : "#effffb",
                    border: "1px solid #12b48b",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    transform: transcriptEntered ? 'scale(1.09)' : 'none',
                    transition: 'transform 0.3s ease-in-out',
                    marginBottom: "2%"
                }}
                     onMouseEnter={() => setTranscriptEntered(true)}
                     onMouseLeave={() => setTranscriptEntered(false)}
                >
                    <p style={{
                        color: transcriptEntered ? "white" : "#204066",
                        fontFamily: "roboto",
                        fontSize: 20,
                        marginTop: "2%",
                        fontWeight: "bold",
                        justifyContent: "center"
                    }}>Indeks</p>
                    <Typography style={{
                        fontSize: 14,
                        color: transcriptEntered ? "white" : "#6E6E6E",
                        marginLeft: "4%",
                        marginRight: "4%",
                        marginBottom: "5%",
                        fontFamily: "openSans",
                        textAlign: "center"
                    }}>
                        Službena studentska knjižica koja služi za evidentiranje ocjena koje su dobijene na završnim ispitima.
                    </Typography>
                </div>
                <div style={{
                    width: "18%",
                    minWidth: "300px",
                    minHeight: "165px",
                    height: "auto",
                    backgroundColor: lectureEntered ? "rgba(19,157,112,0.75)" : "#effffb",
                    border: "1px solid #12b48b",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    transform: lectureEntered ? 'scale(1.09)' : 'none',
                    transition: 'transform 0.3s ease-in-out',
                    marginBottom: "2%"
                }}
                     onMouseEnter={() => setLectureEntered(true)}
                     onMouseLeave={() => setLectureEntered(false)}
                >
                    <p style={{
                        color: lectureEntered ? "white" : "#204066",
                        fontFamily: "roboto",
                        fontSize: 20,
                        marginTop: "2%",
                        fontWeight: "bold",
                        justifyContent: "center"
                    }}>Predavanja</p>
                    <Typography style={{
                        fontSize: 14,
                        color: lectureEntered ? "white" : "#6E6E6E",
                        marginLeft: "4%",
                        marginRight: "4%",
                        marginBottom: "5%",
                        fontFamily: "openSans",
                        textAlign: "center"
                    }}>

                        Predavanja predstavljaju formalni oblik nastave u kojima profesor prenosi znanje većoj grupi studenata.
                    </Typography>
                </div>
                <div style={{
                    width: "18%",
                    minWidth: "300px",
                    minHeight: "165px",
                    height: "auto",
                    backgroundColor: colloquiumEntered ? "rgba(19,157,112,0.75)" : "#effffb",
                    border: "1px solid #12b48b",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    transform: colloquiumEntered ? 'scale(1.09)' : 'none',
                    transition: 'transform 0.3s ease-in-out',
                    marginBottom: "2%"
                }}
                     onMouseEnter={() => setColloquiumEntered(true)}
                     onMouseLeave={() => setColloquiumEntered(false)}
                >
                    <p style={{
                        color: colloquiumEntered ? "white" : "#204066",
                        fontFamily: "roboto",
                        fontSize: 20,
                        marginTop: "2%",
                        fontWeight: "bold",
                        justifyContent: "center"
                    }}>Kolokvijum</p>
                    <Typography style={{
                        fontSize: 14,
                        color: colloquiumEntered ? "white" : "#6E6E6E",
                        marginLeft: "4%",
                        marginRight: "4%",
                        marginBottom: "5%",
                        fontFamily: "openSans",
                        textAlign: "center"
                    }}>
                        Kolokvijum predstavlja oblik provjere znanja iz određenog dijela gradiva. U nekim slučajevima može biti preduslov za izlazak na završni ispit.
                    </Typography>
                </div>
                <div style={{
                    width: "18%",
                    minWidth: "300px",
                    minHeight: "165px",
                    height: "auto",
                    backgroundColor: examEntered ? "rgba(19,157,112,0.75)" : "#effffb",
                    border: "1px solid #12b48b",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    transform: examEntered ? 'scale(1.09)' : 'none',
                    transition: 'transform 0.3s ease-in-out',
                    marginBottom: "2%"
                }}
                     onMouseEnter={() => setExamEntered(true)}
                     onMouseLeave={() => setExamEntered(false)}
                >
                    <p style={{
                        color: examEntered ? "white" : "#204066",
                        fontFamily: "roboto",
                        fontSize: 20,
                        marginTop: "2%",
                        fontWeight: "bold",
                        justifyContent: "center"
                    }}>Ispit</p>
                    <Typography style={{
                        fontSize: 14,
                        color: examEntered ? "white" : "#6E6E6E",
                        marginLeft: "4%",
                        marginRight: "4%",
                        marginBottom: "5%",
                        fontFamily: "openSans",
                        textAlign: "center"
                    }}>
                        Završna provjera znanja koja pokriva teme predviđene nastavnim planom predmeta. Može biti usmeni, pismeni, ili praktični.
                    </Typography>
                </div>
                <div style={{
                    width: "18%",
                    minWidth: "300px",
                    minHeight: "165px",
                    height: "auto",
                    backgroundColor: ectsEntered ? "rgba(19,157,112,0.75)" : "#effffb",
                    border: "1px solid #12b48b",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    transform: ectsEntered ? 'scale(1.09)' : 'none',
                    transition: 'transform 0.3s ease-in-out',
                    marginBottom: "2%"
                }}
                     onMouseEnter={() => setEctsEntered(true)}
                     onMouseLeave={() => setEctsEntered(false)}
                >
                    <p style={{
                        color: ectsEntered ? "white" : "#204066",
                        fontFamily: "roboto",
                        fontSize: 20,
                        marginTop: "2%",
                        fontWeight: "bold",
                        justifyContent: "center"
                    }}>ECTS bodovi</p>
                    <Typography style={{
                        fontSize: 14,
                        color: ectsEntered ? "white" : "#6E6E6E",
                        marginLeft: "4%",
                        marginRight: "4%",
                        marginBottom: "5%",
                        fontFamily: "openSans",
                        textAlign: "center"
                    }}>
                        ECTS je skraćenica za Evropski sistem prenosa bodova i koristi se za mjerenje količine rada potrebnog za ispunjavanje fakultetskih obaveza.
                    </Typography>
                </div>
            </div>
        </div>
    );
}

export default StudentTermsSection;