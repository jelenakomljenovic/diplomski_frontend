import * as React from 'react';
import {styled, ThemeProvider} from "@mui/styles";
import {createTheme} from "@mui/material/styles";
import RootRoutes from "./routes/RootRoutes";
import {BrowserRouter} from "react-router-dom";
import "./index.css";
import {MaterialDesignContent, SnackbarProvider} from "notistack";
import SnackbarCloseButton from "./util/SnackBarCloseButton";

const StyledMaterialDesignContent = styled(MaterialDesignContent)(() => ({
    '&.notistack-MuiContent-success': {
        backgroundColor: '#5ea46a',
    },
    '&.notistack-MuiContent-error': {
        backgroundColor: '#970C0C',
    },
}));

function App() {
    const theme = createTheme();

    return (
        <SnackbarProvider maxSnack={3} Components={{
            success: StyledMaterialDesignContent,
            error: StyledMaterialDesignContent,
        }} action={snackbarKey => <SnackbarCloseButton snackbarKey={snackbarKey} />}>
            <ThemeProvider theme={theme}>
                <BrowserRouter>
                    <RootRoutes/>
                </BrowserRouter>
            </ThemeProvider>
        </SnackbarProvider>
    );
}

export default App;