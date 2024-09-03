/*global google*/
import * as React from 'react';
import {useEffect, useState} from 'react';
import {Divider, Menu, MenuItem, MenuProps, Snackbar} from "@mui/material";
import {FaLink, FaLocationDot, FaPhone} from "react-icons/fa6";
import university from "../assets/university.png";
import {Link, useNavigate, useParams} from "react-router-dom";
import {CreateFacultyRequest} from "../api/faculty/faculty";
import {getUniversityById} from "../api/faculty/facultyApi";
import {backendUrl, paths} from "../constants/urlConstants";
import axiosService from "../axios/axiosService";
import AppsIcon from '@mui/icons-material/Apps';
import {DeleteOutline, PhotoCamera, Stop, UpdateOutlined} from "@mui/icons-material";
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import {getAllDepartments} from "../api/faculty/departmentApi";
import {Department} from "../api/faculty/department";
import {CreateDepartmentDialog} from "./CreateDepartmentDialog";
import {UpdateDepartmentDialog} from "./UpdateDepartmentDialog";
import {alpha, styled} from "@mui/material/styles";
import {Roles} from "../constants/constants";
import {hasRole} from "../token/token";
import AlertDialog from "./dialogs/AlertDialog";
import {MdEmail} from "react-icons/md";
import {useSnackbarHelper} from "../util/toastUtil";
import "./details.css";
import "./facultyInfo.css";
import searchImage from "../assets/searchFile.png";

const google = window.google ? window.google : {}

export const StyledMenu = styled((props: MenuProps) => (
    <Menu
        elevation={0}
        autoFocus={false}
        {...props}
    />
))(({theme}) => ({
    '& .MuiPaper-root': {
        borderRadius: 6,
        backgroundColor: "rgb(252,251,251)",
        marginTop: theme.spacing(1),
        minWidth: 130,
        color:
            theme.palette.mode === 'light'
                ? 'rgb(55, 65, 81)'
                : theme.palette.grey[300],
        border: "1px solid darkgray",
        '& .MuiMenuItem-root': {
            '& .MuiSvgIcon-root': {
                fontSize: 18,
                color: theme.palette.text.secondary,
                marginRight: theme.spacing(1.5),
            },
            '&:active': {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    theme.palette.action.selectedOpacity
                ),
            },
        },
    },
}));

