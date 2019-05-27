import { AUTH_ERROR, REGISTER_FAIL, REGISTER_SUCCESS, USER_LOADED } from "../actions/types";

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
            localStorage.setItem('token', payload.token)
            return {
                ...state,
                isAuthenticated: true,
                loading: false,
                token: payload.token
            }
        case REGISTER_FAIL:
        case AUTH_ERROR:
            localStorage.removeItem('token')
            return {
                ...state,
                isAuthenticated: false,
                loading: false,
                token: null
            }
        case USER_LOADED:
            return {
                ...state,
                isAuthenticated: true,
                loading: false,
                user: payload
            }
        default:
            return state
    }
}
