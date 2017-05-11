import {SEARCH, SEARCH_COMPLETE, SEARCH_INIT, SET_SEARCH_PARAMS} from "../actions/types";

const initState = {
    isLoading: false,
    params: {
        startDate: new Date()
    }
}
export default (state = initState, action) => {
    switch (action.type) {
        case SEARCH:
        case SEARCH_INIT:
            return {...state, isLoading: true}
        case SEARCH_COMPLETE:
            const {payload} = action
            return {...state, isLoading: false, payload}
        case SET_SEARCH_PARAMS:
            const {params} = state
            const newParams = Object.assign({}, initState.params, (action.fromScratch ? {} : params), action.params)
            return {...state, params: newParams}
        default:
            return state
    }
}