import { COIN, CHART_COIN, CURRENT_CREDIT } from './types';
import storage from "../Storage";

export const gameCoin = () => dispatch => {
    dispatch({
        type: COIN,
        payload: (storage.getKey('coin') !== null) ? storage.getKey('coin'): 'BTC'
    })
};

export const setCoin = coin => dispatch => {
    dispatch({
        type: COIN,
        payload: coin
    })
};

export const setChartCoin = coin => dispatch => {
    dispatch({
        type: CHART_COIN,
        payload: coin
    })
};

export const setCredit = credit => dispatch => {
    dispatch({
        type: CURRENT_CREDIT,
        payload: credit
    })
};