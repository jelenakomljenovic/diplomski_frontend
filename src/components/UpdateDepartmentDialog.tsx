import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
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
    department: Department | undefined
};

export function UpdateDepartmentDialog({
                                           openUpdateDepartmentPopup,
                                           setOpenUpdateDepartmentPopup,
                                           department,
                                           university
                                       }: UpdateDialogProps) {
    const [departmentId, setDepartmentId] = useState<number | undefined>(-1);
    const [departmentName, setDepartmentName] = useState<string | undefined>("");
    const [majorValue, setMajorValue] = useState<string | undefined>('');
    const handleClickVariant = useSnackbarHelper();

    useEffect(() => {
        if (openUpdateDepartmentPopup) {
            setDepartmentName(department?.name);
            setMajorValue(department?.majors.map((item: any) => item.name).join(', '));
            setDepartmentId(department?.id);
        }
    }, [openUpdateDepartmentPopup])

    const handleSaveButton = async () => {
        if (majorValue !== undefined) {
            const names = majorValue?.split(",").filter(name => name.trim() !== "").map(name => ({name: name.trim()}));
            await updateDepartment(departmentId, {
                name: departmentName,
                university: university,
                majors: names
            });
        }
        setOpenUpdateDepartmentPopup(false);
    };

    const handleCancelButton = () => {
        setOpenUpdateDepartmentPopup(false);
    }


    return (
        <div>
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
                        <div className="text-field-div">
                            <TextField multiline className='text-field' name="majorNames" label="Smjerovi"
                                       value={majorValue}
                                       variant="outlined" inputProps={{maxLength: 150}}
                                       onChange={(e) => setMajorValue(e.target.value)}/>
                        </div>
                    </FormControl>
                    {/*{formError.boardName && <FormHelperText>{i18next.t('required')}</FormHelperText>}*/}
                </DialogContent>
                <DialogActions>
                    <Button size="small" variant={"outlined"} color={"error"}
                            style={{minWidth: 70}} onClick={handleCancelButton}>Poništi</Button>
                    <Button size="small" variant={"outlined"} color={"success"}
                            style={{minWidth: 70}} onClick={handleSaveButton}>Potvrdi</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}