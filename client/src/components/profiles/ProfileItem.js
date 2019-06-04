import React from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";

const ProfileItem = ({ user: { _id, name, avatar }, status, company, location, skills }) => {
    console.log('skills',skills)
    const renderSkills = () => skills && skills.length > 0 && skills[0].split(',').slice(0, 4).map((skill, index) => {
        return <li key={index} className={'text-primary'}>
            <i className="fas fa-check"></i> {skill.trim()}
        </li>
    })
    return (
        <div className={'profile bg-light'}>
            <img src={avatar} alt={`${name}'s avatar`} className={'round-img'}/>
            <div>
                <h2>{name}</h2>
                <p>{status} {company && <span>at {company}</span>}</p>
                {location && <p className="my-1"><span>{location}</span></p>}
                <Link className="btn btn-primary" to={`/profile/${_id}`}>
                    View Profile
                </Link>
            </div>
            <ul>
                {renderSkills()}
            </ul>
        </div>
    );
};

ProfileItem.propTypes = {
    profile: PropTypes.object.isRequired
};

export default ProfileItem;

