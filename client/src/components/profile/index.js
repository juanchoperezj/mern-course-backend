import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { getProfileById } from "../../actions/profile";
import Spinner from '../layout/Spinner'
import { Link } from "react-router-dom";
import ProfileTop from './ProfileTop'
import ProfileAbout from './ProfileAbout'

const Profile = ({ getProfileById, profile: { profile, loading }, auth, match }) => {
    useEffect(() => {
        const { id } = match.params
        getProfileById(id)
    }, [getProfileById])
    // console.log(`auth ${auth._id} && ${profile.user._id}`)
    return (
        <Fragment>
            {loading || !profile ? <Spinner/>
                : <Fragment>
                    <Link to={'/profiles'} className={'btn btn-light'}>
                        Back to profiles
                    </Link>
                    {auth.isAuthenticated && !auth.loading && auth.user._id === profile.user._id && (
                        <Link to={'/edit-profile'} className={'btn btn-dark'}>Edit Profile</Link>
                    )}

                    <div className="profile-grid my-1">
                        <ProfileTop profile={profile}/>
                        <ProfileAbout profile={profile}/>
                    </div>
                </Fragment>}
        </Fragment>
    );
};

Profile.propTypes = {
    getProfileById: PropTypes.func,
    profile: PropTypes.object,
    auth: PropTypes.object,
};
const mapStateToProps = state => ({
    profile: state.profile,
    auth: state.auth
})

export default connect(mapStateToProps, { getProfileById })(Profile);
