import { promisify } from './utils';

const chromeStorage = chrome.storage.local;
const chromeTabs = chrome.tabs;
const chromeWindows = chrome.windows;
const chromeSessions = chrome.sessions;

export const storage = {
  getItem(key=null) {
    return promisify(chromeStorage, 'get', key);
  },
  saveItem(key, value) {
    return promisify(chromeStorage, 'set', { [key]: value });
  },
  removeItem(key) {
    return promisify(chromeStorage, 'remove', key);
  }
};

export const tabs = {
  getAllInCurrentWindow() {
    return promisify(chromeTabs, 'query', { windowId: chromeWindows.WINDOW_ID_CURRENT });
  }
};

export const windows = {
  getCurrent(getInfo) {
    return promisify(chromeWindows, 'getCurrent', getInfo);
  },
  create(options) {
    return promisify(chromeWindows, 'create', options);
  }
};

export const sessions = {
  getRecentlyClosed() {
    return promisify(chromeSessions, 'getRecentlyClosed');
  }
};
