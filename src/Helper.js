import {store} from "react-notifications-component";
import formatCurrency from "format-currency";
import _ from "lodash";
import * as Cookies from "js-cookie";
import EventEmitter from "events";

/**
 * APP Mode
 * @type {bool}
 */
export const DEVELOPMENT = true;

/**
 * Lodash
 * @type {lodash}
 * @private
 */
export const __ = _;

/**
 *
 * BRAND
 * @type {string}
 */
export const BRAND = "Brand";

/**
 *
 * Site URL
 * @type {string}
 */
export const SITE = DEVELOPMENT ? 'http://localhost:3000' : 'https://';

/**
 *
 * General Socket Address
 * @type {string}
 */
export const SOCKET = DEVELOPMENT ? 'ws://127.0.0.1:3004' : 'wss://';

/**
 * General API Address
 * @type {string}
 */
export const API = DEVELOPMENT ? 'http://127.0.0.1:3004' : 'https://';

/*
 * Support Skype
*/
export const SUPPORT_SKYPE = 'https://join.skype.com/';

/**
 * Show Bonus Wheel
 * @type {string}
 */
export const BONUS_WHEEL = false;

/**
 * Event Emitter
 */
export const Event = new EventEmitter();

/**
 * Google Client ID for oAuth
 * @type {string}
 */
export const CLIENT_ID = '';

/**
 * Google Recaptcha v3 / Site Key
 * @type {string}
 */
export const RECAPTCHA = "";

/**
 * defaultAvatar
 * @type {string}
 */
export const defaultAvatar = DEVELOPMENT ? 'http://127.0.0.1:3004/uploads/avatar.png' : API + '/uploads/avatar.png';

/**
 * Readable Crypto Format ( 0.00000009 )
 * @param value
 * @return {*}
 */
export function toCrypto(value) {
    var number = value * 100000000;
    return (number).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1");
}

/*
 * Check string is utf-8
*/
export function isUTF8(text) {
    var utf8Text = text;
    try {
        utf8Text = decodeURIComponent(escape(text));
        if(utf8Text) return false;
    } catch(e) {
       return true;
    }
    return true;
}

/**
 * Readable Satoshi Format ( 0.00000010 )
 * @param value
 * @param coin
 * @return {*}
 */
export function forceSatoshiFormat(val, coin = 'bltz') {
  Number.prototype.format = function(n, x, s, c) {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
      num = this.toFixed(Math.max(0, ~~n));

    return (c ? num.replace('.', c) : num).replace(
      new RegExp(re, 'g'),
      '$&' + (s || ',')
    );
  };

  var amount = parseFloat(val);
  
  if(isNaN(amount))
    return val;
  else
      return Number(amount.format(8, 30, '.','.')).toFixed(8);
}

/*
 * BTC TO USD
*/
export function toUSD(value) {
    let opts = { format: '%v %c', code: 'USD' }
    return formatCurrency(value, opts);
}

/*
 * Get User ID from Coockie
*/
export const getUID = parseFloat(Cookies.get('uid'))

/**
 * Validate number
 * @param val
 * @return {*}
 */

export function isValidNumber(val) {
  if (val === '') return true;
    if(!isNaN(val)){
        var check = /^[-]?\d+|\d+.$/.test(val);
        if(check){
            return true;
        }
    }
    return false;
}

/**
 * Validate Email
 * @param email
 * @return {boolean}
 */
export function isEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

/**
 * Check Client is Mobile or Not
 * @return {boolean}
 */
export function isMobile() {
    let clientWidth = document.documentElement.clientWidth || document.body.clientWidth;
    return clientWidth < 992
}

/**
 * Check Client is Tablet or Not
 * @return {boolean}
 */
export function isTablet() {
    let clientWidth = document.documentElement.clientWidth || document.body.clientWidth;
    return clientWidth < 1100
}

/**
 * Remove Value From Array
 * @param array
 * @param item
 */
export function removeItem(array, item){
    for( var i = 0; i < array.length; i++){
        if (array[i].name === item) {
            array.splice(i, 1); i--;
        }
    }
    return array;
}

/**
 * Get Element with validator
 * @param name
 * @return {boolean|any}
 */
