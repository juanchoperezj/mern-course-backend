import axios from 'axios'
import {
    AUTH_ERROR,
    LOGIN_FAIL,
    LOGIN_SUCCESS,
    LOGOUT,
    REGISTER_FAIL,
    REGISTER_SUCCESS,
    USER_LOADED
} from "../actions/types";
import { setAlert } from "./alert";
import { get } from 'lodash'
import { setAuthToken } from "../utils/setAuthToken";

export const loadUser = () => async dispatch => {
    if (localStorage.token) {
        setAuthToken(localStorage.token)
    }

    try {
        const res = await axios.get('http://localhost:5000/api/auth')
        dispatch({ type: USER_LOADED, payload: res.data })
    } catch (e) {
        dispatch({ type: AUTH_ERROR })
    }

}

export const register = (data) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const body = JSON.stringify(data)

    try {
        const res = await axios.post('http://localhost:5000/api/users/register', body, config)
        console.log('register success')
        dispatch({ type: REGISTER_SUCCESS, payload: res.data })
        dispatch(loadUser())
    } catch (e) {
        console.log(e)
        const errors = get(e, 'response.data.errors')
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger', 1800)))
        }
        dispatch({ type: REGISTER_FAIL })
    }
}

export const login = (data) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const body = JSON.stringify(data)
    console.log(data)
    try {
        const res = await axios.post('http://localhost:5000/api/auth', body, config)
        dispatch({ type: LOGIN_SUCCESS, payload: res.data })
        dispatch(loadUser())
    } catch (e) {
        console.log(e)
        const errors = get(e, 'response.data.errors')
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger', 1800)))
        }
        dispatch({ type: LOGIN_FAIL })
    }
}

export const logout = () => dispatch => {
    dispatch({ type: LOGOUT })
}
