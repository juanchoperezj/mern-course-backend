import {
    CLEAR_PROFILE,
    GET_PROFILE,
    GET_PROFILES,
    GET_PROFILES_ERROR,
    GET_REPOS,
    PROFILE_ERROR,
    UPDATE_PROFILE
} from "../actions/types";

const initialState = {
    profile: null,
    profiles: [],
    repos: [],
    loading: true,
    error: {}
}

export default function (state = initialState, action) {
    const { type, payload } = action

    switch (type) {
        case GET_PROFILE:
        case UPDATE_PROFILE:
            return {
                ...state,
                profile: payload,
                loading: false
            }
        case GET_PROFILES:
            return {
                ...state,
                profiles: payload,
                loading: false
            }
        case PROFILE_ERROR:
        case GET_PROFILES_ERROR:
            return {
                ...state,
                error: payload,
                loading: false,
                repos: []
            }
        case CLEAR_PROFILE:
            return {
                ...state,
                profile: null,
                loading: false,
                repos: [],
            }
        case GET_REPOS:
            return {
                ...state,
                repos: payload
            }
        default:
            return state
    }

}