function FacultyDetails() {
    let numId = 0;
    let {id} = useParams();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const [faculty, setFaculty] = useState<CreateFacultyRequest>();
    const [openAddDepartmentPopup, setOpenAddDepartmentPopup] = useState(false);
    const [openUpdateDepartmentPopup, setOpenUpdateDepartmentPopup] = useState(false);
    const [departments, setDepartments] = useState<Array<Department>>([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [open, setOpen] = useState(false);
    const [openDeleteUni, setOpenDeleteUni] = useState(false);
    const [departmentIdForDelete, setDepartmentIdForDelete] = useState<number | undefined>(-1);
    const [departmentName, setDepartmentName] = useState<string | undefined>("");
    const [selectedDepartment, setSelectedDepartment] = useState<Department>();
    const handleClickVariant = useSnackbarHelper();
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [formattedName, setFormattedName] = useState("");
    const defaultLogoPath = "/images/university.png";


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

    const handleClickOpenDeleteUni = () => {
        setOpenDeleteUni(true);
    };

    const handleCloseDialogDeleteUni = () => {
        setOpenDeleteUni(false);
    };

    const deleteDepartment = (num: number | undefined) => {
        try {
            axiosService(true).delete(`${backendUrl.DEPARTMENT}/${num}`);
            setAnchorEl(null);
            handleCloseDialog();
            setDepartments(departments.filter(dep => dep.id !== num));
            handleClickVariant('success', {
                vertical: "top",
                horizontal: "right"
            }, "Studijski program je uspješno uklonjen!")();
        } catch (exception) {
            handleClickVariant('error', {vertical: "top", horizontal: "right"}, "Došlo je do greške!")();
        }
    }

    const addDepartment = (newDepartment: Department) => {
        setDepartments(prevDepartments => [...prevDepartments, newDepartment]);
    };


    const fetchDepartments = async () => {
        if (id !== undefined) {
            numId = parseInt(id, 10);
        }
        const departmentsRes = await getAllDepartments(numId);
        setDepartments(departmentsRes.data);
    };

    useEffect(() => {
        const hasAdminRole = hasRole(Roles.ADMIN);
        if (hasAdminRole) {
            setIsAdmin(hasAdminRole);
        }
    }, [])

    function formatName(name: any) {
        return name.toLowerCase().replace(/ /g, "-");
    }

    useEffect(() => {
        if (id !== undefined) {
            numId = parseInt(id, 10);
        }
        const getDepartments = async () => {
            const departmentsRes = await getAllDepartments(numId);
            setDepartments(departmentsRes.data);
        }
        getDepartments();
    }, [id])

    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
        const departmentId = event.currentTarget.getAttribute('data-department-id');
        const id = parseInt(departmentId, 10);
        const selectedDepartment = departments.find(department => department.id === id);

        if (selectedDepartment) {
            setSelectedDepartment(selectedDepartment);
        }
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const deleteUniversity = () => {
        try {
            axiosService(true).delete(`${backendUrl.FACULTY_URL}/${faculty?.id}`);
            navigate(paths.FACULTIES);
            handleCloseDialogDeleteUni();
            handleClickVariant('success', {
                vertical: "top",
                horizontal: "right"
            }, "Fakultet je uspješno uklonjen!")();
        } catch (exception) {
            handleClickVariant('error', {vertical: "top", horizontal: "right"}, "Došlo je do greške!")();
        }
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
            const logoPath = `/images/${formattedName}-${formattedCity}.jpg`;
            console.log(logoPath);
            setFormattedName(logoPath);
        }
        getFaculty();
    }, [id])

    useEffect(() => {
        if (open) {
            setDepartmentName(selectedDepartment?.name);
            setDepartmentIdForDelete(selectedDepartment?.id);
        }
    }, [open, selectedDepartment])




    return (
        <>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={2000}
                anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                onClose={handleCloseSnackbar}
            />
            <div className="fcontainer">
                <div className="fheader">
                    <p>Informacije o fakultetu</p>
                    {isAdmin && (
                        <div className="admin-icons">
                            <Link to={`/images/${faculty?.id}`} style={{textDecoration: 'none'}}>
                                <PhotoCamera/>
                            </Link>
                        </div>
                    )}
                </div>
                <Divider className="divider"/>
                <div className="fcontent">
                    <img src={formattedName} alt="" onError={(e) => e.currentTarget.src = defaultLogoPath}/>
                    <div className="fcontent-text">
                        <p>
                            <a href={`${faculty?.website}`} target="_blank" rel="noopener noreferrer">
                                {faculty?.name}
                            </a>
                        </p>
                    </div>
                </div>
                <div className="contact-info">
                    <div className="contact-item">
                        <FaLocationDot style={{color: "rgba(55,79,121,0.81)"}}/>
                        <p>{faculty?.address}, {faculty?.city}, {faculty?.postalCode}</p>
                    </div>
                    <div className="contact-item">
                        <FaPhone style={{color: "rgba(55,79,121,0.81)"}}/>
                        <p>{faculty?.phoneNumber}</p>
                    </div>
                    <div className="contact-item">
                        <MdEmail style={{color: "rgba(55,79,121,0.81)"}}/>
                        <p>
                            <a href={`mailto:${faculty?.email}`}>
                                {faculty?.email}
                            </a>
                        </p>
                    </div>
                    <div className="contact-item">
                        <FaLink style={{color: "rgba(55,79,121,0.81)"}}/>
                        <p>
                            <a href={`${faculty?.website}`} target="_blank" rel="noopener noreferrer">
                                {faculty?.website}
                            </a>
                        </p>
                    </div>
                </div>
            </div>
            <div>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginTop: "1%"
                }}>
                    <p style={{
                        fontSize: 17,
                        color: "rgba(55,79,121,0.88)",
                        fontWeight: "bold",
                        marginLeft: "2.8%",
                        fontFamily: "openSans"
                    }}>Studijski programi</p>
                    {isAdmin &&
                        <ControlPointIcon onClick={() => setOpenAddDepartmentPopup(true)}
                                          style={{
                                              color: "rgba(55,79,121,0.88)",
                                              marginLeft: "0.5%",
                                              width: "20px",
                                              height: "20px",
                                              cursor: "pointer"
                                          }}/>
                    }
                </div>
                <div>
                    {departments.length === 0 && (
                        <div style={{
                            display: 'flex',
                            flexDirection: "column",
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '29vh',
                        }}>
                            <img src={searchImage} alt="No departments available"
                                 style={{maxHeight: "auto", maxWidth: "15%"}}/>
                            <p style={{marginTop: "-1.2%", marginLeft: "1%"}}>Nema podataka!</p>
                        </div>
                    )}
                    <div className="container">
                        {departments.map((department: any) => (
                        <div key={department.id} className="department-card">
                            <div className="header">
                                <div style={{flexGrow: 1, marginRight: '20px'}}>
                                    <p className="title1">{department.name}</p>
                                </div>
                                <div className="icon-container">
                                    <AppsIcon data-department-id={department?.id}
                                              style={{color: "rgba(55, 79, 121, 0.71)"}} onClick={handleClick}/>
                                </div>
                                {isAdmin &&
                                    <StyledMenu
                                        id="demo-customized-menu"
                                        MenuListProps={{
                                            'aria-labelledby': 'demo-customized-button',
                                        }}
                                        anchorEl={anchorEl}
                                        keepMounted
                                        open={Boolean(anchorEl)}
                                        onClose={handleClose}
                                    >
                                        <MenuItem
                                            onClick={() => {
                                                handleClose();
                                                setOpenUpdateDepartmentPopup(true);
                                            }}
                                        ><UpdateOutlined/>Update</MenuItem>
                                        <MenuItem onClick={() => {
                                            handleClose();
                                            handleClickOpen();
                                        }}><DeleteOutline/>Delete</MenuItem>
                                    </StyledMenu>
                                }
                            </div>
                            <div>
                                <p className="description">Na ovom studijskom programu postoje sljedeći
                                    smjerovi:</p>
                                <div className="grid-container-department">
                                    {department.majors && department.majors.map((major: any) => (
                                        <p key={major.id} className="sub-item"><Stop
                                            className="sub-item-icon"/>{major.name}</p>
                                    ))}
                                </div>
                            </div>
                        </div>
                        ))}
                    </div>
                </div>
            </div>
            {isAdmin &&
                <UpdateDepartmentDialog openUpdateDepartmentPopup={openUpdateDepartmentPopup}
                                        setOpenUpdateDepartmentPopup={setOpenUpdateDepartmentPopup}
                                        university={faculty}
                                        department={selectedDepartment}
                                        fetchDepartments={fetchDepartments}
                />
            }
            <CreateDepartmentDialog openAddDepartmentPopup={openAddDepartmentPopup}
                                    setOpenAddDepartmentPopup={setOpenAddDepartmentPopup}
                                    university={faculty}
                                    addDepartment={addDepartment}
            />
            <AlertDialog open={open} setOpen={setOpen} handleClickOpen={handleClickOpen}
                         handleClose={handleCloseDialog}
                         handleSave={() => deleteDepartment(departmentIdForDelete)}
                         dialogContent={"Da li si siguran/na da želiš trajno obrisati studijski program " + departmentName + "?"}
                         dialogTitle={"Brisanje studijskog programa"}/>
            <AlertDialog open={openDeleteUni} setOpen={setOpenDeleteUni} handleClickOpen={handleClickOpenDeleteUni}
                         handleClose={handleCloseDialogDeleteUni}
                         handleSave={deleteUniversity}
                         dialogContent={"Da li si siguran/na da želiš trajno obrisati " + faculty?.name + "?"}
                         dialogTitle={"Brisanje fakulteta"}/>
        </>
    );
}

export default FacultyDetails;
