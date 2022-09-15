import { SIDEBAR_DISPLAY } from './types';

export const toggleSideBar = (show) => dispatch => {
    dispatch({
        type: SIDEBAR_DISPLAY,
        payload: show
    })
};