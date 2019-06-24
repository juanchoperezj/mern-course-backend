import React from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import Moment from 'react-moment'
import { connect } from "react-redux";
import { removeComment } from "../../actions/post";

const CommentItem = ({ postId, comment: { _id, text, avatar, name, user, date }, removeComment, auth }) => {
    return (
        <div className="post bg-white p-1 my-1">
            <div>
                <Link to={`/profile/${user}`}>
                    <img
                        className="round-img"
                        src={avatar}
                        alt=""
                    />
                    <h4>{name}</h4>
                </Link>
            </div>
            <div>
                <p className="my-1">
                    {text}
                </p>
                <p className="post-date">
                    Posted on <Moment format={'DD/MM/YYYY'}>{date}</Moment>
                </p>
                {!auth.loading && user === auth.user._id && (
                    <button className="btn btn-danger" onClick={() => removeComment(postId, _id)}>
                        <i className="fas fa-times"></i>
                    </button>
                )}
            </div>
        </div>
    );
};

CommentItem.propTypes = {
    removeComment: PropTypes.func,
    postId: PropTypes.any,
    comment: PropTypes.object,
    auth: PropTypes.object,
};

const mapStateToProps = ({ auth }) => ({ auth })

export default connect(mapStateToProps, { removeComment })(CommentItem);
