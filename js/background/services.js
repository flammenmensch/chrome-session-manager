import shortid from 'shortid';
import * as api from './api';

export function saveSession(title, tabs) {
  const id = `session_${shortid.generate()}`;
  api.storage.saveItem(id, { title, tabs });
}

export function getSessions() {
  return api.storage.getItem()
    .then(items => (
      Object.keys(items)
        .sort()
        .map(key => ({ id: key, session: items[key] }))
    ));
}

export function getRecentlyClosed() {
  return api.sessions.getRecentlyClosed();
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
        url: session.tabs.map(tab => tab.url)
      });
    }
  });
}

export function getCurrentTabs() {
  return api.tabs.getAllInCurrentWindow();
}
