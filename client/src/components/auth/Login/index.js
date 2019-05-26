import React, { Fragment, useState } from 'react';
import { Link } from "react-router-dom";

const Login = () => {
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    })

    const onChange = e => setLoginData({ ...loginData, [e.target.name]: e.target.value })
    const { email, password } = loginData
    const onSubmit = e => {
        e.preventDefault()

    }
    return (
        <Fragment>
            <h1 className="large text-primary">Sign In</h1>
            <p className="lead"><i className="fas fa-user"></i> Sign into Your Account</p>
            <form className="form" action="dashboard.html">
                <div className="form-group">
                    <input
                        type="email"
                        placeholder="Email Address"
                        name="email"
                        required
                        value={email}
                        onChange={onChange}
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={password}
                        onChange={onChange}
                    />
                </div>
                <input type="submit" className="btn btn-primary" value="Login" onSubmit={onSubmit}/>
            </form>
            <p className="my-1">
                Don't have an account? <Link to="/register">Sign Up</Link>
            </p>
        </Fragment>
    )
}

Login.defaultProps = {};

Login.propTypes = {};

export default Login;
