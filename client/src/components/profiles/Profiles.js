import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import Spinner from '../layout/Spinner'
import { getProfiles } from "../../actions/profile";
import ProfileItem from "./ProfileItem";

const Profiles = ({ profile: { profiles, loading }, getProfiles }) => {
    useEffect(() => {
        getProfiles()
    }, [getProfiles])

    const renderProfiles = data => data.map(profile => <ProfileItem {...profile} key={profile._id}/>)

    return (
        <Fragment>
            {loading && <Spinner/>}
            {!loading && <Fragment>
                <h1 className="large text-primary">Developers</h1>
                <p className="lead">
                    <i className="fas fa-connectdevelop"></i> Browse & connect with developers
                </p>
                <div className="profiles">
                    {profiles && profiles.length > 0
                        ? renderProfiles(profiles)
                        : <h4>No profiles found...</h4>}
                </div>
            </Fragment>}
        </Fragment>
    );
};

Profiles.propTypes = {
    profile: PropTypes.object.isRequired,
    getProfiles: PropTypes.func,
};

const mapStateToProps = state => ({
    profile: state.profile
})

export default connect(mapStateToProps, { getProfiles })(Profiles);
