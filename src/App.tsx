import * as React from 'react';
import {hot} from 'react-hot-loader/root';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import {Home} from './routes/Home';
import {Player} from './routes/Player';

export class App extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
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
        </footer>
      </Router>
    );
  }
}

export default hot(App);
