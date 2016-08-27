import shortid from 'shortid';
import * as api from './api';

export function saveSessionData(title, tabs, incognito=false, favicons=[]) {
  const id = shortid.generate();
  return api.storage.saveItem(id, {
    title,
    tabs,
    incognito,
    favicons,
    lastModifiedDate: Date.now()
  });
}

export function getSessions() {
  return api.storage.getItem()
    .then(items => (
      Object.keys(items)
        .map(key => ({ id: key, session: items[key] }))
        .sort((a, b) => (a.session.lastModifiedDate < b.session.lastModifiedDate))
    ));
}

export function getRecentlyClosed() {
  return api.sessions.getRecentlyClosed();
}

export function restoreLastSession() {
  return api.sessions.restore();
}

export function saveSession(title, tabs, window) {
  const favicons = extractFaviconsFromTabs(tabs);
  const urls = tabs.map(tab => tab.url);
  return saveSessionData(title, urls, window.incognito, favicons);
}

export function saveCurrentSession(title) {
  return Promise.all([
    getCurrentTabs(),
    getCurrentWindow()
  ]).then(results => {
    const [ tabs, window ] = results;
    return saveSession(title, tabs, window);
  });
}

export function saveSessionForWindow(title, windowId) {
  return Promise.all([
    getTabsInWindow(windowId),
    getWindow(windowId, { populate: true })
  ]).then(results => {
    const [ tabs, window ] = results;
    return saveSession(title, tabs, window);
  });
}

export function removeSession(id) {
  return api.storage.removeItem(id);
}

export function getSessionById(id) {
  return api.storage.getItem(id)
    .then(data => data[id]);
}

export function restoreSession(id) {
  return getSessionById(id).then(session => {
    if (session) {
      api.windows.create({
        url: session.tabs,
        incognito: session.incognito
      });
    }
  });
}

export function getCurrentTabs() {
  return api.tabs.getAllInCurrentWindow();
}

export function getTabsInWindow(windowId) {
  return api.tabs.query({ windowId });
}

export function getCurrentWindow() {
  return api.windows.getCurrent();
}

export function getWindow(windowId, getInfo) {
  return api.windows.get(windowId, getInfo);
}

export function extractFaviconsFromTabs(tabs, max=6) {
  const tabsWithFavicons = tabs
    .filter(tab => (tab.favIconUrl !== undefined));

  const uniqueFavicons = new Set();
  tabsWithFavicons
    .forEach((tab) => uniqueFavicons.add(tab.favIconUrl));

  return Array.from(uniqueFavicons).slice(0, max);
}
