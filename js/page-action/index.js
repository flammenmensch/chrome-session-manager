import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

const ButtonBar = ({ children }) => {
  return (
    <menu className="button-bar">
      { children.map((item, index) => <li key={index}>{item}</li>) }
    </menu>
  );
};
ButtonBar.propTypes = {
  children: PropTypes.arrayOf(Component)
};
ButtonBar.defaultProps = {
  children: []
};


const TopPanel = ({ onSave }) => {
  return (
    <div className="top-panel">
      <h1 className="top-panel-title">Session Manager</h1>
      <ButtonBar>
        <button type="button" onClick={onSave}>Save current</button>
        <button type="button">Settings</button>
      </ButtonBar>
    </div>
  );
};

const SessionListItem = ({ session, onRestore, onRemove }) => {
  return (
    <div className="session-list-item">
      <h3 className="session-list-item-title">{session.title} ({session.tabs.length} tabs)</h3>
      <ButtonBar>
        <button type="button" onClick={onRestore}>Restore</button>
        <button type="button" onClick={onRemove}>Remove</button>
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
          <TopPanel onSave={() => this.saveCurrentSession()} />
        </header>
        <main className="scrollable">
          <section>
            <h2 className="section-header">User sessions</h2>
            <SessionList
              items={this.state.user}
              onRestoreSession={id => this.restoreSession(id)}
              onRemoveSession={id => this.removeSession(id)}
            />
          </section>
        </main>
      </div>
    )
  }
  getSessions() {
    chrome.runtime.sendMessage({ type: 'get_sessions' }, ({ user, recent }) => {
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
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
