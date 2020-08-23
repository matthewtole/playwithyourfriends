import * as React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useRouteMatch,
  Redirect,
} from 'react-router-dom';
import {PlayerJoin} from './player/Join';

export const Player: React.FC = () => {
  let {path} = useRouteMatch();
  const [isLoggedIn, login] = React.useState(false);

  return (
    <main className="h-screen max-w-xl p-4 mx-auto bg-forward-slices font-title">
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
    </main>
  );
};
