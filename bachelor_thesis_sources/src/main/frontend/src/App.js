import logo from './logo.svg';
import './App.css';
import {Link, Route, Switch} from "react-router-dom";
import home from "./home";
import anotherClass from "./anotherClass";

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo"/>
                <p>
                    Edit <code>src/App.js</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
                <ul className="nav">
                    <li><Link className="App-link" to="/">app</Link></li>
                    <li><Link className="App-link" to="/another">another</Link></li>
                    <li><Link className="App-link" to="/home">home</Link></li>
                </ul>
            </header>
            <Switch>
                {/*<Route path="/" component={App}/>*/}
                <Route path="/another" component={anotherClass}/>
                <Route path="/home" component={home}/>
            </Switch>
        </div>
  );
}

export default App;
