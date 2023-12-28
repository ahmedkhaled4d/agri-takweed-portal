/*  removeStorage: removes a key from sessionStorage and its sibling expiracy key
    params:
        key <string>     : sessionStorage key to remove
    returns:
        <boolean> : telling if operation succeeded
 */
function removeStorage(name) {
  try {
    sessionStorage.removeItem(name);
    sessionStorage.removeItem(name + '_expiresIn');
  } catch (e) {
    return false;
  }
  return true;
}
/*  getStorage: retrieves a key from sessionStorage previously set with setStorage().
          params:
              key <string> : sessionStorage key
          returns:
              <string> : value of sessionStorage key
              null : in case of expired key or failure
       */
function getStorage(key) {
  var now = Date.now(); //epoch time, lets deal only with integer
  // set expiration for storage
  var expiresIn = sessionStorage.getItem(key + '_expiresIn');
  if (expiresIn === undefined || expiresIn === null) {
    expiresIn = 0;
  }

  if (expiresIn < now) {
    // Expired
    removeStorage(key);
    return null;
  } else {
    try {
      return sessionStorage.getItem(key);
    } catch (e) {
      return null;
    }
  }
}
/*  setStorage: writes a key into sessionStorage setting a expire time
          params:
              key <string>     : sessionStorage key
              value <string>   : sessionStorage value
              expires <number> : number of seconds from now to expire the key
          returns:
              <boolean> : telling if operation succeeded
       */
function setStorage(key, value, expires) {
  if (expires === undefined || expires === null) {
    expires = 24 * 60 * 60; // default: seconds for 1 day
  } else {
    expires = Math.abs(expires); //make sure it's positive
  }

  var now = Date.now(); //millisecs since epoch time, lets deal only with integer
  var schedule = now + expires * 1000;
  try {
    sessionStorage.setItem(key, value);
    sessionStorage.setItem(key + '_expiresIn', schedule);
  } catch (e) {
    return false;
  }
  return true;
}

export { setStorage, getStorage, removeStorage };
