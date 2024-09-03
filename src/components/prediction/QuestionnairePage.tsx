import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    Container,
    Divider,
    FormControl,
    FormControlLabel,
    Grid,
    IconButton,
    MenuItem,
    Select,
    SelectChangeEvent,
    Snackbar,
    Step,
    StepLabel,
    Stepper,
    TextField,
    Typography
} from '@mui/material';
import {FaEnvelope, FaLink} from 'react-icons/fa';
import "./prediction.css";
import elearning from "../../assets/elearning.png";
import {
    getRecommendations,
    getResponsibilitiesByFaculties,
    getSkillsByFaculties,
    predict
} from "../../api/jobprofile/jobprofileApi";
import {
    drustveneNaukeOpcija1,
    drustveneNaukeOpcija2,
    prirodneNaukeOpcija1,
    prirodneNaukeOpcija2,
    tehnickeNaukeOpcija1,
    tehnickeNaukeOpcija2
} from "./options";
import {JobProfileRequest, JobProfileSkillsRequest} from "../../api/jobprofile/jobprofile";
import {BiSolidCloudDownload} from "react-icons/bi";
import {MdAttachEmail} from "react-icons/md";
import mapStyles from "../../styles/mapStyles";
import {GoogleMap, MarkerClustererF, MarkerF, useJsApiLoader} from "@react-google-maps/api";
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import {useSnackbarHelper} from "../../util/toastUtil";
import {getQuestions, updateQuestions} from "../../api/questions/question";
import {QuestionRequest} from "../../api/questions/questionData";
import {getAllByCity, getAllCities} from "../../api/faculty/facultyApi";
import {hasRole} from "../../token/token";
import {Roles} from "../../constants/constants";
import {CreateFacultyRequest} from "../../api/faculty/faculty";

const steps = ['Osnovne informacije', 'Obrazovanje', 'Oblasti interesovanja', 'Sposobnosti i vještine'];
const primarySchools = ['Gimnazija', 'Građevinska', 'Ekonomska', 'Elektrotehnička', 'Medicinska', 'Poljoprivredna', 'Tehnička', 'Tehnološka', 'Ugostiteljsko-trgovinsko-turistička', 'Muzička', 'Ostalo'];

interface FormValues {
    firstName: string;
    lastName: string;
    address: string;
    email: string;
    highSchool: string;
    interestFit: string;
    scienceInterest: string;
    additionalInterest: string;
}

interface Errors {
    firstName?: string;
    lastName?: string;
    address?: string;
    highSchool?: string;
    email?: string;
    interestFit?: string;
    scienceInterest?: string;
    additionalInterest?: string;
    responsibilities?: string;
    skills?: string;
}

const options = {
    styles: mapStyles,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
}


const mapContainerStyle = {
    width: "47vw",
    height: "43vh",
    top: "2%",
};

export default function QuestionnairePage() {
    const [formValues, setFormValues] = useState<FormValues>({
        firstName: '',
        lastName: '',
        address: '',
        email: '',
        highSchool: '',
        interestFit: '',
        scienceInterest: '',
        additionalInterest: ''
    });
    const [activeStep, setActiveStep] = useState(0);
    const [errors, setErrors] = useState<Errors>({});
    const [responsibilities1, setResponsibilities1] = useState<String[]>([]);
    const [skills1, setSkills1] = useState<String[]>([]);
    const [checkedItems, setCheckedItems] = useState<number[]>([]);
    const [checkedSkills, setCheckedSkills] = useState<number[]>([]);
    const [textForPrediction, setTextForPrediction] = useState("");
    const [zoom, setZoom] = useState(14);
    const [position, setPosition] = useState({lat: 44.772182, lng: 17.191000});
    const mapRef = React.useRef();
    const [selectedResponsibilitiesString, setSelectedResponsibilitiesString] = useState('');
    const [selectedSkillsString, setSelectedSkillsString] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [second, setSecond] = useState<string | null>(null);
    const [third, setThird] = useState<string | null>(null);
    const [fourth, setFourth] = useState<string | null>(null);
    const [universitiesByCity, setUniversitiesByCity] = useState<CreateFacultyRequest[]>([]);


    const [editLabelField, setEditLabelField] = useState(null);
    const [tempLabel, setTempLabel] = useState('');


    const [showEmailModal, setShowEmailModal] = useState(false);

    const handleClickVariant = useSnackbarHelper();
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handleCloseSnackbar = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackbar(false);
    };
    const [questions1, setQuestions1] = useState<QuestionRequest[]>([]);
    const [cities, setCities] = useState([]);
    const universitiesList: string[] = [];

    useEffect(() => {
        async function fetchCities() {
            try {
                const response = await getAllCities(["Bosna i Hercegovina", "Srbija", "Hrvatska"]);
                setCities(response.data);
            } catch (error) {
                console.error("Greška:", error);
            }
        }

        fetchCities();

        const hasAdminRole = hasRole(Roles.ADMIN);
        if (hasAdminRole) {
            setIsAdmin(hasAdminRole);
        }
    }, []);

    const handleEditLabelClick = (field: any, currentLabel: any) => {
        setEditLabelField(field);
        setTempLabel(currentLabel);
    };

    const handleSaveLabelClick = (fieldId: number) => {
        const question = questions1.find(q => q.id === fieldId);

        setQuestions1(prevQuestions =>
            prevQuestions.map(question =>
                question.id === fieldId
                    ? {...question, question: tempLabel}
                    : question
            )
        );
        const updateQuestionMethod = async () => {
            await updateQuestions(fieldId, {id: fieldId, question: tempLabel});
        }
        updateQuestionMethod();
        setEditLabelField(null);
    };

    const handleCancelLabelClick = () => {
        setEditLabelField(null);
        setTempLabel('');
    };

    const handleLabelChange = (event: any) => {
        setTempLabel(event.target.value);
    };


    const onMapLoad = React.useCallback((map: any) => {
        mapRef.current = map;
    }, []);


    const {isLoaded} = useJsApiLoader({
        googleMapsApiKey: "AIzaSyBx_S40CthbKWysq6WtSsMOF7-cg8ld9v4"
    });

    const setCoordinates = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function (position) {
                setPosition({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            });
        } else {
            console.log("Geolocation is not available in your browser.");
        }
    }

    useEffect(() => {
        setCoordinates();
        const getAllQuestions = async () => {
            const response = await getQuestions();
            setQuestions1(response.data);
        }
        getAllQuestions();

    }, []);


    const handleDownload = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/universities/download', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    firstName: formValues.firstName,
                    lastName: formValues.lastName,
                    address: formValues.address,
                    email: formValues.email,
                    abilities: selectedResponsibilitiesString,
                    skills: selectedSkillsString,
                    predictionResult: (second !== undefined && second !== null) ? textForPrediction + ", " + second : textForPrediction
                })
            });

            if (response.ok) {
                const blob = await response.blob();
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = 'university_results.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                handleClickVariant('success', {
                    vertical: "top",
                    horizontal: "right"
                }, "Dokument je uspješno preuzet!")();
            } else {
                console.error('Failed to download PDF');
            }
        } catch (error) {
            console.error('Error during the download:', error);
        }
    };

    const sendPdf = async () => {
        if (!formValues.email) {
            handleClickVariant('error', {vertical: "top", horizontal: "right"}, "Molimo unesi svoj e-mail!")();
            setShowEmailModal(true);
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/universities/send-pdf', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    to: formValues.email,
                    subject: "Rezultati predviđanja fakulteta",
                    firstName: formValues.firstName,
                    lastName: formValues.lastName,
                    address: formValues.address,
                    email: formValues.email,
                    abilities: selectedResponsibilitiesString,
                    skills: selectedSkillsString,
                    predictionResult: (second !== undefined && second !== null) ? textForPrediction + ", " + second : textForPrediction
                })
            });
            handleClickVariant('success', {vertical: "top", horizontal: "right"}, "E-mail je uspješno poslat!")();

        } catch (error) {
            handleClickVariant('error', {
                vertical: "top",
                horizontal: "right"
            }, "Došlo je do greške prilikom slanja e-maila!")();
        }
    };

    const handleModalClose = () => {
        setShowEmailModal(false);
        sendPdf();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });
        setErrors({
            ...errors,
            [name]: value ? '' : 'Ovo polje je obavezno!',
        });
    };

    const handleSelectChange = (e: SelectChangeEvent<string>) => {
        const {name, value} = e.target;
        setFormValues({
            ...formValues,
            highSchool: value,
        });
        setErrors({
            ...errors,
            highSchool: value ? '' : 'Ovo polje je obavezno!',
        });
    };

    const handleSelectChangeCity = (e: SelectChangeEvent<string>) => {
        const {name, value} = e.target;
        setFormValues({
            ...formValues,
            address: value,
        });
        setErrors({
            ...errors,
            address: value ? '' : 'Ovo polje je obavezno!',
        });
    };


    // For skills
    const handleCheckboxSkillsChange = (index: number) => {
        if (checkedSkills.includes(index)) {
            setCheckedSkills(checkedSkills.filter(item => item !== index));
        } else if (checkedSkills.length < 5) {
            setCheckedSkills([...checkedSkills, index]);
        }
    };