export function getElement(name) {
    if(document.querySelector(name) !== null)
        return document.querySelector(name);
    return document.getElementById('helper');
}

/**
 * Convert TimeStamp To Readbale Date
 * @param unixTimestamp
 * @return {string}
 */
export function timeConvertor(unixTimestamp) {
    let now = new Date(_.toNumber(unixTimestamp));
    var sec  = now.getSeconds();
    var hr  = now.getHours();
    var min = now.getMinutes();
    hr = (hr<10) ? '0'+hr : ''+hr;
    min = (min<10) ? '0'+min : ''+min;
    min = (sec<10) ? '0'+sec : ''+sec;

    var y = now.getUTCFullYear();
    var m = (now.getUTCMonth()+1);
    var d = now.getUTCDate();
    var date = y + "-" + m + "-" + d;

    return date + ' - ' + hr + ':' + min + ':' + sec;
}

/**
 * Convert TimeStamp To Time
 * @param unixTimestamp
 * @return {string}
 */
export function convertToTime(unixTimestamp) {

    if(unixTimestamp == undefined)
        return 'Now';

    let date = new Date(_.toNumber(unixTimestamp));
    let options = {
        hour: 'numeric',
        minute: 'numeric',
        // second: 'numeric',
        hour12: true
    };
    return date.toLocaleString('en-US', options);
}

/*
 * Fix Date and Time For Human
 * Date Comming From Database with now() function
*/
export function fixDate(date){
    if(date === undefined) return date;
    if(date === null) return date;
    
    date = date.toString();
    var fix = date.replace('T', ' ');
    fix = fix.replace('Z', '');
    fix = fix.substr(0, date.length)
    let last =  fix.substr(fix.length - 4);
    return fix.replace(last, '');
}

/*
 * Get Just Date By DB
 * Date Comming From Database with now() function
*/
export function getDateByDb(date){
    if(date === undefined) return date;
    date = date.toString();
    return date.substr(0, 11);
}

/*
 * Get Just Time By DB
 * Date Comming From Database with now() function
*/
export function getTimeByDb(date){
    if(date === undefined) return date;
    date = date.toString();
    var fix = date.replace('T', ' ')
    fix = fix.replace('Z', '')
    fix = fix.substr(0, date.length)
    let last =  fix.substr(fix.length - 4);
    fix = fix.replace(last, '')
    return fix.substr(10, 6);
}

/**
 * Making Game Object
 * @type {any}
 */
export const Game = Object.create(null);

/**
 * Making User Object
 * @type {any}
 */
export const User = Object.create(null);

/**
 *
 * SetTimeOut Promise
 * @param ms
 * @return {Promise<any>}
 */
export const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Send Notification
 * @param message
 * @param type
 * @param position
 * @return {*}
 */
export function sendNotfication(message, type, position, welcome = false) {
    if(!message) return;

    return store.addNotification({
        message: message,
        type: welcome ? 'danger' : 'info',
        insert: "top",
        container: welcome ? 'top-center' : 'bottom-left',
        animationIn: ["animated", "pulse"],
        animationOut: ["animated", "fadeOut"],
        dismiss: {
            duration: 6000,
            onScreen: true
        }
    });
}

/**
 * Get Random Integer
 * @param min
 * @param max
 * @return {number}
 */
export function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Get Random Integer 2
 * @param min
 * @param max
 * @return {number}
 */
export function getSingleRandomInt(length) {
    return Math.floor(Math.random()* length);
}


/**
 * Generate Random String
 * @param length
 * @return {string|string}
 */
export function randomString(length){
    var chars = '0123456789abcdefghiklmnopqrstuvwxyz'.split('');
    var str = '';
    for (var i = 0; i < length; i++) {
        str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
}

/**
 * Generate Random Color
 * @return {string|string}
 */
export function randomColor(){
    for (var e = "#", t = 0; t < 6; t++)
        e += "0123456789ABCDEF"[Math.floor(16 * Math.random())];
    return e;
}

/*
 * Check Element Have ClassName
*/
export function hasClass(element, className) {
    return (' ' + element.className + ' ').indexOf(' ' + className+ ' ') > -1;
}

export function chkd(){
    return true;
}


export function encode(arr){
    return arr;
}

export function decode(arr){
    return arr;
}
