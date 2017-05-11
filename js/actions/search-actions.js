// const fetch = ()=>({})
// const Headers = (a)=>({})
import {apiAddress} from "../client";
import token from "../token";

import {SEARCH_COMPLETE, SEARCH_INIT} from "../actions/types";
import {SET_SEARCH_PARAMS} from "./types";

const TIMEOUT_DELAY_MS = 5000;

function searchInit() {
    return {
        type: SEARCH_INIT
    }
}

function searchComplete(payload) {
    return {
        type: SEARCH_COMPLETE,
        payload

    }
}

export function search(query) {
    return async function (dispatch) {
        dispatch(searchInit())
        let stillNotCompleted = true

        setTimeout(() => stillNotCompleted && dispatch(searchComplete({errors: "Timeout"})), TIMEOUT_DELAY_MS)
        let results
        try {
            results = (await fetch(apiAddress,
                {
                    method: 'POST',
                    body: JSON.stringify({query}), headers: {
                    Authorization: await token().getToken(),
                    'Content-Type': 'application/json',
                    dataType: 'json',
                    Accept: 'application/json'
                }
                })).json()
        } catch (err) {
            results = err
        }
        stillNotCompleted = false
        dispatch(searchComplete(results))

    }
}

export function setSearchParams(params, fromScratch) {
    return {
        type: SET_SEARCH_PARAMS,
        params,
        fromScratch
    }
}