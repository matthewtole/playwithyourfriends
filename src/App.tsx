import * as React from 'react';
import {hot} from 'react-hot-loader/root';
import {Provider} from 'react-redux';
import {BrowserRouter as Router, Link, Route, Switch} from 'react-router-dom';

import {Home} from './routes/Home';
import {Host} from './routes/host/Index';
import {Player} from './routes/Player';
import store from './data/store';

export class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <Switch>
            <Route path="/host">
              <Host />
            </Route>
            <Route path="/player">
              <Player />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
          <footer className="fixed bottom-0 flex justify-center w-screen p-2 space-x-4 text-white bg-black">
            <Link to="/">Home</Link>
            <Link to="/player">Player</Link>
            <Link to="/host">Host</Link>
          </footer>
        </Router>
      </Provider>
    );
  }
}

export default hot(App);
