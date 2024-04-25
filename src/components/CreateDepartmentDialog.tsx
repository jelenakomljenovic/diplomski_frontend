import React, {Dispatch, SetStateAction, useState} from 'react';
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
import {insertDepartment} from "../api/faculty/departmentApi";
import {CreateFacultyRequest} from "../api/faculty/faculty";

export type Majors = {
    name: string
}

type CreateDialogProps = {
    openAddDepartmentPopup: boolean;
    setOpenAddDepartmentPopup: Dispatch<SetStateAction<boolean>>;
    university: CreateFacultyRequest | undefined
};

export function CreateDepartmentDialog({
                                           openAddDepartmentPopup,
                                           setOpenAddDepartmentPopup,
    university
                                       }: CreateDialogProps) {
    const [departmentName, setDepartmentName] = useState('');
    const [majorNames, setMajorNames] = useState('');

    const handleSaveButton = async () => {
        if (majorNames.length > 0) {
            const names = majorNames.split(",").filter(name => name.trim() !== "").map(name => ({ name: name.trim() }));
          console.log(names);
          await insertDepartment({
              name: departmentName,
              university: university,
              majors: names
          })
        }
        setOpenAddDepartmentPopup(false);
    };

    const handleCancelButton = () => {
        setOpenAddDepartmentPopup(false);
    }


    return (
        <div>
            <Dialog open={openAddDepartmentPopup} onClose={handleCancelButton}>
                <DialogTitle align="center">Dodaj studijski program</DialogTitle>
                <DialogContent className='dialog-content' aria-label="department dialog aria label">
                    <DialogContentText className="add-department-dialog-content-text">
                        Navedi informacije o studijskom programu!
                    </DialogContentText>
                    <FormControl required>
                        <TextField className='text-field' name="departmentName" label="Naziv studijskog programa"
                                   variant="outlined" inputProps={{maxLength: 50}} onChange={(e) => setDepartmentName(e.target.value)}/>
                        <div className="text-field-div">
                            <TextField multiline className='text-field' name="majorNames" label="Smjerovi"
                                       variant="outlined" inputProps={{maxLength: 150}}  onChange={(e) => setMajorNames(e.target.value)}/>
                        </div>
                    </FormControl>
                    {/*{formError.boardName && <FormHelperText>{i18next.t('required')}</FormHelperText>}*/}
                </DialogContent>
                <DialogActions>
                    <Button size="small" variant={"outlined"} color={"error"}
                            style={{minWidth: 70}} onClick={handleCancelButton}>Ponisti</Button>
                    <Button size="small" variant={"outlined"} color={"success"}
                            style={{minWidth: 70}} onClick={handleSaveButton}>Potvrdi</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}