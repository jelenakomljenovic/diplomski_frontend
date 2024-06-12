import * as React from 'react';
import {useEffect, useState} from 'react';
import {Button, Divider, InputLabel, TextField} from "@mui/material";
import university from "../assets/university.png";
import {Link, useNavigate, useParams} from "react-router-dom";
import {CreateFacultyRequest} from "../api/faculty/faculty";
import {getUniversityById} from "../api/faculty/facultyApi";
import axiosService from "../axios/axiosService";
import {backendUrl} from "../constants/urlConstants";
import {useSnackbarHelper} from "../util/toastUtil";

function EditGeneralInfo() {
    let {id} = useParams();
    const [faculty, setFaculty] = useState<CreateFacultyRequest>();
    const [updatedFaculty, setUpdatedFaculty] = useState<CreateFacultyRequest>();
    let numId = 0;
    const handleClickVariant = useSnackbarHelper();
    const navigate = useNavigate();

    useEffect(() => {
        if (id !== undefined) {
            numId = parseInt(id, 10);
        }
        const getFaculty = async () => {
            const facultyRes = await getUniversityById(numId);
            setFaculty(facultyRes.data);
            setUpdatedFaculty(facultyRes.data)
        }
        getFaculty();
    }, [])

    const updateButtonClicked = () => {
        axiosService(true).put(`${backendUrl.FACULTY_URL}/update/${faculty?.id}`, {
            id: faculty?.id,
            name: faculty?.name,
            classification: faculty?.classification,
            address: faculty?.address,
            city: faculty?.city,
            country: faculty?.country,
            phoneNumber: faculty?.phoneNumber,
            website: faculty?.website,
            email: faculty?.email,
        }).then(response => {
            navigate(`/details/${faculty?.id}`);
            handleClickVariant('success', {vertical: 'top', horizontal: 'right'}, "Uspješno ažuriranje!")();
        }).catch(error => {
            handleClickVariant('error', {vertical: 'top', horizontal: 'right'}, "Došlo je do greške")();
        });
        ;
    }


    // @ts-ignore
    return (
        <>
            <div style={{
                backgroundColor: "white",
                height: "72vh",
                width: "91%",
                boxShadow: "5px 5px 20px 3px rgba(0,0,0,.08)",
                marginLeft: "4.4%",
                marginTop: "3%",
            }}>
                <div style={{top: "1%"}}>
                    <p style={{
                        fontSize: 15,
                        color: "#3696ab",
                        fontWeight: "bold",
                        marginLeft: "1%",
                        fontFamily: "openSans"
                    }}>Izmijeni informacije o fakultetu</p>
                </div>
                <Divider style={{
                    backgroundColor: "rgba(84,90,109,0.13)",
                    width: "100%",
                    height: "0.1vh"
                }}/>
                <div style={{display: "flex", flexDirection: "row"}}>
                    <img src={university} alt=""
                         style={{maxHeight: "20%", height: "15%", width: "10%", marginLeft: "4%", marginTop: "1%"}}/>
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        marginTop: "1.5%",
                        marginLeft: "9%",
                        width: "100%"
                    }}>
                        <div style={{display: "flex", flexDirection: "column", width: "74%"}}>
                            <InputLabel style={{color: "#858585", fontSize: 14, fontWeight: "bold"}}>Naziv fakulteta:
                                *</InputLabel>
                            <TextField
                                margin="normal"
                                required
                                value={faculty?.name}
                                id="name"
                                type="name"
                                inputProps={{
                                    style: {
                                        height: "12px",
                                    }
                                }}
                                //@ts-ignore
                                onChange={(e) => setFaculty({...faculty, name: e.target.value})}
                            />
                        </div>
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            flexDirection: "row",
                            gap: "3%",
                            marginTop: "1%",
                            width: "74%"
                        }}>
                            <div style={{display: "flex", flexDirection: "column", width: "48%"}}>
                                <InputLabel style={{color: "#858585", fontSize: 14, fontWeight: "bold"}}>Adresa:
                                    *</InputLabel>
                                <TextField
                                    margin="normal"
                                    required
                                    value={faculty?.address}
                                    id="address"
                                    type="address"
                                    inputProps={{
                                        style: {
                                            height: "12px",
                                            width: "400px"
                                        }
                                    }}
                                    //@ts-ignore
                                    onChange={(e) => setFaculty({...faculty, address: e.target.value})}
                                />
                            </div>
                            <div style={{display: "flex", flexDirection: "column", width: "49%"}}>
                                <InputLabel style={{color: "#858585", fontSize: 14, fontWeight: "bold"}}>Grad:
                                    *</InputLabel>
                                <TextField
                                    margin="normal"
                                    required
                                    value={faculty?.city}
                                    id="city"
                                    type="city"
                                    inputProps={{
                                        style: {
                                            height: "12px",
                                            width: "400px"
                                        }
                                    }}
                                    //@ts-ignore
                                    onChange={(e) => setFaculty({...faculty, city: e.target.value})}
                                />
                            </div>
                        </div>
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            flexDirection: "row",
                            gap: "3%",
                            marginTop: "1%",
                            width: "74%"
                        }}>
                            <div style={{display: "flex", flexDirection: "column", width: "48%"}}>
                                <InputLabel style={{color: "#858585", fontSize: 14, fontWeight: "bold"}}>Država:
                                    *</InputLabel>
                                <TextField
                                    margin="normal"
                                    required
                                    value={faculty?.country}
                                    id="country"
                                    type="country"
                                    inputProps={{
                                        style: {
                                            height: "12px",
                                            width: "400px"
                                        }
                                    }}
                                    //@ts-ignore
                                    onChange={(e) => setFaculty({...faculty, country: e.target.value})}
                                />
                            </div>
                            <div style={{display: "flex", flexDirection: "column", width: "49%"}}>
                                <InputLabel style={{color: "#858585", fontSize: 14, fontWeight: "bold"}}>Broj telefona:
                                    *</InputLabel>
                                <TextField
                                    margin="normal"
                                    required
                                    value={faculty?.phoneNumber}
                                    id="phone"
                                    type="phone"
                                    inputProps={{
                                        style: {
                                            height: "12px",
                                            width: "400px"
                                        }
                                    }}
                                    //@ts-ignore
                                    onChange={(e) => setFaculty({...faculty, phoneNumber: e.target.value})}
                                />
                            </div>
                        </div>
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            flexDirection: "row",
                            gap: "3%",
                            marginTop: "1%",
                            width: "74%"
                        }}>
                            <div style={{display: "flex", flexDirection: "column", width: "48%"}}>
                                <InputLabel style={{color: "#858585", fontSize: 14, fontWeight: "bold"}}>E-mail:
                                    *</InputLabel>
                                <TextField
                                    margin="normal"
                                    required
                                    value={faculty?.email}
                                    id="email"
                                    type="email"
                                    inputProps={{
                                        style: {
                                            height: "12px",
                                            width: "400px"
                                        }
                                    }}
                                    //@ts-ignore
                                    onChange={(e) => setFaculty({...faculty, email: e.target.value})}
                                />
                            </div>
                            <div style={{display: "flex", flexDirection: "column", width: "49%"}}>
                                <InputLabel style={{color: "#858585", fontSize: 14, fontWeight: "bold"}}>Web sajt:
                                    *</InputLabel>
                                <TextField
                                    margin="normal"
                                    required
                                    value={faculty?.website}
                                    id="website"
                                    type="website"
                                    inputProps={{
                                        style: {
                                            height: "12px",
                                            width: "400px"
                                        }
                                    }}
                                    //@ts-ignore
                                    onChange={(e) => setFaculty({...faculty, website: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{display: "flex", flexDirection: "row", gap: "3%", marginLeft: "86%", marginTop: "0%"}}>
                    <Link to={`/details/${faculty?.id}`} style={{textDecoration: 'none'}}>
                        <Button>Poništi</Button>
                    </Link>
                    <Button onClick={updateButtonClicked}>Sačuvaj</Button>
                </div>
            </div>
        </>
    )
}

export default EditGeneralInfo;