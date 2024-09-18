import React, { Dispatch, SetStateAction, useState } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    FormHelperText,
    Snackbar,
    TextField
} from "@mui/material";
import "./Department.css";
import { insertDepartment } from "../api/faculty/departmentApi";
import { CreateFacultyRequest } from "../api/faculty/faculty";
import { useSnackbarHelper } from "../util/toastUtil";
import {Department} from "../api/faculty/department";

export type Majors = {
    name: string
}

type CreateDialogProps = {
    openAddDepartmentPopup: boolean;
    setOpenAddDepartmentPopup: Dispatch<SetStateAction<boolean>>;
    university: CreateFacultyRequest | undefined;
    addDepartment: (newDepartment: Department) => void;
};

export function CreateDepartmentDialog({
                                           openAddDepartmentPopup,
                                           setOpenAddDepartmentPopup,
                                           university,
                                           addDepartment
                                       }: CreateDialogProps) {
    const [departmentName, setDepartmentName] = useState('');
    const [majorNames, setMajorNames] = useState('');
    const [website, setWebsite] = useState('');
    const [errors, setErrors] = useState({
        departmentName: false,
        majorNames: false
    });
    const handleClickVariant = useSnackbarHelper();
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handleCloseSnackbar = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackbar(false);
    };

    const handleSaveButton = async () => {
        let valid = true;
        if (departmentName.trim() === '') {
            setErrors(prev => ({ ...prev, departmentName: true }));
            valid = false;
        } else {
            setErrors(prev => ({ ...prev, departmentName: false }));
        }

        if (majorNames.trim() === '') {
            setErrors(prev => ({ ...prev, majorNames: true }));
            valid = false;
        } else {
            setErrors(prev => ({ ...prev, majorNames: false }));
        }

        if (valid) {
            const names = majorNames.split(",").filter(name => name.trim() !== "").map(name => ({ name: name.trim() }));
            try {
                const response = await insertDepartment({
                    name: departmentName,
                    university: university,
                    majors: names,
                    website: website
                });
                addDepartment(response.data);
                setOpenAddDepartmentPopup(false);
                setDepartmentName('');
                setMajorNames('');
            } catch (e) {
                handleClickVariant('error', { vertical: "top", horizontal: "right" }, "Došlo je do greške!")();
            }
        }
    };

    const handleCancelButton = () => {
        setOpenAddDepartmentPopup(false);
        setDepartmentName('');
        setMajorNames('');
        setWebsite('');
        setErrors(prev => ({ ...prev, departmentName: false, majorNames: false }));
    }

    return (
        <div>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={2000}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                onClose={handleCloseSnackbar}
            />
            <Dialog open={openAddDepartmentPopup} onClose={handleCancelButton}>
                <DialogTitle align="center">Dodaj studijski program</DialogTitle>
                <DialogContent className='dialog-content' aria-label="department dialog aria label">
                    <DialogContentText className="add-department-dialog-content-text">
                        Navedi informacije o studijskom programu!
                    </DialogContentText>
                    <FormControl required>
                        <TextField
                            className='text-field'
                            name="departmentName"
                            label="Naziv studijskog programa"
                            variant="outlined"
                            inputProps={{ maxLength: 90 }}
                            onChange={(e) => setDepartmentName(e.target.value)}
                        />
                        {errors.departmentName &&
                            <FormHelperText error>Naziv studijskog programa je obavezan!</FormHelperText>}
                        <div className="text-field-div">
                            <TextField
                                className='text-field'
                                name="departmentWebsite"
                                label="Web sajt studijskog programa"
                                variant="outlined"
                                inputProps={{ maxLength: 350 }}
                                onChange={(e) => setWebsite(e.target.value)}
                            />
                        </div>
                        <div className="text-field-div">
                            <TextField
                                multiline
                                className='text-field'
                                name="majorNames"
                                label="Smjerovi razdvojeni zarezom"
                                variant="outlined"
                                inputProps={{ maxLength: 350 }}
                                onChange={(e) => setMajorNames(e.target.value)}
                            />
                            {errors.majorNames && <FormHelperText error>Smjerovi su obavezni!</FormHelperText>}
                        </div>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button style={{ marginTop: "0%", marginBottom: "2%" }} size="small" variant={"outlined"} color={"error"}
                            onClick={handleCancelButton}>Poništi</Button>
                    <Button style={{ marginTop: "0%", marginBottom: "2%", marginRight: "5%" }} size="small" variant={"outlined"} color={"success"}
                            onClick={handleSaveButton}>Potvrdi</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
