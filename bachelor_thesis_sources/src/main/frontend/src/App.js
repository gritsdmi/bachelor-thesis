import './App.css';
import CommissionsListPage from "./pages/manager/CommissionsList"
import Header from "./components/Header";
import {Redirect, Route, Switch} from 'react-router-dom';
import Container from "@material-ui/core/Container";
import AutoGeneratingPage from "./pages/manager/AutoGenerating";
import ManualCreatingPage from "./pages/manager/ManualCreating";
import ManageTeachersPage from "./pages/manager/ManageTeachers";
import TeacherOverview from "./pages/teacher/TeacherOverview";
import TeacherSettings from "./pages/teacher/TeacherSettings";
import EmailTemplates from "./pages/manager/EmailTemplates";
import Login from "./pages/login/Login";


function App() {
    return (
        <>
            <Container>
                <Header/>
                <Switch> {/* The Switch decides which component to show based on the current URL.*/}
                    <Route exact path="/" render={() => <Redirect to={"/commissions"}/>}/>
                    <Route exact path="/login" component={Login}/>
                    <Route exact path="/commissions" component={CommissionsListPage}/>
                    <Route exact path="/auto" component={AutoGeneratingPage}/>
                    <Route exact path="/manual" component={ManualCreatingPage}/>
                    <Route exact path="/manage" component={ManageTeachersPage}/>
                    <Route exact path="/teacher" component={TeacherOverview}/>
                    <Route exact path="/teacher/settings" component={TeacherSettings}/>
                    <Route exact path="/emails" component={EmailTemplates}/>
                </Switch>
            </Container>
        </>

    );
}

export default App;
