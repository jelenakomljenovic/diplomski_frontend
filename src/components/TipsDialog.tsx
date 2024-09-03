import React from 'react';
import {Dialog, DialogContent, DialogContentText, DialogTitle, List, ListItemButton, ListItemText} from '@mui/material';
import "./tips.css";


type TipsDialogProps = {
    openDialog: boolean;
    handleCloseDialog: () => void;
    exam: boolean;
    title: String;
    contentText: String;
}

const TipsDialog = ({openDialog, handleCloseDialog, exam, title, contentText}: TipsDialogProps) => {
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
            <DialogTitle align="center">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {contentText}
                </DialogContentText>
                <List>
                    <ListItemButton style={{backgroundColor: "transparent"}}
                                    onMouseEnter={() => setHover1(true)}
                                    onMouseLeave={() => setHover1(false)}>
                        {exam ? (<a href="https://studomat.ba/rubrika/univerziteti-u-bih/"
                                    target="_blank" rel="noopener noreferrer" className="custom-link"
                                    style={{textDecoration: 'none', color: hover1 ? "#3696ab" : 'inherit'}}>
                                <ListItemText primary="1. BiH"/>
                            </a>) :
                            (<a href="https://studomat.ba/rubrika/prilike/stipendije/"
                                target="_blank" rel="noopener noreferrer" className="custom-link"
                                style={{textDecoration: 'none', color: hover1 ? "#3696ab" : 'inherit'}}> <ListItemText
                                primary="1. BiH"/>
                            </a>)}
                    </ListItemButton>
                    <ListItemButton style={{backgroundColor: "transparent"}} className="custom-link"
                                    onMouseEnter={() => setHover2(true)}
                                    onMouseLeave={() => setHover2(false)}>
                        {exam ? (<a href="https://www.prijemni.rs/prijemni-ispit/"
                                    target="_blank" rel="noopener noreferrer" className="custom-link"
                                    style={{textDecoration: 'none', color: hover2 ? "#3696ab" : 'inherit'}}>
                                <ListItemText primary="2. Srbija"/>
                            </a>) :
                            (<a href="https://www.prijemni.rs/stipendije/srbija/studentske-stipendije/"
                                target="_blank" rel="noopener noreferrer" className="custom-link"
                                style={{textDecoration: 'none', color: hover2 ? "#3696ab" : 'inherit'}}> <ListItemText
                                primary="2. Srbija"/>
                            </a>)}
                    </ListItemButton>
                    <ListItemButton style={{backgroundColor: "transparent"}}
                                    onMouseEnter={() => setHover3(true)}
                                    onMouseLeave={() => setHover3(false)}>
                        {exam ? (<a href="https://www.trinom.hr/trinom/pripreme-za-prijemne-ispite"
                                    target="_blank" rel="noopener noreferrer" className="custom-link"
                                    style={{textDecoration: 'none', color: hover3 ? "#3696ab" : 'inherit'}}>
                                <ListItemText primary="3. Hrvatska"/>
                            </a>) :
                            (<a href="http://www.stipendije.info/"
                                target="_blank" rel="noopener noreferrer" className="custom-link"
                                style={{textDecoration: 'none', color: hover3 ? "#3696ab" : 'inherit'}}> <ListItemText
                                primary="3. Hrvatska"/>
                            </a>)}
                    </ListItemButton>
                </List>
            </DialogContent>
        </Dialog>
    );
}

export default TipsDialog;
