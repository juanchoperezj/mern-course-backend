import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import {Link} from "react-router-dom";
import { getCurrentProfile } from "../../actions/profile";
import Spinner from '../layout/Spinner'
import DashboardActions from './DashboardActions'

const Dashboard = ({ auth: { isAuthenticated, user }, getCurrentProfile, profile: { loading, profile } }) => {
    useEffect(() => {
        getCurrentProfile()
    }, [])

    return loading && profile === null
        ? (<Spinner/>)
        : (
            <Fragment>
                <h1 className={'large text-primary'}> Dashboard</h1>
                <p className={'lead'}>
                    <i className={'fa fa-user'}></i> Welcome {user && user.name}
                </p>
                {profile !== null ? <DashboardActions/>
                    : <Fragment>
                        <p>You have not setup a profile, please add some info</p>
                        <Link to={'/create-profile'} classname={'btn btn-primary my-1'}>
                            Create profile
                        </Link>
                    </Fragment>}
            </Fragment>
        )
}

Dashboard.propTypes = {
    auth: PropTypes.object.isRequired,
    getCurrentProfile: PropTypes.func.isRequired,
    profile: PropTypes.object
}


// destructure the state
const mapStateToProps = ({ auth, profile }) => ({
    auth,
    profile
})
export default connect(mapStateToProps, { getCurrentProfile })(Dashboard);
