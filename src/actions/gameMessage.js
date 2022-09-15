import { TARGET_USER } from './types';

export const targetUser = name => dispatch => {
    dispatch({
        type: TARGET_USER,
        payload: name
    })
};