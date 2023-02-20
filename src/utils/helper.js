import * as moment from 'moment';
import { COOKIE_KEYS, SERVER_DATE_FORMAT } from '../constants';
import { deleteCookie, setCookie } from './cookieManager';

moment.updateLocale('en', {
  week: {
    dow: 1 // Monday is the first day of the week.
  }
});

/**
 *
 * @param {*} durationObject  example {hours: 1, minutes: 1, seconds: 1}
 * @returns total minutes from the duration picker duration object
 */
export const formatInMinutes = (durationObject) => {
  const { hours, minutes, seconds } = durationObject;
  return hours * 60 + minutes + (seconds > 1 ? 1 : 0);
};

/**
 *
 * @param {*} data  : takes object with id and name
 * @returns the options array : [{label:"first", id:1},{label:"second", id:2}]
 */
export const formatOptions = (data) => {
  return data.map(({ name, id }) => {
    return { label: name, value: id };
  });
};

/**
 *
 * @param {*} totalMinutes -
 * @returns string with hours and minutes to display in UI
 */

export const minutesToHour = (totalMinutes) => {
  if (!totalMinutes) return `${0}m`;

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const h = hours > 0 ? `${hours?.toFixed()}h` : '';
  const m = minutes > 0 ? ` ${minutes?.toFixed()}mins` : '';

  return `${h} ${m}`;
};

/**
 *
 * @param {*} totalMinutes
 * @returns return duration picker duration object, also adding leading 0 for counts less than 10
 */

export const minutesToDurationObject = (totalMinutes) => {
  if (!totalMinutes) return { hours: 0, minutes: 0, seconds: 0 };

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return {
    hours: hours < 10 ? `0${hours}` : hours,
    minutes: minutes < 10 ? `0${minutes}` : minutes,
    seconds: 0 // adding default zero as currently not using the seconds fields also taking rounding off minutes
  };
};

/**
 *
 * @param {*} date : Based on start date of the week
 * @returns - returns the week start date and week end date from a date
 */

export const getWeekDates = (date) => {
  const weekStartDate = moment(new Date(date))
    .startOf('week')
    .format('DD-MMM-YYYY');
  const weekEndDate = moment(new Date(date))
    .endOf('week')
    .format('DD-MMM-YYYY');
  return `${weekStartDate}- ${weekEndDate}`;
};

/**
 *
 * @param {*} token
 * @param {*} email
 * @param {*} role
 * @description : - Set the cookies on login on frontend
 */
export const setInititalCookies = (token, email, role) => {
  setCookie(COOKIE_KEYS.token, token);
  setCookie(COOKIE_KEYS.email, email);
  setCookie(COOKIE_KEYS.role, role);
};

/**
 * @description - Delete cookies after logout
 */
export const deleteInitialCookies = () => {
  deleteCookie(COOKIE_KEYS.token);
  deleteCookie(COOKIE_KEYS.email);
  deleteCookie(COOKIE_KEYS.role);
};

/**
 *
 * @param {*} date
 * @returns moment date formatted in YYYY-MM-DD format
 */
export const formatDate = (date) => {
  return moment(date).format(SERVER_DATE_FORMAT);
};
