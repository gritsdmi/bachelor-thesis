import './App.css';
import CommissionsListPage from "./pages/CommissionsList"
import Header from "./components/Header";
import {Redirect, Route, Switch} from 'react-router-dom';
import Container from "@material-ui/core/Container";
import AutoGeneratingPage from "./pages/AutoGenerating";
import ManualCreatingPage from "./pages/ManualCreating";
import ManageTeachersPage from "./pages/ManageTeachers";


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
                </Switch>
            </Container>
        </>

    );
}

export default App;
