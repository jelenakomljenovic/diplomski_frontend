import * as React from 'react';
import {SyntheticEvent, useEffect, useState} from 'react';
import {AutocompleteValue, Box, Button, Divider, TextField} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import {CreateFacultyRequest} from "../api/faculty/faculty";
import {getUniversityById} from "../api/faculty/facultyApi";
import axiosService from "../axios/axiosService";
import {backendUrl, paths} from "../constants/urlConstants";
import {useSnackbarHelper} from "../util/toastUtil";
import {getAllProfessions} from "../api/profession/professionApi";
import {AutocompleteComponent} from "../dialog/AutocompleteComponent";
import {BiSolidMessageSquareEdit} from "react-icons/bi";

type Profession = {
    id: number,
    name: string
}

function EditGeneralInfo() {
    let {id} = useParams();
    const [faculty, setFaculty] = useState<CreateFacultyRequest>();
    const [updatedFaculty, setUpdatedFaculty] = useState<CreateFacultyRequest>();
    let numId = 0;
    const handleClickVariant = useSnackbarHelper();
    const navigate = useNavigate();
    const [professions, setProfessions] = useState<Array<Profession>>([]);
    const [selectedProfession, setSelectedProfession] = useState<Profession | null>(null);
    const [formattedName, setFormattedName] = useState("");
    const defaultLogoPath = "/images/university.png";
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string>(`/images/university.png`);
    const [oldName, setOldName] = useState("");
    const [oldCity, setOldCity] = useState("");

    useEffect(() => {
        const fetchProfessions = async () => {
            try {
                const professionsRes = await getAllProfessions();
                setProfessions(professionsRes.data);
            } catch (error) {
                console.error('Error fetching professions:', error);
            }
        };

        fetchProfessions();


    }, []);

    function formatName(name: any) {
        return name.toLowerCase().replace(/ /g, "-");
    }


    useEffect(() => {
        if (id !== undefined) {
            numId = parseInt(id, 10);
        }
        const getFaculty = async () => {
            const facultyRes = await getUniversityById(numId);
            setFaculty(facultyRes.data);
            const formattedName = formatName(facultyRes.data.name);
            const formattedCity = formatName(facultyRes.data.city);
            setOldName(facultyRes.data.name);
            setOldCity(facultyRes.data.city);
            const logoPath = `/images/${formattedName}-${formattedCity}.jpg`;
            setUpdatedFaculty(facultyRes.data);
            setImageUrl(logoPath);

            const category = professions.find(
                (profession: Profession) => profession.id === facultyRes.data.classification.id
            );
            setSelectedProfession(category || null);
        }
        getFaculty();
    }, [id, professions]);

    const validateFields = (): boolean => {
        if (!faculty?.name || !faculty?.address || !faculty?.city || !faculty?.country ||
            !faculty?.phoneNumber || !faculty?.email || !faculty?.website || !selectedProfession) {
            handleClickVariant('error', {vertical: 'top', horizontal: 'right'}, "Sva polja su obavezna!")();
            return false;
        }
        return true;
    }


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);

            const newImageUrl = URL.createObjectURL(file);
            setImageUrl(newImageUrl);
        }
    };

    const uploadImage = async (id: any) => {
        if (selectedFile) {
            const formData = new FormData();
            formData.append('file', selectedFile);

            try {
                await axiosService(true).post(`${backendUrl.FACULTY_URL}/${id}/uploadImage`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                const formattedName = faculty?.name.toLowerCase().replace(/\s+/g, '-');
                const formattedCity = faculty?.city.toLowerCase().replace(/\s+/g, '-');
                const fileExtension = selectedFile.type.split('/')[1];
                const newImageUrl = `/images/${formattedName}-${formattedCity}.${fileExtension}`;

                setImageUrl(newImageUrl);
            } catch (error) {
                handleClickVariant('error', {vertical: 'top', horizontal: 'right'}, "Greška pri čuvanju slike!")();
            }
        } else {
            try {
                await axiosService(true).post(`${backendUrl.FACULTY_URL}/updateImage`, {
                    oldName: oldName,
                    oldCity: oldCity,
                    newName: faculty?.name,
                    newCity: faculty?.city
                });

            } catch (error) {
                handleClickVariant('error', {vertical: 'top', horizontal: 'right'}, "Greška pri izmjeni slike!")();
            }
        }
    };

    const updateButtonClicked = () => {
        if (!validateFields()) {
            return;
        }

        axiosService(true).put(`${backendUrl.FACULTY_URL}/update/${faculty?.id}`, {
            id: faculty?.id,
            name: faculty?.name,
            classification: selectedProfession,
            address: faculty?.address,
            city: faculty?.city,
            country: faculty?.country,
            phoneNumber: faculty?.phoneNumber,
            website: faculty?.website,
            email: faculty?.email,
        }).then(response => {
            navigate(paths.FACULTIES);
            uploadImage(faculty?.id);
            handleClickVariant('success', {vertical: 'top', horizontal: 'right'}, "Uspješno ažuriranje!")();
        }).catch(error => {
            handleClickVariant('error', {
                vertical: 'top',
                horizontal: 'right'
            }, "Molimo unesite ispravnu adresu!")();
        });

    }

    const handleChange = (event: SyntheticEvent, value: AutocompleteValue<any, any, any, any>) => {
        setSelectedProfession(value);
    }

    return (
        <>
            <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", paddingTop: 5}}>
                <Box sx={{
                    backgroundColor: "white",
                    border: "1px solid lightgray",
                    height: "auto",
                    width: "95%",
                    minHeight: "72vh",
                    boxShadow: "5px 5px 20px 3px rgba(0,0,0,.08)",
                    paddingBottom: "20px",
                    boxSizing: "border-box"
                }}>
                    <div style={{maxHeight: "45px", display: "flex", flexDirection: "column", marginBottom: "1.5%"}}>
                        <p style={{
                            fontSize: 15,
                            paddingTop: "2px",
                            color: "#3696ab",
                            fontWeight: "bold",
                            marginLeft: "1%",
                            fontFamily: "openSans"
                        }}>Izmijeni informacije</p>
                        <Divider style={{
                            backgroundColor: "rgba(84,90,109,0.13)",
                            width: "100%",
                            height: "0.1vh",
                        }}/>
                    </div>
                    <div style={{display: "flex", flexDirection: "row"}}>
                        <img src={imageUrl} alt="University"
                             style={{
                                 pointerEvents: "none",
                                 maxHeight: "30%",
                                 height: "25%",
                                 width: "11%",
                                 marginLeft: "4%",
                                 marginTop: "1.5%"
                             }} onError={(e) => e.currentTarget.src = defaultLogoPath}/>
                        <label style={{cursor: "pointer", marginTop: "1.7%"}}>
                            <BiSolidMessageSquareEdit style={{height: 28, width: 28, color: "rgba(54,150,171,0.66)"}}/>
                            <input type="file" style={{display: "none"}} onChange={handleFileChange}/>
                        </label>

                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            marginLeft: "7%",
                            width: "70%",
                            maxWidth: "70%",
                            marginTop: "1%"
                        }}>
                            <Box sx={{display: "flex", gap: 2, alignItems: "center"}}>
                                <TextField
                                    label="Naziv"
                                    variant="outlined"
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    value={faculty?.name}
                                    margin="normal"
                                    required
                                    //@ts-ignore
                                    onChange={(e) => setFaculty({...faculty, name: e.target.value})}
                                />
                                <TextField
                                    label="Adresa"
                                    variant="outlined"
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    value={faculty?.address}
                                    margin="normal"
                                    required
                                    //@ts-ignore
                                    onChange={(e) => setFaculty({...faculty, address: e.target.value})}
                                />
                            </Box>
                            <Box sx={{display: "flex", gap: 2, alignItems: "center"}}>
                                <TextField
                                    label="Grad"
                                    variant="outlined"
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    value={faculty?.city}
                                    margin="normal"
                                    required
                                    //@ts-ignore
                                    onChange={(e) => setFaculty({...faculty, city: e.target.value})}
                                />
                                <TextField
                                    label="Država"
                                    variant="outlined"
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    value={faculty?.country}
                                    margin="normal"
                                    required
                                    //@ts-ignore
                                    onChange={(e) => setFaculty({...faculty, country: e.target.value})}
                                />
                            </Box>
                            <Box sx={{display: "flex", gap: 2, alignItems: "center"}}>
                                <TextField
                                    label="Broj telefona"
                                    variant="outlined"
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    value={faculty?.phoneNumber}
                                    margin="normal"
                                    required
                                    //@ts-ignore
                                    onChange={(e) => setFaculty({...faculty, phoneNumber: e.target.value})}
                                />
                                <TextField
                                    label="E-mail"
                                    variant="outlined"
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    value={faculty?.email}
                                    margin="normal"
                                    required
                                    //@ts-ignore
                                    onChange={(e) => setFaculty({...faculty, email: e.target.value})}
                                />
                            </Box>
                            <Box sx={{display: "flex", gap: 2, alignItems: "center"}}>
                                <TextField
                                    label="Web sajt"
                                    variant="outlined"
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    style={{maxWidth: "49.6%"}}
                                    value={faculty?.website}
                                    margin="normal"
                                    required
                                    //@ts-ignore
                                    onChange={(e) => setFaculty({...faculty, website: e.target.value})}
                                />
                                <AutocompleteComponent
                                    label="Kategorija"
                                    options={professions}
                                    defaultValue={selectedProfession}
                                    property="name"
                                    handleChange={handleChange}
                                    maxHeight={220}
                                    style={{width: "49.6%", marginTop: "0.7%"}}
                                />
                            </Box>
                            <Box sx={{display: "flex", justifyContent: "flex-end", gap: 2, marginTop: 5}}>
                                <Button onClick={() => updateButtonClicked()} style={{
                                    backgroundColor: "rgba(40,144,183,0.78)",
                                    color: "white",
                                }}>
                                    Sačuvaj
                                </Button>
                                <Button style={{
                                    backgroundColor: "rgba(110,106,106,0.62)",
                                    color: "white"
                                }} onClick={() => navigate(paths.FACULTIES)}>
                                    Poništi
                                </Button>
                            </Box>
                        </div>
                    </div>
                </Box>
            </Box>
        </>
    )
}

export default EditGeneralInfo;
