import { CHAT_NAME, CHAT_COUNTRY, CHAT_GIF } from './types';

export const setName = name => dispatch => {
    dispatch({
        type: CHAT_NAME,
        payload: name
    })
};

export const setCountry = name => dispatch => {
    dispatch({
        type: CHAT_COUNTRY,
        payload: name
    })
};

export const setGif = image => dispatch => {
    dispatch({
        type: CHAT_GIF,
        payload: image
    })
};