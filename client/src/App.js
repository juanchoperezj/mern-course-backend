import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './App.css';
import Landing from './components/layout/Landing'
import NavBar from './components/layout/Navbar'
import Register from './components/auth/Register'
import Login from './components/auth/Login'
import { Provider } from 'react-redux'
import store from './store'
import Alert from './components/layout/Alert'
import { setAuthToken } from "./utils/setAuthToken";

if (localStorage.token) {
    setAuthToken(localStorage.token)
}

const App = () => (
    <Provider store={store}>
        <Router>
            <Fragment>
                <NavBar/>
                <Route exact path={'/'} component={Landing}/>
                <section className="container">
                    <Alert/>
                    <Switch>
                        <Route exact path={'/register'} component={Register}/>
                        <Route exact path={'/login'} component={Login}/>
                        <Route/>
                    </Switch>
                </section>
            </Fragment>
        </Router>
    </Provider>
);


export default App;
