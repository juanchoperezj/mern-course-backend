import React, { Fragment, useState } from 'react';
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { login } from "../../../actions/auth";
import PropTypes from 'prop-types'

const Login = ({ login, isAuthenticated, loading }) => {
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    })

    const onChange = e => setLoginData({ ...loginData, [e.target.name]: e.target.value })
    const { email, password } = loginData
    const onSubmit = e => {
        e.preventDefault()
        login({ email, password })
    }

    if (loading) {
        return <p>Loading</p>
    }

    if (isAuthenticated && !loading) {
        return <Redirect to={'/dashboard'}/>
    }

    return (
        <Fragment>
            <h1 className="large text-primary">Sign In</h1>
            <p className="lead"><i className="fas fa-user"></i> Sign into Your Account</p>
            <form className="form" onSubmit={onSubmit}>
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
                <input type="submit" className="btn btn-primary" value="Login"/>
            </form>
            <p className="my-1">
                Don't have an account? <Link to="/register">Sign Up</Link>
            </p>
        </Fragment>
    )
}

Login.defaultProps = {};

Login.propTypes = {
    login: PropTypes.func,
    isAuthenticated: PropTypes.bool
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    loading: state.auth.loading
})

export default connect(mapStateToProps, { login })(Login);
