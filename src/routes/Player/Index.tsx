import * as React from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
  useRouteMatch,
} from 'react-router-dom';

import {PlayerJoin} from './Join';

export const Player: React.FC = () => {
  let {path} = useRouteMatch();
  const [isLoggedIn, login] = React.useState(false);

  return (
    <main className="h-screen bg-forward-slices font-title">
      <section className="max-w-xl p-4 mx-auto">
        <Switch>
          <Route exact path={path}>
            {!isLoggedIn ? <Redirect to={`${path}/join`} /> : <>LOBBY</>}
          </Route>
          <Route path={`${path}/join/:roomCode?`}>
            {isLoggedIn ? (
              <Redirect to={path} />
            ) : (
              <PlayerJoin onJoin={() => login(true)} />
            )}
          </Route>
        </Switch>
      </section>
    </main>
  );
};
