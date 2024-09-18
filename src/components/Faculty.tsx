import * as React from 'react';
import {useEffect, useState} from 'react';
import {
    Box,
    Button,
    Checkbox,
    FormControl,
    Grid,
    ListItem,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Select,
    SelectChangeEvent,
    Snackbar,
    TextField,
    Typography
} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";
import {CreateFacultyRequest} from "../api/faculty/faculty";
import {getAllCountries, getAllFaculties, getAllFacultiesByKeyword} from "../api/faculty/facultyApi";
import {CreateProfessionRequest} from "../api/profession/profession";
import {getAllProfessions} from "../api/profession/professionApi";
import "./details.css";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {hasRole} from "../token/token";
import {Roles} from "../constants/constants";
import {StyledMenu} from "./FacultyDetails";
import {DeleteOutline, UpdateOutlined} from "@mui/icons-material";
import axiosService from "../axios/axiosService";
import {backendUrl, paths} from "../constants/urlConstants";
import {useSnackbarHelper} from "../util/toastUtil";
import AlertDialog from "./dialogs/AlertDialog";
import searchImage from "../assets/searchFile.png";
import {FaLocationDot} from "react-icons/fa6";
import {FaPhone} from "react-icons/fa";
import ControlPointIcon from "@mui/icons-material/ControlPoint";

type CountryElement = {
    country: String;
    isChecked: boolean;
}

const ITEM_HEIGHT = 38;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};


