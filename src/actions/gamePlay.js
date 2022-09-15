import { PLAY, SET_TARGET } from './types';

export const setPlay = data => dispatch => {
    dispatch({
        type: PLAY,
        payload: data
    })
};

export const setTarget = data => dispatch => {
    dispatch({
        type: SET_TARGET,
        payload: data
    })
};

export const gamePlay = () => dispatch => {
    dispatch({
        type: PLAY,
        payload: true
    })
};