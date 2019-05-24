import React, { Fragment } from 'react';
import './App.css';
import Landing from './components/layout/Landing'
import NavBar from './components/layout/Navbar'

const App = () => (
    <Fragment>
        <NavBar/>
        <Landing/>
    </Fragment>
);


export default App;
