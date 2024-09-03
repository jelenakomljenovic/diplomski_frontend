import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    FormHelperText,
    TextField
} from "@mui/material";
import "./Department.css";
import {updateDepartment} from "../api/faculty/departmentApi";
import {CreateFacultyRequest} from "../api/faculty/faculty";
import {Department} from "../api/faculty/department";
import {useSnackbarHelper} from "../util/toastUtil";


export type Majors = {
    name: string
}

type UpdateDialogProps = {
    openUpdateDepartmentPopup: boolean;
    setOpenUpdateDepartmentPopup: Dispatch<SetStateAction<boolean>>;
    university: CreateFacultyRequest | undefined,
    department: Department | undefined,
    fetchDepartments: () => void;
};

export function UpdateDepartmentDialog({
                                           openUpdateDepartmentPopup,
                                           setOpenUpdateDepartmentPopup,
                                           department,
                                           university,
                                           fetchDepartments
                                       }: UpdateDialogProps) {
    const [departmentId, setDepartmentId] = useState<number | undefined>(-1);
    const [departmentName, setDepartmentName] = useState<string | undefined>("");
    const [majorValue, setMajorValue] = useState<string | undefined>('');
    const handleClickVariant = useSnackbarHelper();
    const [errors, setErrors] = useState({
        departmentName: false,
        majorNames: false
    });

    useEffect(() => {
        if (openUpdateDepartmentPopup) {
            setDepartmentName(department?.name);
            setMajorValue(department?.majors.map((item: any) => item.name).join(', '));
            setDepartmentId(department?.id);
        }
    }, [openUpdateDepartmentPopup])

    const handleSaveButton = async () => {
        let valid = true;
        if (departmentName?.trim() === '') {
            setErrors(prev => ({...prev, departmentName: true}));
            valid = false;
        } else {
            setErrors(prev => ({...prev, departmentName: false}));
        }

        if (majorValue?.trim() === '') {
            setErrors(prev => ({...prev, majorNames: true}));
            valid = false;
        } else {
            setErrors(prev => ({...prev, majorNames: false}));
        }

        if (valid) {
            if (majorValue !== undefined) {
                const names = majorValue?.split(",").filter(name => name.trim() !== "").map(name => ({name: name.trim()}));
                try {
                    const updatedDepartment = await updateDepartment(departmentId, {
                        name: departmentName,
                        university: university,
                        majors: names
                    });
                    setOpenUpdateDepartmentPopup(false);
                    setDepartmentName('');
                    setMajorValue('');
                    fetchDepartments();
                } catch (e) {
                    handleClickVariant('error', {vertical: "top", horizontal: "right"}, "Došlo je do greške!")();
                }
            }
        }
    }


    const handleCancelButton = () => {
        setOpenUpdateDepartmentPopup(false);
        setDepartmentName('');
        setMajorValue('');
        setErrors(prev => ({...prev, departmentName: false, majorNames: false}));
    }


    return (
        <React.Fragment>
            <Dialog open={openUpdateDepartmentPopup} onClose={handleCancelButton}>
                <DialogTitle align="center">Ažuriraj studijski program</DialogTitle>
                <DialogContent className='dialog-content' aria-label="department dialog aria label">
                    <DialogContentText className="add-department-dialog-content-text">
                        Navedi informacije o studijskom programu!
                    </DialogContentText>
                    <FormControl required>
                        <TextField className='text-field' name="departmentName" label="Naziv studijskog programa"
                                   value={departmentName}
                                   variant="outlined" inputProps={{maxLength: 50}}
                                   onChange={(e) => setDepartmentName(e.target.value)}/>
                        {errors.departmentName &&
                            <FormHelperText error>Naziv studijskog programa je obavezan!</FormHelperText>}
                        <div className="text-field-div">
                            <TextField multiline className='text-field' name="majorNames" label="Smjerovi"
                                       value={majorValue}
                                       variant="outlined" inputProps={{maxLength: 150}}
                                       onChange={(e) => setMajorValue(e.target.value)}/>
                            {errors.majorNames && <FormHelperText error>Smjerovi su obavezni!</FormHelperText>}
                        </div>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button size="small" variant={"outlined"} color={"error"}
                            style={{marginTop: "-5%", marginBottom: "2%"}}
                            onClick={handleCancelButton}>Poništi</Button>
                    <Button size="small" variant={"outlined"} color={"success"}
                            style={{marginTop: "-5%", marginBottom: "2%", marginRight: "5%"}}
                            onClick={handleSaveButton}>Potvrdi</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}