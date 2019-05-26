import { REGISTER_FAIL, REGISTER_SUCCESS } from "../actions/types";

const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user: null
}

export default function (state = initialState, action) {
    const { payload, type } = action
    switch (type) {
        case REGISTER_SUCCESS:
            localStorage.setItem('token')
            return {
                ...state,
                isAuthenticated: true,
                loading: false,
            }
        case REGISTER_FAIL:
            return {
                ...state,
                isAuthenticated: false,
                loading: false
            }
        default:
            return state
    }
}
