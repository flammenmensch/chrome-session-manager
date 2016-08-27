import * as services from './services';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'get_sessions':
      services.getSessions()
        .then(results => {
          sendResponse({ user: results });
        });
      return true;
    case 'save_session':
      const title = message.title || chrome.i18n.getMessage('untitled');
      services.saveCurrentSession(title)
        .then(sendResponse);
      return true;
    case 'restore_session':
      services.restoreSession(message.id)
        .then(sendResponse);
      return true;
    case 'remove_session':
      services.removeSession(message.id)
        .then(sendResponse);
      return true;
    case 'get_recently_closed':
      services.restoreLastSession()
        .then(sendResponse);
      return true;
  }
  return false;
});
