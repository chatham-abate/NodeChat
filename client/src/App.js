import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import LoginDisplay from './components/LoginDisplay';
import NewUserDisplay from './components/NewUserDisplay';

import './componentStyles/genericStyles.css';
import './componentStyles/inputStyles.css';

class App extends Component {
  render() {
    return (
      <Switch>
        <Route exact path = "/" component = {LoginDisplay}  />
        <Route exact path = "/newUser" component = {NewUserDisplay}  />
      </Switch>
    );
  }
}

export default App;
