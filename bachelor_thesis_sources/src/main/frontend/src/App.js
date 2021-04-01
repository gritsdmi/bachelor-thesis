import './App.css';
import CommissionsListPage from "./pages/manager/CommissionsList"
import Header from "./components/Header";
import {Redirect, Route, Switch} from 'react-router-dom';
import Container from "@material-ui/core/Container";
import AutoGeneratingPage from "./pages/manager/AutoGenerating";
import ManualCreatingPage from "./pages/manager/ManualCreating";
import ManageTeachersPage from "./pages/manager/ManageTeachers";
import TeacherOverview from "./pages/teacher/TeacherOverview";
import TeacherCalendar from "./pages/teacher/TeacherCalendar";


function App() {
    return (
        <>
            <Container>
                <Header/>
                <Switch> {/* The Switch decides which component to show based on the current URL.*/}
                    <Route exact path="/" render={() => <Redirect to={"/commissions"}/>}/>
                    <Route exact path="/commissions" component={CommissionsListPage}/>
                    <Route exact path="/auto" component={AutoGeneratingPage}/>
                    <Route exact path="/manual" component={ManualCreatingPage}/>
                    <Route exact path="/manage" component={ManageTeachersPage}/>
                    <Route exact path="/teacher" component={TeacherOverview}/>
                    <Route exact path="/teacher/cal" component={TeacherCalendar}/>
                </Switch>
            </Container>
        </>

    );
}

export default App;
