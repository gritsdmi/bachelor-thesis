import './styles/App.css';
import CommissionsListPage from "./pages/manager/CommissionsList"
import Header from "./components/Header";
import {Route, Switch} from 'react-router-dom';
import Container from "@material-ui/core/Container";
import AutoGeneratingPage from "./pages/manager/AutoGenerating";
import ManualCreatingPage from "./pages/manager/ManualCreating";
import ManageTeachersPage from "./pages/manager/ManageTeachers";
import TeacherOverview from "./pages/teacher/TeacherOverview";
import TeacherSettings from "./pages/teacher/TeacherSettings";
import EmailTemplates from "./pages/manager/EmailTemplates";
import Login from "./pages/login/Login";
import {ThemeProvider} from '@material-ui/core/styles'
import femTheme from './styles/theme'
import ModeratePermissionsPage from "./pages/manager/ModeratePermissionsPage";
import CssBaseline from "@material-ui/core/CssBaseline";
import Footer from "./components/Footer";
import React from "react";


function App() {
    const [loggedUserId, setLoggedUserId] = React.useState('')
    const [loggedUserRole, setLoggedUserRole] = React.useState('')

    function onLogin(user) {
        setLoggedUserId(user.id)
        setLoggedUserRole(user.role)
    }

    function onLogout() {
        setLoggedUserId('')
        setLoggedUserRole('')
    }

    return (
        <ThemeProvider theme={femTheme}>
            <CssBaseline>
                <Container className={'mainContainer'}>
                    <Header loggedUserRole={loggedUserRole} onLogout={onLogout}/>
                    <Switch> {/* The Switch decides which component to show based on the current URL.*/}
                        {/*<Route exact path="/" render={() => <Redirect to={"/commissions"}/>}/>*/}
                        {/*<Route exact path="/" component={CommissionsListPage}/>*/}
                        <Route exact path="/" component={Login}/>
                        {/*<Route exact path="/index.html" component={CommissionsListPage}/>*/}
                        <Route exact path="/index.html" render={(props) => (
                            <Login {...props}
                                   loggedUser={loggedUserId}
                                   onLogin={onLogin}
                            />
                        )}/>
                        <Route exact path="/commissions" component={CommissionsListPage}/>
                        <Route exact path="/auto" component={AutoGeneratingPage}/>
                        <Route exact path="/manual" component={ManualCreatingPage}/>
                        {/*<Route exact path="/manual" render={(props) => <ManualCreatingPage{...props}/>}/>*/}
                        <Route exact path="/manage" component={ManageTeachersPage}/>
                        <Route exact path="/permissions" component={ModeratePermissionsPage}/>
                        <Route exact path="/teacher" component={TeacherOverview}/>
                        <Route exact path="/teacherPref" component={TeacherSettings}/>
                        <Route exact path="/emails" component={EmailTemplates}/>
                    </Switch>
                    <Footer/>
                </Container>
            </CssBaseline>
        </ThemeProvider>
    )
}

export default App;
