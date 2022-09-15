import { GET_AUTH } from './types';

export const showAuthModal = (show) => dispatch => {
    dispatch({
        type: GET_AUTH,
        payload: show
    })
};