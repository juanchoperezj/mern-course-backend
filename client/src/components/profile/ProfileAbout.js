import React, { Fragment } from 'react';

const ProfileAbout = ({
                          profile: {
                              bio,
                              skills,
                              user: { name }
                          }
                      }) => {
    return (
        <div className="profile-about bg-light p-2">
            {bio && <Fragment>
                <h2 className="text-primary">{name}'s Bio</h2>
                <p>{bio}</p>
                <div cla ssName="line"></div>
            </Fragment>}
            <h2 className="text-primary">Skill Set</h2>
            <div className="skills">
                {skills && skills.length > 0 && skills.map((skill, key) => (
                    <div className="p-1" key={key}><i className="fa fa-check"></i> {skill}</div>
                ))}
            </div>
        </div>
    );
};

ProfileAbout.propTypes = {};

export default ProfileAbout;
