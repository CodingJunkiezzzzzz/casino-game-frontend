import { RISK, ROWS, HIDE_BET, JOINED_PLAYERS_DATA } from './types';

export const setRisk = data => dispatch => {
    dispatch({
        type: RISK,
        payload: data
    })
};

export const setRows = data => dispatch => {
    dispatch({
        type: ROWS,
        payload: data
    })
};

export const hideBet = (game) => dispatch => {
    dispatch({
        type: HIDE_BET,
        payload: game
    })
};