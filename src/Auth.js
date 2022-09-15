import React from "react";
import * as Cookies from "js-cookie";
import storage from "./Storage";
import socket from "./Socket";
import {decode, encode} from "./Helper";
import C from "./Constant";

/**
 * Check Logged User
 * @return {boolean}
 */
export default function isLogged(){
    let check = storage.getKey('token');
    if(check === null)
        return false;

    return true;
}

/**
 * Get User ID
 * @return {boolean}
 */
export function getUID() {
    socket.emit(C.GET_UID, encode({ token: storage.getKey('token') }));

    socket.on(C.GET_UID, (data) => {
        let { uid } = decode(data);
        Cookies.set("uid", uid, {expires: 14});
    });

    return Cookies.get('uid');
}