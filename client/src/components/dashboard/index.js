import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { deleteAccount, getCurrentProfile } from "../../actions/profile";
import Spinner from '../layout/Spinner'
import DashboardActions from './DashboardActions'
import Experience from './Experience'
import Education from "./Education";

const Dashboard = ({ auth: { isAuthenticated, user }, getCurrentProfile, profile: { loading, profile }, deleteAccount }) => {
    useEffect(() => {
        getCurrentProfile()
    }, [getCurrentProfile])

    return loading && profile === null
        ? (<Spinner/>)
        : (
            <Fragment>
                <h1 className={'large text-primary'}> Dashboard</h1>
                <p className={'lead'}>
                    <i className={'fa fa-user'}></i> Welcome {user && user.name}
                </p>
                {profile !== null
                    ? (<Fragment>
                        <DashboardActions/>
                        <Experience experiences={profile.experience}/>
                        <Education education={profile.education}/>
                        <div className="my-2">
                            <button className="btn btn-danger" onClick={deleteAccount}>
                                <i className="fas fa-user-minus"></i> {' '}
                                DELETE my account
                            </button>
                        </div>
                    </Fragment>)
                    : (<Fragment>
                        <p>You have not setup a profile, please add some info</p>
                        <Link to={'/create-profile'} className={'btn btn-primary my-1'}>
                            Create profile
                        </Link>
                    </Fragment>)}
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
export default connect(mapStateToProps, {
    getCurrentProfile,
    deleteAccount
})(Dashboard);
