import * as React from 'react';
import {hot} from 'react-hot-loader/root';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import {Loading} from './components/Loading';
import {Home} from './routes/Home';

const AsyncAdmin = React.lazy(() => import('./routes/admin/Index'));
const AsyncHost = React.lazy(() => import('./routes/host/Index'));
const AsyncPLayer = React.lazy(() => import('./routes/Player/Index'));

export const App: React.FC = () => (
  <React.Suspense fallback={<Loading />}>
    <Router>
      <Switch>
        <Route path="/admin">
          <AsyncAdmin />
        </Route>
        <Route path="/host">
          <AsyncHost />
        </Route>
        <Route path="/player/:roomCode?">
          <AsyncPLayer />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  </React.Suspense>
);

export default hot(App);
