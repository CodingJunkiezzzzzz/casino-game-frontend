import { CRASH_WINNER_TEXT, CRASH_IM_IN_GAME } from './types';

export const setWinnerText = profit => dispatch => {
    dispatch({
        type: CRASH_WINNER_TEXT,
        payload: profit
    })
};

export const setMeToGame = enter => dispatch => {
    dispatch({
        type: CRASH_IM_IN_GAME,
        payload: enter
    })
};