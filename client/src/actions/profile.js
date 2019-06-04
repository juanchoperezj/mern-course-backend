import axios from 'axios'
import {
    CLEAR_PROFILE,
    DELETE_ACCOUNT,
    GET_PROFILE,
    GET_PROFILES,
    GET_PROFILES_ERROR,
    GET_REPOS,
    PROFILE_ERROR,
    UPDATE_PROFILE
} from "./types";
import { get } from 'lodash'
import { setAlert } from "./alert";

export const getCurrentProfile = () => async dispatch => {
    try {
        const res = await axios.get('http://localhost:5000/api/profile/me')
        // console.log('res', res)
        dispatch({ type: GET_PROFILE, payload: res.data })
    } catch (error) {
        // console.log('e', error)
        const msg = get(error, 'e.response.statusText')
        const status = get(error, 'e.response.status')
        dispatch({ type: PROFILE_ERROR, payload: { msg, status } })
    }
}

export const createProfile = (formData, history, edit = false) => async dispatch => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const res = await axios.post('http://localhost:5000/api/profile', { profile: formData }, config)
        dispatch({ type: GET_PROFILE, payload: res.data })
        dispatch(setAlert(edit ? 'Profile updated' : 'Profile created', 'success', 5000))

        if (!edit) {
            history.push('/dashboard')
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }

    } catch (error) {
        const errors = get(error, 'response.data.errors')
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger', 3000)))
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
        const msg = get(error, 'e.response.statusText')
        const status = get(error, 'e.response.status')
        dispatch({ type: PROFILE_ERROR, payload: { msg, status } })
    }

}

export const addExperience = (formData, history) => async dispatch => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const res = await axios.put('http://localhost:5000/api/profile/experience', { experience: formData }, config)
        dispatch({ type: UPDATE_PROFILE, payload: res.data })
        dispatch(setAlert('Experience added', 'success', 5000))

        history.push('/dashboard')
        window.scrollTo({ top: 0, behavior: 'smooth' })

    } catch (error) {
        const errors = get(error, 'response.data.errors')
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger', 3000)))
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
        const msg = get(error, 'e.response.statusText')
        const status = get(error, 'e.response.status')
        dispatch({ type: PROFILE_ERROR, payload: { msg, status } })
    }
}

export const addEducation = (formData, history) => async dispatch => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const res = await axios.put('http://localhost:5000/api/profile/education', { education: formData }, config)
        dispatch({ type: UPDATE_PROFILE, payload: res.data })
        dispatch(setAlert('Education added', 'success', 5000))

        history.push('/dashboard')
        window.scrollTo({ top: 0, behavior: 'smooth' })

    } catch (error) {
        const errors = get(error, 'response.data.errors')
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger', 3000)))
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
        const msg = get(error, 'e.response.statusText')
        const status = get(error, 'e.response.status')
        dispatch({ type: PROFILE_ERROR, payload: { msg, status } })
    }
}

export const deleteExperience = id => async dispatch => {
    try {
        const res = await axios.delete(`http://localhost:5000/api/profile/experience/${id}`)
        dispatch({ type: UPDATE_PROFILE, payload: res.data })
        dispatch(setAlert('Experience removed', 'success', 3000))
    } catch (error) {
        const msg = get(error, 'e.response.statusText')
        const status = get(error, 'e.response.status')
        dispatch({ type: PROFILE_ERROR, payload: { msg, status } })
    }
}

export const deleteEducation = id => async dispatch => {
    try {
        const res = await axios.delete(`http://localhost:5000/api/profile/education/${id}`)
        dispatch({ type: UPDATE_PROFILE, payload: res.data })
        dispatch(setAlert('Education removed', 'success', 3000))
    } catch (error) {
        const msg = get(error, 'e.response.statusText')
        const status = get(error, 'e.response.status')
        dispatch({ type: PROFILE_ERROR, payload: { msg, status } })
    }
}

export const deleteAccount = () => async dispatch => {
    if (window.confirm('Are you sure? This can NOT be undone!')) {
        try {
            axios.delete('http://localhost:5000/api/profile')
            dispatch({ type: CLEAR_PROFILE })
            dispatch({ type: DELETE_ACCOUNT })
            dispatch(setAlert('Your account has been permanently removed', '', 3000))
        } catch (error) {
            const msg = get(error, 'e.response.statusText')
            const status = get(error, 'e.response.status')
            dispatch({ type: PROFILE_ERROR, payload: { msg, status } })
        }
    }
}

export const getProfiles = () => async dispatch => {
    // dispatch({ type: CLEAR_PROFILE })
    try {
        const res = await axios.get('http://localhost:5000/api/profile')
        dispatch({ type: GET_PROFILES, payload: res.data })
    } catch (error) {
        const msg = get(error, 'e.response.statusText')
        const status = get(error, 'e.response.status')
        dispatch({ type: GET_PROFILES_ERROR, payload: { msg, status } })
    }
}

export const getProfileById = userId => async dispatch => {
    try {
        const res = await axios.get(`http://localhost:5000/api/profile/user/${userId}`)
        dispatch({ type: GET_PROFILE, payload: res.data })
    } catch (error) {
        // console.log('e', error)
        const msg = get(error, 'e.response.statusText')
        const status = get(error, 'e.response.status')
        dispatch({ type: PROFILE_ERROR, payload: { msg, status } })
    }
}

export const getGithubRepos = username => async dispatch => {
    dispatch({ type: CLEAR_PROFILE })
    try {
        const res = await axios.get(`http://localhost:5000/api/profile/github/${username}`)
        dispatch({ type: GET_REPOS, payload: res.data })
    } catch (error) {
        const msg = get(error, 'e.response.statusText')
        const status = get(error, 'e.response.status')
        dispatch({ type: PROFILE_ERROR, payload: { msg, status } })
    }
}
