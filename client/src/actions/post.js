import axios from 'axios'
import {
    ADD_COMMENT,
    ADD_POST,
    DELETE_POST,
    GET_POST,
    GET_POSTS,
    POST_ERROR,
    REMOVE_COMMENT,
    UPDATE_LIKES
} from "./types";
import { get } from "lodash";
import { setAlert } from "./alert";


export const getPosts = () => async dispatch => {
    try {
        const res = await axios.get(`http://localhost:5000/api/posts`)
        dispatch({ type: GET_POSTS, payload: res.data })

    } catch (e) {
        const msg = get(e, 'e.response.statusText')
        const status = get(e, 'e.response.status')
        dispatch({ type: POST_ERROR, payload: { msg, status } })
    }
}

export const getPost = postId => async dispatch => {
    try {
        const res = await axios.get(`http://localhost:5000/api/posts/${postId}`)
        dispatch({ type: GET_POST, payload: res.data })

    } catch (e) {
        const msg = get(e, 'e.response.statusText')
        const status = get(e, 'e.response.status')
        dispatch({ type: POST_ERROR, payload: { msg, status } })
    }
}

export const toggleLike = postId => async dispatch => {
    try {
        const res = await axios.put(`http://localhost:5000/api/posts/like/${postId}`)
        dispatch({ type: UPDATE_LIKES, payload: { postId, likes: res.data.map(like => like) } })

    } catch (e) {
        const msg = get(e, 'e.response.statusText')
        const status = get(e, 'e.response.status')
        console.log('e', e)
        dispatch(setAlert('Error updating the post likes'))
        dispatch({ type: POST_ERROR, payload: { msg, status } })
    }
}

export const deletePost = postId => async dispatch => {
    try {
        await axios.delete(`http://localhost:5000/api/posts/${postId}`)
        dispatch({ type: DELETE_POST, payload: postId })
        dispatch(setAlert('Post has been deleted', 'success'))
    } catch (e) {
        const msg = get(e, 'e.response.statusText')
        const status = get(e, 'e.response.status')
        console.log('e', e)
        dispatch(setAlert('Error updating the post likes', 'error'))
        dispatch({ type: POST_ERROR, payload: { msg, status } })
    }
}

export const addPost = data => async dispatch => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const res = await axios.post(`http://localhost:5000/api/posts/`, data, config)
        dispatch({ type: ADD_POST, payload: res.data })
        dispatch(setAlert('Post created', 'success'))
    } catch (e) {
        const msg = get(e, 'e.response.statusText')
        const status = get(e, 'e.response.status')
        console.log('e', e)
        dispatch(setAlert('Error updating the post likes', 'error'))
        dispatch({ type: POST_ERROR, payload: { msg, status } })
    }
}

export const addComment = (postId, data) => async dispatch => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const res = await axios.post(`http://localhost:5000/api/posts/comment/${postId}`, data, config)
        dispatch({ type: ADD_COMMENT, payload: res.data })
        dispatch(setAlert('Comment added', 'success'))
    } catch (e) {
        const msg = get(e, 'e.response.statusText')
        const status = get(e, 'e.response.status')
        console.log('e', e)
        dispatch(setAlert('Error updating the post likes', 'error'))
        dispatch({ type: POST_ERROR, payload: { msg, status } })
    }
}

export const removeComment = (postId, commentId) => async dispatch => {
    try {
        await axios.delete(`http://localhost:5000/api/posts/comment/${postId}/${commentId}`)
        dispatch({ type: REMOVE_COMMENT, payload: commentId })
        dispatch(setAlert('Comment removed', 'success'))
    } catch (e) {
        const msg = get(e, 'e.response.statusText')
        const status = get(e, 'e.response.status')
        console.log('e', e)
        dispatch(setAlert('Error updating the post likes', 'error'))
        dispatch({ type: POST_ERROR, payload: { msg, status } })
    }
}
