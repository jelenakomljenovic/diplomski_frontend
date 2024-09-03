import * as React from 'react';
import {Navigate, Outlet, Route, Routes, useLocation} from "react-router-dom";
import {paths} from "../constants/urlConstants";
import HomePage from "../components/HomePage";
import FacultiesPage from "../components/FacultiesPage";
import {Box, CssBaseline} from "@mui/material";
import TopBar from "../TopBar";
import FacultyDetails from "../components/FacultyDetails";
import FacultyLocations from "../components/FacultyLocations";
import EditGeneralInfo from "../components/EditGeneralInfo";
import {AuthProvider} from "../login/AuthProvider";
import {RemoveAdminRole} from "../components/administration/RemoveAdminRole";
import EditProfileInfo from "../components/administration/EditProfileInfo";
import {PasswordReset} from "../components/password/PasswordReset";
import ParseToken from "../components/password/ParseToken";
import {LinkExpired} from "../components/password/LinkExpired";
import AddNewAdmin from "../components/administration/AddNewAdmin";
import InsertImages from "../components/administration/InsertImages";
import PredictionPage from "../components/prediction/PredictionPage";
import {PasswordApproved} from "../components/password/PasswordApproved";
import ErrorPage from "../error/ErrorPage";
import QuestionnairePage from "../components/prediction/QuestionnairePage";
import InsertFacultyDialog from "../components/InsertFacultyDialog";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function RootRoutes() {
    const query = useQuery();

    return (
        <Box>
            <CssBaseline/>
            <Routes>
                <Route path={paths.CHECK_TOKEN} element={<ParseToken token={query.get("token")}/>}/>
                <Route path={paths.VALIDATION} element={<PasswordReset/>}/>
                <Route path={paths.LINK_EXPIRED} element={<LinkExpired/>}/>
                <Route path={paths.APPROVED} element={<PasswordApproved/>}/>
                <Route element={<WithTopBar/>}>
                    <Route path={'/'} element={<Navigate to={paths.HOME}/>}/>
                    <Route path={paths.HOME} element={<HomePage/>}/>
                    <Route path={paths.FACULTIES} element={<FacultiesPage/>}/>
                    <Route path={paths.DETAILS} element={<FacultyDetails/>}/>
                    <Route path={paths.LOCATIONS} element={<FacultyLocations/>}/>
                    <Route path={paths.EDIT_DETAILS} element={<EditGeneralInfo/>}/>
                    <Route path={paths.EDIT_PROFILE} element={<EditProfileInfo/>}/>
                    <Route path={paths.SETTINGS} element={<RemoveAdminRole/>}/>
                    <Route path={paths.ADD_ADMIN} element={<AddNewAdmin/>}/>
                    <Route path={paths.IMAGES} element={<InsertImages/>}/>
                    <Route path={paths.PREDICTION} element={<PredictionPage/>}/>
                    <Route path={paths.QUESTIONNAIRE} element={<QuestionnairePage/>}/>
                    <Route path={paths.INSERT_FACULTY} element={<InsertFacultyDialog/>}/>
                    <Route path="*" element={<ErrorPage/>}/>
                </Route>
            </Routes>
        </Box>
    );
}

function WithTopBar() {
    return (
        <AuthProvider>
            <TopBar/>
            <Outlet/>
        </AuthProvider>
    );
}

export default RootRoutes;