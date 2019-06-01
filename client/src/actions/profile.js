import axios from 'axios'
import { GET_PROFILE, PROFILE_ERROR } from "./types";
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
