/**
 * Set the cookie in the browser
 * @param name Name of the cookie
 * @param val Value of the cookie
 * @param expires Expires of the cookie in days
 */
export function setCookie(name, val, expires = 1) {
  const date = new Date();
  const value = val;

  // Set it expire in expires day
  date.setTime(date.getTime() + expires * 24 * 60 * 60 * 1000);

  // Set it
  document.cookie =
    name + '=' + value + '; expires=' + date.toUTCString() + '; path=/';
}

/**
 *
 * @param {*} name: cookie key name
 * @returns the cookie from cookie storage
 */
export function getCookie(name) {
  const value = '; ' + document.cookie;
  const parts = value.split('; ' + name + '=');

  if (parts.length === 2) {
    return parts.pop().split(';').shift();
  }
}

/**
 *
 * @param {*} name: cookie key name
 * @description deletes the cookie from cookie storage
 */

export function deleteCookie(name) {
  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
}
