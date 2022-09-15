import { GET_WALLET } from './types';

export const setWallet = (show, uid) => dispatch => {
    dispatch({
        type: GET_WALLET,
        payload: {
            show: show,
            uid: uid
        }
    })
};