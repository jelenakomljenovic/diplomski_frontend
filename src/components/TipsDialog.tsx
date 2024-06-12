import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, List, ListItemButton, ListItemText } from '@mui/material';
import "./tips.css";


const TipsDialogProps {
    openDialog: boolean;
    handleCloseDialog: () => void;
}

const TipsDialog = ({ openDialog, handleCloseDialog }: TipsDialogProps) => {
    const [hover1, setHover1] = React.useState(false);
    const [hover2, setHover2] = React.useState(false);
    const [hover3, setHover3] = React.useState(false);

    return (
        <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
            PaperProps={{
                className: 'custom-dialog'
            }}
        >
            <DialogTitle align="center">Stipendije</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Pronadjite spisak dostupnih stipendija u zavisnosti od toga u kojoj državi želite
                    studirati:
                </DialogContentText>
                <List>
                    <ListItemButton style={{ backgroundColor: "transparent" }}
                                    onMouseEnter={() => setHover1(true)}
                                    onMouseLeave={() => setHover1(false)}>
                        <a href="https://archive.europa.ba/?page_id=5606" target="_blank"
                           rel="noopener noreferrer" className="custom-link"
                           style={{ textDecoration: 'none', color: hover1 ? "#3696ab" : 'inherit' }}>
                            <ListItemText primary="1. BiH" />
                        </a>
                    </ListItemButton>
                    <ListItemButton style={{ backgroundColor: "transparent" }} className="custom-link"
                                    onMouseEnter={() => setHover2(true)}
                                    onMouseLeave={() => setHover2(false)}>
                        <a href="https://www.prijemni.rs/stipendije/srbija/studentske-stipendije/"
                           target="_blank" rel="noopener noreferrer" className="custom-link"
                           style={{ textDecoration: 'none', color: hover2 ? "#3696ab" : 'inherit' }}>
                            <ListItemText primary="2. Srbija" />
                        </a>
                    </ListItemButton>
                    <ListItemButton style={{ backgroundColor: "transparent" }}
                                    onMouseEnter={() => setHover3(true)}
                                    onMouseLeave={() => setHover3(false)}>
                        <a href="http://www.stipendije.info/" target="_blank" rel="noopener noreferrer"
                           className="custom-link"
                           style={{ textDecoration: 'none', color: hover3 ? "#3696ab" : 'inherit' }}>
                            <ListItemText primary="3. Hrvatska" />
                        </a>
                    </ListItemButton>
                </List>
            </DialogContent>
        </Dialog>
    );
}

export default TipsDialog;
