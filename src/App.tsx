import * as React from 'react';
import {hot} from 'react-hot-loader/root';
import {Provider} from 'react-redux';
import {BrowserRouter as Router, Link, Route, Switch} from 'react-router-dom';

import createStore from './data/store';
import {Admin} from './routes/admin/Index';
import {Home} from './routes/Home';
import {Host} from './routes/host/Index';
import {Player} from './routes/player/Index';

const store = createStore();

export class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <Switch>
            <Route path="/admin">
              <Admin />
            </Route>
            <Route path="/host/:roomCode?">
              <Host />
            </Route>
            <Route path="/player">
              <Player />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
          {process.env.NODE_ENV !== 'production' ? (
            <footer className="fixed bottom-0 flex justify-center w-screen p-2 space-x-4 text-white bg-black">
              <Link to="/">Home</Link>
              <Link to="/player">Player</Link>
              <Link to="/host/">Host</Link>
              <Link to="/admin/">Admin</Link>
            </footer>
          ) : null}
        </Router>
      </Provider>
    );
  }
}

export default hot(App);
