import React from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { Redirect, Route } from 'react-router-dom'

const PrivateRoute = (
    {
        component: Component,
        redirectRoute = '/login',
        auth: { loading, isAuthenticated },
        ...otherProps
    }
) => {
    return <Route {...otherProps} render={props => !isAuthenticated && !loading
        ? (<Redirect to={redirectRoute}/>)
        : <Component {...props}/>
    }/>
}

PrivateRoute.propTypes = {
    test: PropTypes.any,
    auth: PropTypes.object.isRequired,
    redirectRoute: PropTypes.string
}
const mapStateToProps = state => ({
    auth: state.auth
})
export default connect(mapStateToProps)(PrivateRoute);
