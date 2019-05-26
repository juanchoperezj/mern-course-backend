import axios from 'axios'
import { REGISTER_FAIL, REGISTER_SUCCESS } from "../actions/types";
import { setAlert } from "./alert";

export const register = (data) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const body = JSON.stringify(data)

    try {
        const res = await axios.post('http://localhost:5000/api/users/register', body, config)
        dispatch({ type: REGISTER_SUCCESS, payload: res.data })
    } catch (e) {
        const errors = e.response.data.errors
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger', 1800)))
        }
        dispatch({ type: REGISTER_FAIL })
    }
}
