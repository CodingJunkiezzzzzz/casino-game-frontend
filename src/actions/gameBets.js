import { SET_BET } from './types';

export const setBet = (array) => dispatch => {
    dispatch({
        type: SET_BET,
        payload: array
    })
};