import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

const ButtonBarButton = ({ children, onClick }) => {
  return (
    <button type="button" onClick={onClick}>{children}</button>
  );
};

const ButtonBar = ({ children }) => {
  return (
    <menu className="button-bar">
      { children.map((item, index) => <li key={index}>{item}</li>) }
    </menu>
  );
};
ButtonBar.propTypes = {
  children: PropTypes.arrayOf(ButtonBarButton)
};
ButtonBar.defaultProps = {
  children: []
};

const TopPanel = ({ onSave, onOpenRecent }) => {
  return (
    <div className="top-panel">
      <h1 className="top-panel-title">
        Session Manager
        <sup>&alpha;</sup>
      </h1>
      <ButtonBar>
        <ButtonBarButton onClick={onSave}>Save current</ButtonBarButton>
        <ButtonBarButton onClick={onOpenRecent}>Open recent</ButtonBarButton>
      </ButtonBar>
    </div>
  );
};

const FavIconBar = ({ favicons }) => {
  return (
    <ul className="favicon-bar">
      {favicons.map((url, index) => {
        const style = {
          'backgroundImage': `url(${url})`
        };
        return (
          <li key={index}>
            <i className="favicon" style={style} />
          </li>
        );
      })}
    </ul>
  );
};
/*
FavIconBar.propTypes = {
  icons: PropTypes.arrayOf(PropTypes.string)
};*/
FavIconBar.defaultProps = {
  favicons: []
};

const SessionListItem = ({ session, onRestore, onRemove }) => {
  const className = `session-list-item ${session.incognito ? 'session-list-item__incognito' : ''}`;
  return (
    <div className={className}>
      <div>
        <h3 className="session-list-item-title">{session.title} ({session.tabs.length} tabs)</h3>
        <p className="session-list-item-date">{new Date(parseInt(session.lastModifiedDate)).toLocaleString()}</p>
      </div>
      <FavIconBar favicons={session.favicons} />
      <ButtonBar>
        <ButtonBarButton onClick={onRestore}>Restore</ButtonBarButton>
        <ButtonBarButton type="button" onClick={onRemove}>Remove</ButtonBarButton>
      </ButtonBar>
    </div>
  );
};

const SessionList = ({ items, onRestoreSession, onRemoveSession }) => {
  return (
    <ul className="session-list">
      { items.map(item =>
        <li key={item.id}>
          <SessionListItem
            session={item.session}
            onRestore={() => onRestoreSession(item.id)}
            onRemove={() => onRemoveSession(item.id)}
          />
        </li>
      ) }
    </ul>
  );
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: [],
      recent: []
    };
  }
  componentDidMount() {
    this.getSessions();
  }
  render() {
    return (
      <div className="app">
        <header>
          <TopPanel
            onSave={() => this.saveCurrentSession()}
            onOpenRecent={() => this.openRecentSession()}
          />
        </header>
        <main>
          <SessionList
            items={this.state.user}
            onRestoreSession={id => this.restoreSession(id)}
            onRemoveSession={id => this.removeSession(id)}
          />
        </main>
      </div>
    )
  }
  getSessions() {
    chrome.runtime.sendMessage({ type: 'get_sessions' }, ({ user, recent }) => {
      console.log(user, recent);
      this.setState({
        user: Array.isArray(user) ? user : [],
        recent: Array.isArray(recent) ? recent : []
      });
    });
  }
  saveCurrentSession() {
    chrome.runtime.sendMessage({ type: 'save_session' }, () => {
      this.getSessions();
    });
  }
  restoreSession(id) {
    chrome.runtime.sendMessage({ type: 'restore_session', id });
  }
  removeSession(id) {
    chrome.runtime.sendMessage({ type: 'remove_session', id }, () => {
      this.getSessions();
    });
  }
  openRecentSession() {
    chrome.runtime.sendMessage({ type: 'get_recently_closed' }, () => {});
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
