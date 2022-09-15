import { SET_USER_DETAIL } from './types';

export const setUserDetail = name => dispatch => {
    dispatch({
        type: SET_USER_DETAIL,
        payload: name
    })
};