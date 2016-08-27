import * as services from './services';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'get_sessions':
      Promise.all([
        services.getRecentlyClosed(),
        services.getSessions()
      ]).then(results => {
        const [ recent, user ] = results;
        sendResponse({ recent, user });
      });
      return true;
    case 'save_session':
      const title = `Untitled`;
      Promise.all([
        services.getCurrentTabs(),
        services.getCurrentWindow()
      ]).then(results => {
        const [ tabs, wnd ] = results;
        const favicons = services.extractFaviconsFromTabs(tabs);
        const urls = tabs.map(tab => tab.url);
        return services.saveSession(title, urls, wnd.incognito, favicons)
          .then(sendResponse);
      });
      return true;
    case 'restore_session':
      services.restoreSession(message.id)
        .then(sendResponse);
      return true;
    case 'remove_session':
      services.removeSession(message.id)
        .then(sendResponse);
      return true;
  }
  return false;
});

/*
chrome.windows.onRemoved.addListener(windowId => {
  chrome.tabs.query({ windowId }, tabs => {
    services.saveSession(`Autosave: ${new Date().toLocaleString()}`, tabs);
  });
});

chrome.browserAction.onClicked.addListener(() => {
  chrome.tabs.query({ windowId: chrome.windows.WINDOW_ID_CURRENT }, tabs => {
    const title = `Session: ${new Date().toLocaleString()}`;
    saveSession(title, tabs);
  });
});
*/
