import * as React from 'react';
import {useEffect, useState} from 'react';
import {
    Button,
    Checkbox,
    FormControl,
    ListItem,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Select,
    SelectChangeEvent,
    TextField,
    Theme,
    Typography,
    useTheme
} from "@mui/material";
import {FaLocationDot} from "react-icons/fa6";
import {Link, useNavigate} from "react-router-dom";
import {CreateFacultyRequest} from "../api/faculty/faculty";
import {getAllCountries, getAllFaculties, getAllFacultiesByKeyword} from "../api/faculty/facultyApi";
import {CreateProfessionRequest} from "../api/profession/profession";
import {getAllProfessions} from "../api/profession/professionApi";

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

const names = [
    'Oliver Hansen',
    'Van Henry',
    'April Tucker',
    'Ralph Hubbard',
    'Omar Alexander',
    'Carlos Abbott',
    'Miriam Wagner',
    'Bradley Wilkerson',
    'Virginia Andrews',
    'Kelly Snyder',
];

function getStyles(name: string, personName: readonly string[], theme: Theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}


function Faculty() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const navigate = useNavigate();
    const theme = useTheme();
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

        if (countries.length != 0 && personName.length === 0) {
            setFacultyFilter(faculties.filter(value => countries.includes(value.country)));
        } else if (countries.length === 0) {
            setFacultyFilter(faculties);
        } else if (personName.length != 0) {
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
        console.log(result)

        console.log(keywords);
        if (result.length !== 0) {
            setFilterByKeywords(result);
        }
        else {
            if(keywords !== ""){
                setFilterByKeywords([]);
            }
            else {
                setFilterByKeywords(facultyFilterAndSearch);
            }
        }


    }

    function handleFilter() {
        setFilter(!filter);
    }

    const handleCountryCheckBox = (countryEl: CountryElement) => {
        let newCountryElement = {...countryEl, isChecked: !countryEl.isChecked};
        setCountriesFilter(countriesFilter.map((element) => element.country === countryEl.country ? newCountryElement : element));
    }

    function handleClick(event: any) {
        if (anchorEl !== event.currentTarget) {
            setAnchorEl(event.currentTarget);
        }
    }

    function handleClose() {
        setAnchorEl(null);
    }

    return (
        <div style={{paddingLeft: "35px", width: "100%"}}>
            <p style={{
                fontSize: 17,
                color: "rgba(55,79,121,0.88)",
                fontWeight: "bold",
                marginTop: "1.5%",
                fontFamily: "openSans"
            }}>Fakulteti</p>
            <div style={{
                display: "flex",
                flexDirection: "column",
                height: filter ? "148px" : "72px",
                backgroundColor: "white",
                width: "91.2%",
                marginBottom: "1.2%",
                boxShadow: "5px 5px 20px 3px rgba(0,0,0,.08)",
            }}>
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    minHeight: "39x",
                    marginLeft: "1.3%",
                    height: "39px",
                }}>
                    <TextField
                        id="search-fax-id"
                        style={{height: "10px", width: "31%"}}
                        // onChange={e => setUserName(e.target.value)}
                        label={"Pretraži po nazivu..."}
                        onChange={e => setTextFilter(e.target.value)}
                        size="small"
                        variant="outlined"
                    />
                    <TextField
                        id="search-fax-id"
                        style={{marginLeft: "15px", height: "10px", width: "40%"}}
                        onChange={e => setKeywords(e.target.value)}
                        label={"Pronađi po zvanjima ili užim oblastima..."}
                        size="small"
                        variant="outlined"
                    />
                    <Button style={{
                        backgroundColor: "rgba(52,77,157,0.76)",
                        color: "white",
                        marginLeft: "2%",
                        marginTop: "29.2px",
                        height: "32px",
                        width: "110px",
                        fontSize: "12px",
                        fontWeight: 700,
                        textTransform: 'initial',
                        // textAlign: "center",
                    }}
                            onClick={findFilteredFacultiesByKeywords}
                    >Pronađi</Button>
                    <Button style={{
                        backgroundColor: "rgba(116,120,141,0.94)",
                        marginLeft: "0.7%",
                        color: "white",
                        marginTop: "29.2px",
                        height: "32px",
                        width: "110px",
                        fontSize: "12px",
                        fontWeight: 700,
                        textTransform: 'initial',
                        // textAlign: "center",
                    }}
                            onClick={() => handleFilter()}
                    >Filter</Button>
                </div>
                {filter &&
                    <div style={{display: "flex", flexDirection: "row", marginTop: "1%", marginLeft: "1%"}}>
                        <div style={{display: "flex", flexDirection: "column"}}>
                            <p style={{
                                fontSize: 15,
                                color: "rgba(0,0,0,0.74)",
                                fontWeight: "bold",
                                marginLeft: "3.5%",
                                paddingTop: "0.3%",
                                fontFamily: "openSans"
                            }}>Države</p>
                            <div style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-around",
                                alignItems: "center",
                                width: "100%",
                                marginTop: "-6%",
                                marginLeft: "-3.2%"
                            }}>
                                {countriesFilter.map((countryFilter: any) => (
                                    <ListItem style={{flexBasis: 'auto', margin: '0 8px', whiteSpace: 'nowrap'}}>
                                        <Checkbox checked={countryFilter.isChecked} edge="start" size="small"
                                                  onChange={() => handleCountryCheckBox(countryFilter)}/>
                                        <ListItemText className="list-text-export" primary={countryFilter.country}/>
                                    </ListItem>
                                ))}
                            </div>

                        </div>
                        <div style={{display: "flex", flexDirection: "column"}}>
                            <p style={{
                                fontSize: 15,
                                color: "rgba(0,0,0,0.74)",
                                fontWeight: "bold",
                                marginLeft: "48%",
                                fontFamily: "openSans"
                            }}>Gradovi</p>
                            <FormControl sx={{m: 1, width: 260, mt: -1, ml: 29}}>
                                <Select
                                    multiple
                                    displayEmpty
                                    value={personName}
                                    size="small"
                                    onChange={handleChange}
                                    input={<OutlinedInput/>}
                                    renderValue={(selected) => {
                                        if (selected.length === 0 || countries.length === 0) {
                                            return <span style={{color: "rgba(0, 0, 0, 0.6)"}}>Izaberi gradove</span>;
                                        }

                                        return !isCityFieldEmpty ? selected.join(', ') :
                                            <span style={{color: "rgba(0, 0, 0, 0.6)"}}>Izaberi gradove</span>;
                                    }}
                                    MenuProps={MenuProps}
                                    inputProps={{'aria-label': 'Without label'}}
                                >
                                    <MenuItem disabled value="">
                                        <span>Izaberi gradove</span>
                                    </MenuItem>
                                    {citiesFilter.map((name) => (
                                        <MenuItem
                                            // key={name}
                                            value={name.toString()}
                                            // style={getStyles(name, personName, theme)}
                                        >
                                            {name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                    </div>
                }
            </div>
            {professions.map((profession: any) => {
                const hasMatchingFax = filterByKeywords.some(fax => fax.classification.id === profession.id);
                return (
                    <div>
                        {hasMatchingFax && (
                            <p style={{
                                fontSize: 17,
                                color: "rgba(55,79,121,0.88)",
                                fontWeight: "bold",
                                marginLeft: "5%",
                                fontFamily: "openSans",
                                marginBottom: "2.5%"
                            }}>{profession.name}</p>
                        )}
                        <div style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "2.5%",
                            justifyContent: "flex-start",
                            paddingLeft: "4.8%",
                            backgroundColor: "#f8f8fb"
                        }}>
                            {filterByKeywords.filter((fax) => fax.classification.id === profession.id).map((faculty: any) => {
                                return (
                                    <div style={{
                                        width: "22.5%",
                                        minWidth: "22.5%",
                                        minHeight: "26%",
                                        marginBottom: "2%",
                                        backgroundColor: "#ffffff",
                                        boxShadow: "5px 5px 20px 3px rgba(0,0,0,.08)"
                                    }}
                                    >
                                        <div style={{height: "100px"}}>
                                            <p style={{
                                                fontSize: 15,
                                                color: "rgba(0,0,0,0.74)",
                                                fontWeight: "bold",
                                                marginLeft: "7%",
                                                marginTop: "29%",
                                                fontFamily: "openSans"
                                            }}>{faculty.name}</p>
                                            <Typography style={{
                                                fontSize: 13,
                                                color: "#6E6E6E",
                                                marginLeft: "7%",
                                                marginRight: "2%",
                                                fontFamily: "openSans",
                                            }}>
                                                {faculty.address}
                                                <FaLocationDot
                                                    style={{marginLeft: "5%", marginRight: "1.5%"}}/>{faculty.city},
                                                {" " + faculty.postalCode}
                                            </Typography>
                                            <Typography style={{
                                                fontSize: 13,
                                                color: "#6E6E6E",
                                                marginTop: "1%",
                                                marginLeft: "7%",
                                                fontFamily: "openSans",
                                            }}>
                                                Telefon: {faculty.phoneNumber}
                                            </Typography>
                                        </div>
                                        <Link to={`/details/${faculty.id}`} style={{textDecoration: 'none'}}>
                                            <Button style={{
                                                backgroundColor: "rgba(138,189,138,0.93)",
                                                color: "white",
                                                height: "32px",
                                                width: "140px",
                                                marginLeft: "7%",
                                                fontSize: "11px",
                                                fontWeight: 700,
                                                textTransform: 'initial',
                                                // textAlign: "center",
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
        </div>
    );
}

export default Faculty;