// For responsibilities
    const handleCheckboxResponsibilitiesChange = (index: number) => {
        if (checkedItems.includes(index)) {
            setCheckedItems(checkedItems.filter(item => item !== index));
        } else if (checkedItems.length < 7) {
            setCheckedItems([...checkedItems, index]);
        }
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues({
            ...formValues,
            interestFit: e.target.value,
        });
        setErrors({
            ...errors,
            interestFit: e.target.value ? '' : 'Ovo polje je obavezno!',
        });
    };

    const handleCheckbox1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues({
            ...formValues,
            scienceInterest: e.target.value,
        });
        setErrors({
            ...errors,
            scienceInterest: e.target.value ? '' : 'Ovo polje je obavezno!',
        });
    };

    const handleAdditionalInterestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues({
            ...formValues,
            additionalInterest: e.target.value,
        });
        setErrors({
            ...errors,
            additionalInterest: e.target.value ? '' : 'Ovo polje je obavezno!',
        });
    };

    const predictFaculty = async (text: string): Promise<string> => {
        try {
            const response = await predict(text);
            return response.data;
        } catch (error) {
            console.error('Error fetching job profile:', error);
            return '';
        }
    };

    const parseResults = (results: any) => {
        const data = results.data;
        let name1 = null;
        let highestProbability: number = -Infinity;
        const allResults: { name: string, prob: number }[] = [];

        if (!Array.isArray(data)) {
            console.error('Results data is not an array:', data);
            return;
        }

        data.forEach((result: any) => {
            if (typeof result !== 'string') {
                console.error('Result is not a string:', result);
                return;
            }

            const [name, probability] = result.split(' - ');
            const prob = parseFloat(probability);

            if (prob > highestProbability && prob > 0.5) {
                highestProbability = prob;
                name1 = name;
                setSecond(name);
            }


            if (prob > 0.1 && prob < 0.5) {
                allResults.push({name, prob});
            }
        });

        allResults.sort((a, b) => b.prob - a.prob);

        const filteredResults = allResults
            .filter(result => result.name !== second)
            .slice(0, 2);

        const [thirdResult, fourthResult] = filteredResults.map(result => result.name);
        setThird(thirdResult);
        setFourth(fourthResult);

        if (name1 !== undefined && name1 !== null)
            universitiesList.push(name1);

        if (thirdResult !== undefined && thirdResult !== null && fourthResult !== undefined && fourthResult !== null) {
            universitiesList.push(thirdResult);
            universitiesList.push(fourthResult);
        }

    };
    const [faculty, setFaculty] = useState<CreateFacultyRequest>();

    const handlePrediction = async (text: string) => {
        const result = await predictFaculty(text);
        const recommendations = await getRecommendations(result);

        parseResults(recommendations);
        setTextForPrediction(result);
        universitiesList.push(result);

        const resultByCity = await getAllByCity(universitiesList, formValues.address);
        setUniversitiesByCity(resultByCity.data);

        setFaculty(
            resultByCity.data.find(
                (university: CreateFacultyRequest) =>
                    university.name === result && university.city === formValues.address
            ) ||
            resultByCity.data.find(
                (university: CreateFacultyRequest) =>
                    university.name.toLowerCase().startsWith(result.substring(0, 5).toLowerCase()) &&
                    university.city === formValues.address
            )
        );
    };

    const handleNext = () => {
        const currentErrors = validateForm();
        if (Object.keys(currentErrors).length === 0) {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        } else {
            setErrors(currentErrors);
        }

    };

    const handleSubmit = () => {
        const selectedResponsibilities = checkedItems.map(index => responsibilities1[index]);
        const selectedSkills = checkedSkills.map(index => skills1[index]);

        const allSelected = [...selectedResponsibilities, ...selectedSkills].join(', ');

        const responsibilitiesString = selectedResponsibilities.join(', ');

        const skillsString = selectedSkills.join(', ');

        setSelectedResponsibilitiesString(responsibilitiesString);
        setSelectedSkillsString(skillsString);

        handlePrediction(allSelected);
        const currentErrors = validateForm();
        if (Object.keys(currentErrors).length === 0) {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        } else {
            setErrors(currentErrors);
        }

    }

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const validateEmail = (email: string): boolean => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    };

    const validateForm = () => {
        const newErrors: Errors = {};
        if (activeStep === 0) {
            if (!formValues.firstName) newErrors.firstName = 'Ovo polje je obavezno!';
            if (!formValues.lastName) newErrors.lastName = 'Ovo polje je obavezno!';
            if (!formValues.address) newErrors.address = 'Ovo polje je obavezno!';
            if (formValues.email && !validateEmail(formValues.email)) {
                newErrors.email = 'Unesite validnu e-mail adresu!';
            }
        } else if (activeStep === 1) {
            if (!formValues.highSchool) newErrors.highSchool = 'Ovo polje je obavezno!';
            if (!formValues.interestFit) newErrors.interestFit = 'Ovo polje je obavezno!';
        } else if (activeStep === 2) {
            if (!formValues.scienceInterest) newErrors.scienceInterest = 'Ovo polje je obavezno!';
            if (formValues.interestFit === 'ne uklapa se' || formValues.interestFit === 'djelimicno se uklapa' || formValues.highSchool === "Gimnazija" || formValues.highSchool === "Ostalo") {
                if (!formValues.additionalInterest) newErrors.additionalInterest = 'Ovo polje je obavezno!';
            }
        } else if (activeStep === 3) {
            if (checkedItems.length < 5 || checkedItems.length > 7) {
                newErrors.responsibilities = 'Morate odabrati minimalno 5 sposobnosti!';
            }
            if (checkedSkills.length < 3 || checkedSkills.length > 5) {
                newErrors.skills = 'Morate odabrati minimalno 3 vještine!';
            }
        }
        return newErrors;
    };

    function shuffleArray(array: any) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    const handleEmailChange = (e: any) => {
        setFormValues({
            ...formValues,
            email: e.target.value
        });
    };

    const fetchResponsibilities = async (jobInfo: JobProfileRequest, jobSkillsInfo: JobProfileSkillsRequest) => {
        try {
            const response = await getResponsibilitiesByFaculties(jobInfo);
            const skills = await getSkillsByFaculties(jobSkillsInfo);
            const responsibilities: string[] = Object.values(response.data).flat() as string[];
            const skillsList: string[] = Object.values(skills.data).flat() as string[];
            setResponsibilities1(shuffleArray(responsibilities));
            setSkills1(skillsList)
        } catch (error) {
            console.error('Error fetching job profile:', error);
        }
    };


    useEffect(() => {
        let faculties = tehnickeNaukeOpcija1;
        if (formValues.interestFit === "ne uklapa se" || formValues.interestFit === "djelimicno se uklapa" || (formValues.interestFit === "u potpunosti se uklapa" && (formValues.highSchool === "Gimnazija" || formValues.highSchool === "Ostalo" || formValues.highSchool === "Ugostiteljsko-trgovinsko-turistička"))) {
            if (formValues.additionalInterest === "Naučno-istraživački rad i primjena tehnologija") {
                faculties = prirodneNaukeOpcija1;
            } else if (formValues.additionalInterest === "Upravljanje šumskim resursima, zaštita ekosistema i očuvanje biljnog i životinjskog svijeta") {
                faculties = prirodneNaukeOpcija2;

            } else if (formValues.additionalInterest === "Tehnološke inovacije i inženjering") {
                faculties = tehnickeNaukeOpcija1;

            } else if (formValues.additionalInterest === "Inovacije u konstrukciji i dizajnu građevinskih objekata ili upravljanje infrastrukturom i transportnim sistemima") {
                faculties = tehnickeNaukeOpcija2;
            } else if (formValues.additionalInterest === "Razvoj i primjena finansijskih strategija, način funkcionisanja javnih institucija i administracijskih procesa kao i primjena zakona u društvu") {
                faculties = drustveneNaukeOpcija1;
            } else if (formValues.additionalInterest === "Književnost, umjetnost i društveni fenomeni") {
                faculties = drustveneNaukeOpcija2;
            }
        } else {
            if (formValues.highSchool === "Građevinska") {
                faculties = tehnickeNaukeOpcija2;
            } else if (formValues.highSchool === "Ekonomska") {
                faculties = drustveneNaukeOpcija1;
            } else if (formValues.highSchool === "Elektrotehnička") {
                faculties = tehnickeNaukeOpcija1;
            } else if (formValues.highSchool === "Medicinska") {
                faculties = prirodneNaukeOpcija1;
            } else if (formValues.highSchool === "Poljoprivredna") {
                faculties = prirodneNaukeOpcija2;
            } else if (formValues.highSchool === "Tehnička") {
                faculties = tehnickeNaukeOpcija1;
            } else if (formValues.highSchool === "Tehnološka") {
                faculties = tehnickeNaukeOpcija1;
            } else if (formValues.highSchool === "Muzička") {
                faculties = drustveneNaukeOpcija2;
            }
        }
        fetchResponsibilities({
            faculties: faculties,
            num_responsibilities: 35
        }, {faculties: faculties, num_skills: 15});
    }, [formValues.interestFit, formValues.additionalInterest]);

    const faculties = [
        {
            id: 1,
            name: 'University of Banja Luka',
            coordinates: '44.779150614923346, 17.198506568451887',
        },
        {
            id: 2,
            name: 'University of East Sarajevo',
            coordinates: '44.76688431955418, 17.1869570396156',
        },
        {
            id: 3,
            name: 'University of Sarajevo',
            coordinates: '44.764819938972046, 17.198152539615556',
        },
    ];

    const findFacultyByName = (name: string): CreateFacultyRequest | undefined => {
        const exactMatch = universitiesByCity.find(
            (university) => university.name === name && university.city === formValues.address
        );

        if (exactMatch) {
            return exactMatch;
        }

        const partialMatch = universitiesByCity.find(
            (university) =>
                university.name.toLowerCase().startsWith(name.substring(0, 5).toLowerCase()) &&
                university.city === formValues.address
        );

        return partialMatch;
    };

    return (
        <>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={2000}
                anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                onClose={handleCloseSnackbar}
            />
            <Container maxWidth="lg" style={{marginTop: '2rem', marginLeft: "1rem"}}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <Card
                            sx={{
                                backgroundColor: "#fff",
                                boxShadow: '5px 5px 20px 3px rgba(0,0,0,.08)',
                                border: "0.5px solid rgba(55, 79, 121, 0.29)"
                            }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Upitnik usmjeravanja
                                </Typography>
                                <Stepper activeStep={activeStep} orientation="vertical"
                                         sx={{
                                             paddingLeft: 2, paddingTop: 1, "& .Mui-active": {
                                                 "&.MuiStepIcon-root": {
                                                     color: "#3696ab",
                                                     fontSize: "25px"
                                                 },
                                                 "& .MuiStepConnector-line": {
                                                     borderColor: "#369ab",
                                                 }
                                             },
                                             "& .Mui-completed": {
                                                 "&.MuiStepIcon-root": {
                                                     color: "#3696ab",
                                                     fontSize: "25px"
                                                 },
                                                 "& .MuiStepConnector-line": {
                                                     borderColor: "#369ab"
                                                 }
                                             }
                                         }}>
                                    {steps.map((label, index) => (
                                        <Step key={label}>
                                            <StepLabel>{label}</StepLabel>
                                        </Step>
                                    ))}
                                </Stepper>
                            </CardContent>
                        </Card>
                        <Card style={{
                            marginTop: '1rem', backgroundColor: "#fff",
                            boxShadow: '5px 5px 20px 3px rgba(0,0,0,.08)',
                            border: "0.5px solid rgba(55, 79, 121, 0.29)",
                        }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Dodatne informacije
                                </Typography>
                                <Box display="flex" alignItems="center" mb={2} style={{marginTop: "1rem"}}>
                                    <FaEnvelope style={{marginRight: '0.5rem', marginLeft: "1rem"}}/>
                                    <Typography>universityinfo@gmail.com</Typography>
                                </Box>
                                <Box display="flex" alignItems="center">
                                    <FaLink style={{marginRight: '0.5rem', marginLeft: "1rem"}}/>
                                    <Typography><a href={"http://localhost:3000/prediction"} target="_blank"
                                                   rel="noopener noreferrer"
                                                   style={{textDecoration: "none", color: "rgba(0,0,0,0.88)"}}>Saznaj
                                        više o
                                        upitniku</a></Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <Card
                            sx={{
                                backgroundColor: "#fff",
                                boxShadow: '5px 5px 20px 3px rgba(0,0,0,.08)',
                                border: "0.5px solid rgba(55, 79, 121, 0.29)",
                                marginBottom: "2%"
                            }}>
                            <CardContent>
                                <Typography variant="h5" gutterBottom fontSize={22}>
                                    Koji fakultet je pravi izbor za tebe?
                                </Typography>
                                <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                                    • Upitnik usmjeravanja •
                                </Typography>
                                <Divider style={{margin: '1rem 0'}}/>
                                {activeStep === 0 && (
                                    <>
                                        <Typography fontSize={17} gutterBottom fontWeight={"bold"}
                                                    style={{color: "rgba(0,0,0,0.78)"}}>
                                            Opis
                                        </Typography>
                                        <Typography variant="body1" paragraph>
                                            Upitnik usmjeravanja predstavlja jedan vid online savjetovanja za učenike
                                            koji
                                            nisu sigurni oko izbora akademskog obrazovanja. Upitnik je podijeljen na
                                            četiri
                                            poglavlja, te nije moguće preći na iduće poglavlje dok se ne popuni
                                            prethodno.
                                            Molimo te da unosiš što tačnije informacije kako bismo ti mogli pružiti
                                            najrelevantnije preporuke!
                                        </Typography>
                                        <Typography fontSize={17} gutterBottom fontWeight={"bold"}>
                                            Osnovne informacije
                                        </Typography>
                                        <Typography variant="body1" paragraph>
                                            Unesi osnovne informacije o sebi u navedena polja. Polje e-mail je neophodno
                                            popuniti samo ukoliko na kraju upitnika želiš dobiti izvještaj sa
                                            rezultatima
                                            na e-mail adresu.
                                        </Typography>
                                        <form noValidate autoComplete="off">
                                            <div style={{position: 'relative'}}>
                                                {editLabelField === 'firstName' ? (
                                                    <TextField
                                                        fullWidth
                                                        style={{marginTop: "15px"}}
                                                        value={tempLabel}
                                                        onChange={handleLabelChange}
                                                        onBlur={() => handleSaveLabelClick(1)}
                                                        InputProps={{
                                                            endAdornment: (
                                                                <>
                                                                    <IconButton
                                                                        onClick={() => handleSaveLabelClick(1)}>
                                                                        <SaveIcon/>
                                                                    </IconButton>
                                                                    <IconButton onClick={handleCancelLabelClick}>
                                                                        <CancelIcon/>
                                                                    </IconButton>
                                                                </>
                                                            )
                                                        }}
                                                    />
                                                ) : (
                                                    <div style={{display: 'flex', alignItems: 'center'}}>
                                                        <TextField
                                                            fullWidth
                                                            required
                                                            label={questions1.find(q => q.id === 1)?.question || "Ime:"}
                                                            variant="standard"
                                                            margin="normal"
                                                            name="firstName"
                                                            value={formValues.firstName}
                                                            onChange={handleInputChange}
                                                            error={!!errors.firstName}
                                                            helperText={errors.firstName}
                                                            sx={{backgroundColor: '#fff'}}
                                                            InputProps={{
                                                                endAdornment: (
                                                                    isAdmin ? (
                                                                        <IconButton
                                                                            onClick={() => handleEditLabelClick('firstName', questions1.find(q => q.id === 1)?.question || "Ime:")}
                                                                        >
                                                                            <EditIcon/>
                                                                        </IconButton>
                                                                    ) : null
                                                                )
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                            <div style={{position: 'relative'}}>
                                                {editLabelField === 'lastName' ? (
                                                    <TextField
                                                        fullWidth
                                                        style={{marginTop: "15px"}}
                                                        value={tempLabel}
                                                        onChange={handleLabelChange}
                                                        onBlur={() => handleSaveLabelClick(2)}
                                                        InputProps={{
                                                            endAdornment: (
                                                                <>
                                                                    <IconButton
                                                                        onClick={() => handleSaveLabelClick(2)}>
                                                                        <SaveIcon/>
                                                                    </IconButton>
                                                                    <IconButton onClick={handleCancelLabelClick}>
                                                                        <CancelIcon/>
                                                                    </IconButton>
                                                                </>
                                                            )
                                                        }}
                                                    />
                                                ) : (
                                                    <div style={{display: 'flex', alignItems: 'center'}}>
                                                        <TextField
                                                            fullWidth
                                                            required
                                                            label={questions1.find(q => q.id === 2)?.question || "Prezime:"}
                                                            variant="standard"
                                                            margin="normal"
                                                            name="lastName"
                                                            value={formValues.lastName}
                                                            onChange={handleInputChange}
                                                            error={!!errors.lastName}
                                                            helperText={errors.lastName}
                                                            sx={{backgroundColor: '#fff'}}
                                                            InputProps={{
                                                                endAdornment: (
                                                                    isAdmin ? (
                                                                        <IconButton
                                                                            onClick={() => handleEditLabelClick('lastName', questions1.find(q => q.id === 2)?.question || "Prezime:")}>
                                                                            <EditIcon/>
                                                                        </IconButton>
                                                                    ) : null
                                                                )
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            <FormControl fullWidth margin="normal" sx={{mt: "1rem"}}>
                                                <Typography style={{
                                                    fontFamily: "Roboto, Helvetica ,Arial ,sans-serif",
                                                    color: "rgba(0, 0, 0, 0.6)",
                                                    fontSize: 12
                                                }} gutterBottom>
                                                    {editLabelField === 'address' ? (
                                                        <TextField
                                                            fullWidth
                                                            style={{marginTop: "15px"}}
                                                            value={tempLabel}
                                                            onChange={handleLabelChange}
                                                            onBlur={() => handleSaveLabelClick(3)}
                                                            InputProps={{
                                                                endAdornment: (
                                                                    <>
                                                                        <IconButton
                                                                            onClick={() => handleSaveLabelClick(3)}>
                                                                            <SaveIcon/>
                                                                        </IconButton>
                                                                        <IconButton onClick={handleCancelLabelClick}>
                                                                            <CancelIcon/>
                                                                        </IconButton>
                                                                    </>
                                                                )
                                                            }}
                                                        />
                                                    ) : (
                                                        <>
                                                            {questions1.find(q => q.id === 3)?.question}:*
                                                            {isAdmin &&
                                                                <IconButton style={{marginLeft: "72.5%"}}
                                                                            onClick={() => handleEditLabelClick('address', questions1.find(q => q.id === 3)?.question)}>
                                                                    <EditIcon/>
                                                                </IconButton>
                                                            }
                                                        </>
                                                    )}
                                                </Typography>

                                                <Select
                                                    labelId="simple-select-standard-label"
                                                    id="simple-select-standard"
                                                    value={formValues.address}
                                                    onChange={handleSelectChangeCity}
                                                    error={!!errors.address}
                                                    required
                                                    variant="standard"
                                                    name="address"
                                                >
                                                    {cities.map((city) => (
                                                        <MenuItem key={city} value={city}>
                                                            {city}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                                {errors.address && (
                                                    <Typography variant="body2"
                                                                color="error">{errors.address}</Typography>
                                                )}
                                            </FormControl>


                                            <div style={{position: 'relative'}}>
                                                {editLabelField === 'email' ? (
                                                    <TextField
                                                        fullWidth
                                                        style={{marginTop: "15px"}}
                                                        value={tempLabel}
                                                        onChange={handleLabelChange}
                                                        onBlur={() => handleSaveLabelClick(4)}
                                                        InputProps={{
                                                            endAdornment: (
                                                                <>
                                                                    <IconButton
                                                                        onClick={() => handleSaveLabelClick(4)}>
                                                                        <SaveIcon/>
                                                                    </IconButton>
                                                                    <IconButton onClick={handleCancelLabelClick}>
                                                                        <CancelIcon/>
                                                                    </IconButton>
                                                                </>
                                                            )
                                                        }}
                                                    />
                                                ) : (
                                                    <div style={{display: 'flex', alignItems: 'center'}}>
                                                        <TextField
                                                            fullWidth
                                                            label={questions1.find(q => q.id === 4)?.question || "E-mail:"}
                                                            variant="standard"
                                                            margin="normal"
                                                            name="email"
                                                            value={formValues.email}
                                                            onChange={handleInputChange}
                                                            error={!!errors.email}
                                                            helperText={errors.email}
                                                            sx={{backgroundColor: '#fff'}}
                                                            InputProps={{
                                                                endAdornment: (
                                                                    isAdmin ? (
                                                                        <IconButton
                                                                            onClick={() => handleEditLabelClick('email', questions1.find(q => q.id === 4)?.question || "E-mail:")}>
                                                                            <EditIcon/>
                                                                        </IconButton>
                                                                    ) : null
                                                                )
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            </div>


                                        </form>
                                    </>
                                )}
                                {activeStep === 1 && (
                                    <>
                                        <Typography fontSize={17} gutterBottom fontWeight={"bold"}>
                                            Obrazovanje
                                        </Typography>
                                        <Typography variant="body1" paragraph>
                                            Unesi informacije vezane za srednjoškolsko obrazovanje.
                                        </Typography>

                                        <FormControl fullWidth margin="normal" sx={{mt: "1rem"}}>
                                            <Typography fontSize={16} gutterBottom fontWeight={"bold"}>
                                                {editLabelField === 'primarySchool' ? (
                                                    <TextField
                                                        variant="standard"
                                                        style={{width: "723px"}}
                                                        value={tempLabel}
                                                        onChange={handleLabelChange}
                                                        onBlur={() => handleSaveLabelClick(5)}
                                                        InputProps={{
                                                            endAdornment: (
                                                                <>
                                                                    <IconButton
                                                                        onClick={() => handleSaveLabelClick(5)}>
                                                                        <SaveIcon/>
                                                                    </IconButton>
                                                                    <IconButton
                                                                        onClick={() => handleCancelLabelClick()}>
                                                                        <CancelIcon/>
                                                                    </IconButton>
                                                                </>
                                                            )
                                                        }}
                                                    />
                                                ) : (
                                                    <>
                                                        {questions1.find(q => q.id === 5)?.question}
                                                        {isAdmin &&
                                                            <IconButton
                                                                onClick={() => handleEditLabelClick('primarySchool', questions1.find(q => q.id === 5)?.question)}>
                                                                <EditIcon/>
                                                            </IconButton>
                                                        }
                                                    </>
                                                )}
                                            </Typography>

                                            <Select
                                                labelId="simple-select-standard-label"
                                                id="simple-select-standard"
                                                value={formValues.highSchool}
                                                onChange={handleSelectChange}
                                                error={!!errors.highSchool}
                                                required
                                                variant="standard"
                                                name="highSchool"
                                            >
                                                {primarySchools.map((school) => (
                                                    <MenuItem key={school} value={school}>
                                                        {school}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {errors.highSchool && (
                                                <Typography variant="body2"
                                                            color="error">{errors.highSchool}</Typography>
                                            )}
                                        </FormControl>

                                        <Typography fontSize={16} gutterBottom fontWeight={"bold"}
                                                    style={{marginTop: '1rem'}}>
                                            {editLabelField === 'primarySchoolInterested' ? (
                                                <TextField
                                                    variant="standard"
                                                    style={{width: "723px"}}
                                                    value={tempLabel}
                                                    onChange={handleLabelChange}
                                                    onBlur={() => handleSaveLabelClick(6)}
                                                    InputProps={{
                                                        endAdornment: (
                                                            <>
                                                                <IconButton
                                                                    onClick={() => handleSaveLabelClick(6)}>
                                                                    <SaveIcon/>
                                                                </IconButton>
                                                                <IconButton
                                                                    onClick={() => handleCancelLabelClick()}>
                                                                    <CancelIcon/>
                                                                </IconButton>
                                                            </>
                                                        )
                                                    }}
                                                />
                                            ) : (
                                                <>
                                                    {questions1.find(q => q.id === 6)?.question}
                                                    {isAdmin &&
                                                        <IconButton
                                                            onClick={() => handleEditLabelClick('primarySchoolInterested', questions1.find(q => q.id === 6)?.question)}>
                                                            <EditIcon/>
                                                        </IconButton>
                                                    }
                                                </>
                                            )}
                                        </Typography>
                                        <FormControl component="fieldset" error={!!errors.interestFit}
                                                     sx={{ml: "1rem"}}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={formValues.interestFit === 'ne uklapa se'}
                                                        onChange={handleCheckboxChange}
                                                        name="interestFit"
                                                        value="ne uklapa se"
                                                    />
                                                }
                                                label="Ne uklapa se"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={formValues.interestFit === 'djelimicno se uklapa'}
                                                        onChange={handleCheckboxChange}
                                                        name="interestFit"
                                                        value="djelimicno se uklapa"
                                                    />
                                                }
                                                label="Djelimično se uklapa"
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={formValues.interestFit === 'u potpunosti se uklapa'}
                                                        onChange={handleCheckboxChange}
                                                        name="interestFit"
                                                        value="u potpunosti se uklapa"
                                                    />
                                                }
                                                label="U potpunosti se uklapa"
                                            />
                                            {errors.interestFit && (
                                                <Typography variant="body2"
                                                            color="error">{errors.interestFit}</Typography>
                                            )}
                                        </FormControl>
                                    </>
                                )}
                                {activeStep === 2 && (
                                    <>
                                        <>
                                            <Typography fontSize={17} gutterBottom fontWeight={"bold"}>
                                                Oblasti interesovanja
                                            </Typography>
                                            <Typography variant="body1" paragraph>
                                                Unesi informacije o svojim oblastima interesovanjima.
                                            </Typography>
                                            <Typography fontSize={16} gutterBottom fontWeight={"bold"}
                                                        style={{marginTop: '1rem'}}>
                                                {editLabelField === 'science' ? (
                                                    <TextField
                                                        variant="standard"
                                                        style={{width: "723px"}}
                                                        value={tempLabel}
                                                        onChange={handleLabelChange}
                                                        onBlur={() => handleSaveLabelClick(7)}
                                                        InputProps={{
                                                            endAdornment: (
                                                                <>
                                                                    <IconButton
                                                                        onClick={() => handleSaveLabelClick(7)}>
                                                                        <SaveIcon/>
                                                                    </IconButton>
                                                                    <IconButton onClick={handleCancelLabelClick}>
                                                                        <CancelIcon/>
                                                                    </IconButton>
                                                                </>
                                                            ),
                                                        }}
                                                    />
                                                ) : (
                                                    <>
                                                        {questions1.find(q => q.id === 7)?.question}
                                                        {isAdmin &&
                                                            <IconButton
                                                                onClick={() => handleEditLabelClick('science', questions1.find(q => q.id === 7)?.question)}>
                                                                <EditIcon/>
                                                            </IconButton>
                                                        }
                                                    </>
                                                )}
                                            </Typography>

                                            <FormControl fullWidth margin="normal" sx={{ml: "1rem"}}
                                                         error={!!errors.scienceInterest}>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={formValues.scienceInterest === 'prirodnim'}
                                                            onChange={handleCheckbox1Change}
                                                            name="scienceInterest"
                                                            value="prirodnim"
                                                        />
                                                    }
                                                    label="Prirodnim"
                                                />
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={formValues.scienceInterest === 'drustvenim'}
                                                            onChange={handleCheckbox1Change}
                                                            name="scienceInterest"
                                                            value="drustvenim"
                                                        />
                                                    }
                                                    label="Društvenim"
                                                />
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={formValues.scienceInterest === 'tehnickim'}
                                                            onChange={handleCheckbox1Change}
                                                            name="scienceInterest"
                                                            value="tehnickim"
                                                        />
                                                    }
                                                    label="Tehničkim"
                                                />
                                                {errors.scienceInterest && (
                                                    <Typography variant="body2" color="error">
                                                        {errors.scienceInterest}
                                                    </Typography>
                                                )}
                                            </FormControl>

                                            {formValues.scienceInterest && (formValues.interestFit === 'ne uklapa se' || formValues.interestFit === 'djelimicno se uklapa' || formValues.highSchool === "Gimnazija" || formValues.highSchool === "Ostalo" || formValues.highSchool === "Ugostiteljsko-trgovinsko-turistička") && (
                                                <>
                                                    <Typography fontSize={16} gutterBottom fontWeight={"bold"}
                                                                style={{marginTop: '1rem'}}>
                                                        {editLabelField === 'scienceDescription' ? (
                                                            <TextField
                                                                variant="standard"
                                                                style={{width: "723px"}}
                                                                value={tempLabel}
                                                                onChange={handleLabelChange}
                                                                onBlur={() => handleSaveLabelClick(8)}
                                                                InputProps={{
                                                                    endAdornment: (
                                                                        <>
                                                                            <IconButton
                                                                                onClick={() => handleSaveLabelClick(8)}>
                                                                                <SaveIcon/>
                                                                            </IconButton>
                                                                            <IconButton
                                                                                onClick={handleCancelLabelClick}>
                                                                                <CancelIcon/>
                                                                            </IconButton>
                                                                        </>
                                                                    ),
                                                                }}
                                                            />
                                                        ) : (
                                                            <>
                                                                {questions1.find(q => q.id === 8)?.question}
                                                                {isAdmin &&
                                                                    <IconButton
                                                                        onClick={() => handleEditLabelClick('scienceDescription', questions1.find(q => q.id === 8)?.question)}>
                                                                        <EditIcon/>
                                                                    </IconButton>
                                                                }
                                                            </>
                                                        )}
                                                    </Typography>

                                                    {formValues.scienceInterest === 'prirodnim' && (
                                                        <FormControl fullWidth margin="normal" sx={{ml: "1rem"}}
                                                                     error={!!errors.additionalInterest}>
                                                            <FormControlLabel
                                                                control={
                                                                    <Checkbox
                                                                        checked={formValues.additionalInterest === 'Naučno-istraživački rad i primjena tehnologija'}
                                                                        onChange={handleAdditionalInterestChange}
                                                                        name="additionalInterest"
                                                                        value="Naučno-istraživački rad i primjena tehnologija"
                                                                    />
                                                                }
                                                                label="Naučno-istraživački rad i primjena tehnologija"
                                                            />
                                                            <FormControlLabel
                                                                control={
                                                                    <Checkbox
                                                                        checked={formValues.additionalInterest === 'Upravljanje šumskim resursima, zaštita ekosistema i očuvanje biljnog i životinjskog svijeta'}
                                                                        onChange={handleAdditionalInterestChange}
                                                                        name="additionalInterest"
                                                                        value="Upravljanje šumskim resursima, zaštita ekosistema i očuvanje biljnog i životinjskog svijeta"
                                                                    />
                                                                }
                                                                label="Upravljanje šumskim resursima, zaštita ekosistema i očuvanje biljnog i životinjskog svijeta"
                                                            />
                                                            {errors.additionalInterest && (
                                                                <Typography variant="body2" color="error">
                                                                    {errors.additionalInterest}
                                                                </Typography>
                                                            )}
                                                        </FormControl>
                                                    )}

                                                    {formValues.scienceInterest === 'drustvenim' && (
                                                        <FormControl fullWidth margin="normal" sx={{ml: "1rem"}}
                                                                     error={!!errors.additionalInterest}>
                                                            <FormControlLabel
                                                                control={
                                                                    <Checkbox
                                                                        checked={formValues.additionalInterest === 'Razvoj i primjena finansijskih strategija, način funkcionisanja javnih institucija i administracijskih procesa kao i primjena zakona u društvu'}
                                                                        onChange={handleAdditionalInterestChange}
                                                                        name="additionalInterest"
                                                                        value="Razvoj i primjena finansijskih strategija, način funkcionisanja javnih institucija i administracijskih procesa kao i primjena zakona u društvu"
                                                                    />
                                                                }
                                                                label="Razvoj i primjena finansijskih strategija, način funkcionisanja javnih institucija i administracijskih procesa kao i primjena zakona u društvu"
                                                            />
                                                            <FormControlLabel
                                                                control={
                                                                    <Checkbox
                                                                        checked={formValues.additionalInterest === 'Književnost, umjetnost i društveni fenomeni'}
                                                                        onChange={handleAdditionalInterestChange}
                                                                        name="additionalInterest"
                                                                        value="Književnost, umjetnost i društveni fenomeni"
                                                                    />
                                                                }
                                                                label="Književnost, umjetnost i društveni fenomeni"
                                                            />
                                                            {errors.additionalInterest && (
                                                                <Typography variant="body2" color="error">
                                                                    {errors.additionalInterest}
                                                                </Typography>
                                                            )}
                                                        </FormControl>
                                                    )}

                                                    {formValues.scienceInterest === 'tehnickim' && (
                                                        <FormControl fullWidth margin="normal" sx={{ml: "1rem"}}
                                                                     error={!!errors.additionalInterest}>
                                                            <FormControlLabel
                                                                control={
                                                                    <Checkbox
                                                                        checked={formValues.additionalInterest === 'Tehnološke inovacije i inženjering'}
                                                                        onChange={handleAdditionalInterestChange}
                                                                        name="additionalInterest"
                                                                        value="Tehnološke inovacije i inženjering"
                                                                    />
                                                                }
                                                                label="Tehnološke inovacije i inženjering"
                                                            />
                                                            <FormControlLabel
                                                                control={
                                                                    <Checkbox
                                                                        checked={formValues.additionalInterest === 'Inovacije u konstrukciji i dizajnu građevinskih objekata ili upravljanje infrastrukturom i transportnim sistemima'}
                                                                        onChange={handleAdditionalInterestChange}
                                                                        name="additionalInterest"
                                                                        value="Inovacije u konstrukciji i dizajnu građevinskih objekata ili upravljanje infrastrukturom i transportnim sistemima"
                                                                    />
                                                                }
                                                                label="Inovacije u konstrukciji i dizajnu građevinskih objekata ili upravljanje infrastrukturom i transportnim sistemima"
                                                            />
                                                            {errors.additionalInterest && (
                                                                <Typography variant="body2" color="error">
                                                                    {errors.additionalInterest}
                                                                </Typography>
                                                            )}
                                                        </FormControl>
                                                    )}
                                                </>
                                            )}
                                        </>
                                    </>
                                )}
                                {activeStep === 3 && (
                                    <>
                                        <>
                                            <Typography fontSize={17} gutterBottom fontWeight={"bold"}>
                                                Sposobnosti i vještine
                                            </Typography>
                                            <Typography variant="body1" paragraph>
                                                Odaberi sposobnosti i vještine koje te najbolje opisuju! Sposobnosti
                                                predstavljaju aktivnosti i zadatke koje bi želio/la raditi u
                                                budućnosti, a vještine se odnose na tvoje trenutne kompetencije i
                                                ono
                                                u čemu si već razvijen/a i iskusan/a. Prilikom odabira ovih stavki,
                                                pažljivo razmisli o onom što te najviše motiviše i u čemu se najviše
                                                pronalaziš.
                                            </Typography>
                                            <Typography fontSize={15} gutterBottom fontWeight={"bold"}
                                                        style={{marginTop: '1rem'}}>
                                                {editLabelField === 'responsibilities' ? (
                                                    <TextField
                                                        variant="standard"
                                                        style={{width: "723px"}}
                                                        value={tempLabel}
                                                        onChange={handleLabelChange}
                                                        onBlur={() => handleSaveLabelClick(9)}
                                                        InputProps={{
                                                            endAdornment: (
                                                                <>
                                                                    <IconButton
                                                                        onClick={() => handleSaveLabelClick(9)}>
                                                                        <SaveIcon/>
                                                                    </IconButton>
                                                                    <IconButton onClick={handleCancelLabelClick}>
                                                                        <CancelIcon/>
                                                                    </IconButton>
                                                                </>
                                                            )
                                                        }}
                                                    />
                                                ) : (
                                                    <>
                                                        {questions1.find(q => q.id === 9)?.question}
                                                        {isAdmin &&
                                                            <IconButton
                                                                onClick={() => handleEditLabelClick('responsibilities', questions1.find(q => q.id === 9)?.question)}>
                                                                <EditIcon/>
                                                            </IconButton>
                                                        }
                                                        {errors.responsibilities && <Typography
                                                            color="error">{errors.responsibilities}</Typography>}
                                                    </>
                                                )}
                                            </Typography>
                                            <div className="checkbox-container">
                                                <h3>Sposobnosti</h3>
                                                {responsibilities1.map((option, index) => (
                                                    <label className="checkbox-item" key={index}>
                                                        <input
                                                            type="checkbox"
                                                            value={index}
                                                            checked={checkedItems.includes(index)}
                                                            onChange={() => handleCheckboxResponsibilitiesChange(index)}
                                                            disabled={!checkedItems.includes(index) && checkedItems.length >= 7}
                                                        /> {option}
                                                    </label>
                                                ))}
                                            </div>
                                            <Typography fontSize={15} gutterBottom fontWeight={"bold"}
                                                        style={{marginTop: '1rem'}}>
                                                {editLabelField === 'skills' ? (
                                                    <TextField
                                                        variant="standard"
                                                        style={{width: "723px"}}
                                                        value={tempLabel}
                                                        onChange={handleLabelChange}
                                                        onBlur={() => handleSaveLabelClick(10)}
                                                        InputProps={{
                                                            endAdornment: (
                                                                <>
                                                                    <IconButton
                                                                        onClick={() => handleSaveLabelClick(10)}>
                                                                        <SaveIcon/>
                                                                    </IconButton>
                                                                    <IconButton onClick={handleCancelLabelClick}>
                                                                        <CancelIcon/>
                                                                    </IconButton>
                                                                </>
                                                            )
                                                        }}
                                                    />
                                                ) : (
                                                    <>
                                                        {questions1.find(q => q.id === 10)?.question}
                                                        {isAdmin &&
                                                            <IconButton
                                                                onClick={() => handleEditLabelClick('skills', questions1.find(q => q.id === 10)?.question)}>
                                                                <EditIcon/>
                                                            </IconButton>
                                                        }
                                                        {errors.skills &&
                                                            <Typography color="error">{errors.skills}</Typography>}
                                                    </>
                                                )}
                                            </Typography>
                                            <div className="checkbox-container">
                                                <h3>Vještine</h3>
                                                {skills1.map((option, index) => (
                                                    <label className="checkbox-item" key={index}>
                                                        <input
                                                            type="checkbox"
                                                            value={index}
                                                            checked={checkedSkills.includes(index)}
                                                            onChange={() => handleCheckboxSkillsChange(index)}
                                                            disabled={!checkedSkills.includes(index) && checkedSkills.length >= 5}
                                                        /> {option}
                                                    </label>
                                                ))}
                                            </div>
                                        </>
                                    </>
                                )}

                                {activeStep === 4 && (
                                    <>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <img src={elearning} style={{maxHeight: "275px", width: "auto"}}></img>
                                        </div>
                                        <div style={{display: "flex", flexDirection: "row"}}>
                                            <Typography fontSize={17} gutterBottom fontWeight={"bold"}>
                                                Rezultati
                                            </Typography>
                                            <BiSolidCloudDownload
                                                style={{
                                                    height: 28,
                                                    width: 28,
                                                    marginLeft: "2%",
                                                    marginTop: "-2px",
                                                    color: "rgb(185,76,76)",
                                                    cursor: "pointer"
                                                }} onClick={handleDownload} title="Preuzmi rezultate"/>
                                            <MdAttachEmail style={{
                                                height: 24,
                                                width: 24,
                                                marginLeft: "1%",
                                                marginTop: "2px",
                                                color: "rgb(185,76,76)",
                                                cursor: "pointer"
                                            }} onClick={sendPdf} title="Posalji rezultate na e-mail"/></div>
                                        {showEmailModal && (
                                            <div style={{marginTop: "2%"}}>
                                                <input
                                                    type="email"
                                                    value={formValues.email}
                                                    onChange={handleEmailChange}
                                                    placeholder="Unesi e-mail:"
                                                    style={{
                                                        marginRight: "1%", width: '35%',
                                                        padding: '10px',
                                                        marginBottom: '10px',
                                                        borderRadius: '4px',
                                                        border: '1px solid #ccc',
                                                        fontSize: '16px',
                                                        outline: 'none',
                                                        boxSizing: 'border-box'
                                                    }}

                                                />
                                                <button style={{
                                                    padding: '10px 20px',
                                                    backgroundColor: '#3696AB',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    fontSize: '16px',
                                                    outline: 'none',
                                                    transition: 'background-color 0.3s ease'
                                                }} onClick={handleModalClose}>Pošalji
                                                </button>
                                            </div>
                                        )}
                                        <Typography variant="body1" paragraph style={{marginTop: "3%"}}>
                                            Fakulteti koji odgovaraju tvojim sposobnostima i vještinama su:
                                        </Typography>
                                        {faculty ? (
                                            <Typography
                                                variant="body1"
                                                paragraph
                                            >
                                                <a
                                                    href={`/details/${faculty.id}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{cursor: 'pointer'}}
                                                >
                                                    1. {textForPrediction}
                                                </a>
                                            </Typography>
                                        ) : (
                                            <Typography variant="body1" paragraph>
                                                1. {textForPrediction}
                                            </Typography>
                                        )}
                                        {second !== undefined && second !== null && (() => {
                                            const facultySecond = findFacultyByName(second);

                                            return facultySecond ? (
                                                <Typography variant="body1" paragraph>
                                                    <a
                                                        href={`/details/${facultySecond.id}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        style={{cursor: 'pointer'}}
                                                    >
                                                        2. {second}
                                                    </a>
                                                </Typography>
                                            ) : (
                                                <Typography variant="body1" paragraph>
                                                    2. {second}
                                                </Typography>
                                            );
                                        })()}
                                        <Typography fontSize={17} gutterBottom fontWeight={"bold"}>
                                            Srodni fakulteti
                                        </Typography>
                                        {third !== undefined ? (
                                            <Typography variant="body1" paragraph style={{marginTop: "3%"}}>
                                                Pogledajte fakultete koji su srodni sa rezultatima:
                                            </Typography>) : (
                                            <Typography variant="body1" paragraph style={{marginTop: "3%"}}>
                                                Nema rezultata o srodnim fakultima!
                                            </Typography>)}
                                        {third !== undefined && third !== null && (() => {
                                            const facultyThird = findFacultyByName(third);

                                            return facultyThird ? (
                                                <Typography
                                                    variant="body1"
                                                    paragraph
                                                >
                                                    <a
                                                        href={`/details/${facultyThird.id}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        style={{cursor: 'pointer'}}
                                                    >
                                                        1. {third}
                                                    </a>
                                                </Typography>
                                            ) : (
                                                <Typography variant="body1" paragraph>
                                                    1. {third}
                                                </Typography>
                                            );
                                        })()}
                                        {fourth !== undefined && fourth !== null && (() => {
                                            const facultyFourth = findFacultyByName(fourth);

                                            return facultyFourth ? (
                                                <Typography
                                                    variant="body1"
                                                    paragraph
                                                >
                                                    <a
                                                        href={`/details/${facultyFourth.id}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        style={{cursor: 'pointer'}}
                                                    >
                                                        2. {fourth}
                                                    </a>
                                                </Typography>
                                            ) : (
                                                <Typography variant="body1" paragraph>
                                                    2. {fourth}
                                                </Typography>
                                            );
                                        })()}
                                        {isLoaded ?
                                            <GoogleMap mapContainerStyle={mapContainerStyle} zoom={zoom}
                                                       center={position}
                                                       options={options}
                                                       onLoad={onMapLoad}>
                                                <MarkerClustererF>
                                                    {(cluster) => (
                                                        <>
                                                            {universitiesByCity.map((marker) => (
                                                                <MarkerF
                                                                    key={marker.id}
                                                                    position={{
                                                                        lat: Number.parseFloat(marker.coordinates.split(',')[0]),
                                                                        lng: Number.parseFloat(marker.coordinates.split(',')[1]),
                                                                    }}
                                                                    clusterer={cluster}
                                                                    icon={{
                                                                        url: '/universityI.png',
                                                                        origin: new window.google.maps.Point(0, 0),
                                                                        anchor: new window.google.maps.Point(15, 15),
                                                                        scaledSize: new window.google.maps.Size(48, 48),
                                                                    }}
                                                                />
                                                            ))}
                                                        </>
                                                    )}
                                                </MarkerClustererF>
                                            </GoogleMap>


                                            : null}

                                    </>
                                )}
                                <Box sx={{display: 'flex', justifyContent: 'space-between', pt: 5}}>
                                    {activeStep !== steps.length && (
                                        <Button
                                            disabled={activeStep === 0}
                                            onClick={handleBack}
                                            sx={{mr: 1, color: "#3696ab"}}
                                        >
                                            Prethodno
                                        </Button>
                                    )}
                                    {activeStep !== steps.length && (
                                        <Button
                                            variant="contained"
                                            onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
                                            sx={{backgroundColor: "#3696ab"}}
                                        >
                                            {activeStep === steps.length - 1
                                                ? 'Završi'
                                                : 'Sljedeće'}
                                        </Button>
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
}