function Faculty() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);
    const [textFilter, setTextFilter] = useState("");
    const [keywords, setKeywords] = useState("");
    const [countriesFilter, setCountriesFilter] = useState<Array<CountryElement>>([]);
    const [faculties, setFaculties] = useState<Array<CreateFacultyRequest>>([]);
    const [professions, setProfessions] = useState<Array<CreateProfessionRequest>>([]);
    const [facultyFilter, setFacultyFilter] = useState<Array<CreateFacultyRequest>>([]);
    const [facultyFilterAndSearch, setFacultyFilterAndSearch] = useState<Array<CreateFacultyRequest>>([]);
    const [filterByKeywords, setFilterByKeywords] = useState<Array<CreateFacultyRequest>>([]);
    const [countries, setCountries] = useState<Array<String>>([]);
    const [citiesFilter, setCitiesFilter] = useState<Array<String>>([]);
    const [filter, setFilter] = useState(false);
    const [personName, setPersonName] = React.useState<string[]>([]);
    const [isCityFieldEmpty, setIsCityFieldEmpty] = useState(true);
    const handleClickVariant = useSnackbarHelper();
    const [open, setOpen] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [selectedFaculty, setSelectedFaculty] = useState<CreateFacultyRequest>();
    const [facultyIdForDelete, setFacultyIdForDelete] = useState<number | undefined>(-1);
    const [facultyName, setFacultyName] = useState<string | undefined>("");
    const [openAddFacultyPopup, setOpenFacultyPopup] = useState(false);

    const handleCloseSnackbar = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
    };

    const handleChange = (event: SelectChangeEvent<typeof personName>) => {
        const {
            target: {value},
        } = event;
        setPersonName(
            typeof value === 'string' ? value.split(',') : value,
        );

        console.log(personName.length);
    };

    useEffect(() => {
        const hasAdminRole = hasRole(Roles.ADMIN);
        if (hasAdminRole) {
            setIsAdmin(hasAdminRole);
        }
    }, [])


    useEffect(() => {
        let countries: String[] = [];
        countriesFilter.forEach(element => {
            if (element.isChecked) {
                countries = [element.country, ...countries];
            }
        });

        let cities: String[] = [];
        faculties.filter(value => countries.includes(value.country)).forEach(element => {
                if (!cities.includes(element.city)) {
                    cities = [...cities, element.city];
                }
            }
        );

        if (countries.length !== 0 && personName.length === 0) {
            setFacultyFilter(faculties.filter(value => countries.includes(value.country)));
        } else if (countries.length === 0) {
            setFacultyFilter(faculties);
        } else if (personName.length !== 0) {
            setFacultyFilter(faculties.filter(value => personName.includes(value.city)));
        }

        if (cities.length === 0) {
            setIsCityFieldEmpty(true);
        } else {
            setIsCityFieldEmpty(false);
        }

        setCitiesFilter(cities);

    }, [countriesFilter, personName])


    useEffect(() => {
        const getProfessions = async () => {
            const professionsRes = await getAllProfessions();
            setProfessions(professionsRes.data);
        }
        getProfessions();
        const getFaculties = async () => {
            const facultiesRes = await getAllFaculties();
            setFaculties(facultiesRes.data);
        }
        getFaculties();
        const getCountries = async () => {
            const countriesRes = await getAllCountries();
            setCountries(countriesRes.data);
        }
        getCountries();
    }, [])


    useEffect(() => {
        let countryArray: CountryElement[] = countries.map(country => {
            return {country: country, isChecked: false};
        })
        setCountriesFilter(countryArray);
    }, [countries])

    useEffect(() => {
        setFacultyFilterAndSearch(getFilteredFaculties);
        setFilterByKeywords(getFilteredFaculties);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [textFilter, facultyFilter]);


    function getFilteredFaculties(): CreateFacultyRequest[] {
        if (textFilter.trim().length === 0)
            return facultyFilter;
        return facultyFilter.filter(fax => (fax.name.toUpperCase().startsWith(textFilter.toUpperCase().trim())));

    }

    async function findFilteredFacultiesByKeywords() {
        const keywordsArray = keywords.split(",").map(keyword => keyword.trim());
        const res = await getAllFacultiesByKeyword(keywordsArray);

        const result = facultyFilterAndSearch.filter(faculty =>
            res.data.some((f: CreateFacultyRequest) => f.name === faculty.name)
        );

        if (result.length !== 0) {
            setFilterByKeywords(result);
        } else {
            if (keywords !== "") {
                setFilterByKeywords([]);
            } else {
                setFilterByKeywords(facultyFilterAndSearch);
            }
        }


    }

    const handleEditClick = () => {
        navigate(`/edit/general/${selectedFaculty?.id}`);
    };

    useEffect(() => {
        if (open) {
            setFacultyName(selectedFaculty?.name);
            setFacultyIdForDelete(selectedFaculty?.id);
        }
    }, [open, selectedFaculty])

    function handleFilter() {
        setFilter(!filter);
    }


    const deleteUniversity = (num: number | undefined) => {
        try {
            axiosService(true).delete(`${backendUrl.FACULTY_URL}/${num}`);
            navigate(paths.FACULTIES);
            setAnchorEl(null);
            handleCloseDialog();
            setFaculties(faculties.filter(fac => fac.id !== num));
            setFacultyFilter(facultyFilter.filter(fac => fac.id !== num));
            setFilterByKeywords(filterByKeywords.filter(fac => fac.id !== num));
            handleClickVariant('success', {
                vertical: "top",
                horizontal: "right"
            }, "Fakultet je uspješno uklonjen!")();
        } catch (exception) {
            handleClickVariant('error', {vertical: "top", horizontal: "right"}, "Došlo je do greške!")();
        }
    }

    const handleCountryCheckBox = (countryEl: CountryElement) => {
        let newCountryElement = {...countryEl, isChecked: !countryEl.isChecked};
        setCountriesFilter(countriesFilter.map((element) => element.country === countryEl.country ? newCountryElement : element));
    }

    function handleClick(event: any) {
        if (anchorEl !== event.currentTarget) {
            setAnchorEl(event.currentTarget);
        }
        const facultyId = event.currentTarget.getAttribute('data-faculty-id');
        const id = parseInt(facultyId, 10);
        const selectedFaculty = faculties.find(faculty => faculty.id === id);

        if (selectedFaculty) {
            setSelectedFaculty(selectedFaculty);
        }
    }

    function handleClose() {
        setAnchorEl(null);
    }

    function formatName(name: string) {
        return name.toLowerCase().replace(/ /g, "-");
    }

    return (
        <div style={{width: "100%"}}>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={2000}
                anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                onClose={handleCloseSnackbar}
            />
            <div style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: "1%"
            }}>
                <p style={{
                    fontSize: 17,
                    color: "rgba(55,79,121,0.88)",
                    fontWeight: "bold",
                    fontFamily: "openSans"
                }}>Fakulteti</p>
                {isAdmin &&
                    <ControlPointIcon onClick={() => navigate(paths.INSERT_FACULTY)}
                                      style={{
                                          color: "rgba(55,79,121,0.88)",
                                          marginLeft: "0.5%",
                                          width: "20px",
                                          height: "20px",
                                          cursor: "pointer"
                                      }}/>
                }
            </div>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: "72px",
                    height: filter ? 'auto' : 'auto',
                    backgroundColor: 'white',
                    width: '97%',
                    marginBottom: '1.2%',
                    boxShadow: '5px 5px 20px 3px rgba(0,0,0,.08)',
                    padding: '1rem'
                }}
            >
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={4}>
                        <TextField
                            id="search-fax-id"
                            fullWidth
                            label="Pretraži po nazivu..."
                            onChange={e => setTextFilter(e.target.value)}
                            size="small"
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12} md={5}>
                        <TextField
                            id="search-fax-id"
                            fullWidth
                            onChange={e => setKeywords(e.target.value)}
                            label="Pronađi po zvanjima ili užim oblastima..."
                            size="small"
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={6} md={1.5}>
                        <Button
                            fullWidth
                            style={{
                                backgroundColor: 'rgba(52,77,157,0.76)',
                                color: 'white',
                                height: '32px',
                                fontSize: '12px',
                                fontWeight: 700,
                                textTransform: 'initial',
                            }}
                            onClick={findFilteredFacultiesByKeywords}
                        >
                            Pronađi
                        </Button>
                    </Grid>
                    <Grid item xs={6} md={1.5}>
                        <Button
                            fullWidth
                            style={{
                                backgroundColor: 'rgba(116,120,141,0.94)',
                                color: 'white',
                                height: '32px',
                                fontSize: '12px',
                                fontWeight: 700,
                                textTransform: 'initial',
                            }}
                            onClick={handleFilter}
                        >
                            Filter
                        </Button>
                    </Grid>
                </Grid>

                {filter && (
                    <Grid container spacing={2} marginTop={2}>
                        <Grid item xs={12} md={6}>
                            <Box>
                                <Typography variant="subtitle2" fontWeight="bold" marginBottom={1}>
                                    Države
                                </Typography>
                                <Box
                                    sx={{
                                        minWidth: "40%",
                                        display: 'flex',
                                        flexDirection: "row",
                                        flexWrap: 'nowrap',
                                    }}
                                >
                                    {countriesFilter.map((countryFilter, index) => (
                                        <Grid item key={index} sx={{ display: 'flex', alignItems: 'center', margin: '12px 21px' }}>
                                            <Checkbox
                                                checked={countryFilter.isChecked}
                                                edge="start"
                                                size="small"
                                                onChange={() => handleCountryCheckBox(countryFilter)}
                                            />
                                            <ListItemText primary={countryFilter.country} />
                                        </Grid>
                                    ))}
                                </Box>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Box>
                                <Typography variant="subtitle2" fontWeight="bold" marginBottom={1}>
                                    Gradovi
                                </Typography>
                                <FormControl fullWidth style={{marginTop: 15}}>
                                    <Select
                                        multiple
                                        displayEmpty
                                        value={personName}
                                        size="small"
                                        onChange={handleChange}
                                        input={<OutlinedInput/>}
                                        renderValue={(selected) => {
                                            if (selected.length === 0 || countries.length === 0) {
                                                return <span
                                                    style={{color: 'rgba(0, 0, 0, 0.6)'}}>Izaberi gradove</span>;
                                            }
                                            return !isCityFieldEmpty ? selected.join(', ') :
                                                <span style={{color: 'rgba(0, 0, 0, 0.6)'}}>Izaberi gradove</span>;
                                        }}
                                        MenuProps={MenuProps}
                                        inputProps={{'aria-label': 'Without label'}}
                                    >
                                        <MenuItem disabled value="">
                                            <span>Izaberi gradove</span>
                                        </MenuItem>
                                        {citiesFilter.map((name, index) => (
                                            <MenuItem key={index} value={name.toString()}>
                                                {name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                        </Grid>
                    </Grid>
                )}
            </Box>
            {professions.map((profession: any) => {
                const hasMatchingFax = filterByKeywords.some(fax => fax.classification.id === profession.id);
                return (
                    <div key={profession.id}>
                        {hasMatchingFax && (
                            <p style={{
                                fontSize: 17,
                                color: "rgba(55,79,121,0.88)",
                                fontWeight: "bold",
                                fontFamily: "openSans",
                                marginBottom: "2.5%"
                            }}>{profession.name}</p>
                        )}
                        <div style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "2.5%",
                            justifyContent: "flex-start",
                            backgroundColor: "#f8f8fb"
                        }}>
                            {filterByKeywords.filter((fax) => fax.classification.id === profession.id).map((faculty: any) => {
                                const formattedName = formatName(faculty.name);
                                const formattedCity = formatName(faculty.city);
                                const logoPath = `/images/${formattedName}-${formattedCity}.jpg`;
                                const defaultLogoPath = "/images/university.png";
                                return (
                                    <div key={faculty.id} className="faculty-card">
                                        <div className="faculty-header">
                                            <div style={{flexGrow: 1, marginRight: '20px'}}>
                                                <img src={logoPath} style={{maxWidth: "20%", height: "auto"}}
                                                     onError={(e) => e.currentTarget.src = defaultLogoPath}></img>
                                            </div>
                                            {isAdmin &&
                                                <div className="icon-container1">
                                                    <div className="icon-circle">
                                                        <MoreVertIcon data-faculty-id={faculty?.id}
                                                                      style={{color: "#727272"}} onClick={handleClick}/>
                                                    </div>
                                                </div>
                                            }
                                            {isAdmin &&
                                                <StyledMenu
                                                    id="demo-customized-menu"
                                                    MenuListProps={{
                                                        'aria-labelledby': 'demo-customized-button',
                                                    }}
                                                    anchorEl={anchorEl}
                                                    key={faculty.id}
                                                    keepMounted
                                                    open={Boolean(anchorEl)}
                                                    onClose={handleClose}
                                                >
                                                    <MenuItem
                                                        onClick={() => {
                                                            handleClose();
                                                            handleEditClick();
                                                        }}
                                                    ><UpdateOutlined/>Edit</MenuItem>
                                                    <MenuItem onClick={() => {
                                                        handleClose();
                                                        handleClickOpen();
                                                    }}><DeleteOutline/>Delete</MenuItem>
                                                </StyledMenu>
                                            }
                                        </div>
                                        <div>
                                            <p className="header-name">{faculty.name}</p>
                                            <div className="grid-container">
                                                <Typography style={{
                                                    fontSize: 14,
                                                    color: "#6E6E6E",
                                                    marginRight: "2%",
                                                    fontFamily: "openSans",
                                                }}>
                                                    <FaLocationDot
                                                        style={{marginRight: "1.5%"}}/>{faculty.address}, {faculty.city},
                                                    {" " + faculty.postalCode}
                                                </Typography>
                                                <Typography style={{
                                                    fontSize: 13,
                                                    color: "#6E6E6E",
                                                    marginTop: "1%",
                                                    fontFamily: "openSans",
                                                }}><FaPhone style={{marginRight: "1.5%"}}/>
                                                    {faculty.phoneNumber}
                                                </Typography>
                                            </div>
                                        </div>
                                        <Link to={`/details/${faculty.id}`} style={{textDecoration: 'none'}}>
                                            <Button style={{
                                                backgroundColor: "rgba(138,189,138,0.93)",
                                                color: "white",
                                                height: "32px",
                                                width: "140px",
                                                marginLeft: "5%",
                                                fontSize: "11px",
                                                fontWeight: 700,
                                                textTransform: 'initial',
                                                marginTop: "7%",
                                                marginBottom: "7%"
                                            }}
                                            >Pogledaj detalje</Button>
                                        </Link>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )
            })}
            {filterByKeywords.length === 0 && (
                <div style={{
                    display: 'flex',
                    flexDirection: "column",
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '29vh',
                    marginTop: "7%"
                }}>
                    <img src={searchImage} alt="No departments available" style={{maxHeight: "auto", maxWidth: "18%"}}/>
                    <p style={{marginTop: "-1%", marginLeft: "1%"}}>Nema rezultata za traženi upit!</p>
                </div>
            )}
            <AlertDialog open={open} setOpen={setOpen} handleClickOpen={handleClickOpen}
                         handleClose={handleCloseDialog}
                         handleSave={() => deleteUniversity(facultyIdForDelete)}
                         dialogContent={"Da li si siguran/na da želiš trajno obrisati " + facultyName + "?"}
                         dialogTitle={"Brisanje fakulteta"}/>
        </div>
    );
}

export default Faculty;