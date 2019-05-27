import React from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";

const Dashboard = ({ auth: { isAuthenticated, loading } }) => {
    if (loading) return <p>Loading</p>
    return <div>Dashboard</div>
}

Dashboard.propTypes = {
    test: PropTypes.any
}

const mapStateToProps = state => ({
    auth: state.auth
})
export default connect(mapStateToProps)(Dashboard);
