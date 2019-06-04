import React, { Fragment } from 'react';
import PropTypes from 'prop-types'
import Moment from 'react-moment'
import { connect } from "react-redux";
import { deleteExperience } from '../../actions/profile'

const DATE_FORMAT = 'DD/MM/YYYY'

const Experience = ({ experiences, deleteExperience }) => {
    const experiencesArr = experiences.map(exp => (
        <tr key={exp._id}>
            <td>{exp.company}</td>
            <td className="hide-sm">{exp.title}</td>
            <td className="hide-sm">
                <Moment format={DATE_FORMAT}>{exp.from}</Moment> - {
                !exp.to ? (' Now') : <Moment format={DATE_FORMAT}>{exp.to}</Moment>
            }
            </td>
            <td>
                <button className="btn btn-danger" onClick={() => deleteExperience(exp._id)}>Delete</button>
            </td>
        </tr>
    ))
    return (
        <Fragment>
            <h2 className={'my-2'}>Experience Credentials</h2>
            <table className={'table'}>
                <thead>
                <tr>
                    <th>Company</th>
                    <th className={'hide-sm'}>Title</th>
                    <th className={'hide-sm'}>Years</th>
                    <th/>
                </tr>
                </thead>
                <tbody>
                {experiencesArr}
                </tbody>
            </table>
        </Fragment>
    );
};

Experience.propTypes = {
    experiences: PropTypes.array.isRequired,
    deleteExperience: PropTypes.func.isRequired,
};

export default connect(null, { deleteExperience })(Experience);
