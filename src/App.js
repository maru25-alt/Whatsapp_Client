import React  from 'react';
import {
  Redirect,
  Router,
  Switch,
  Route
} from "react-router-dom";
import Home from './views/Home';
import Signin from './views/Signin';
import Signup from './views/Signup';
import {Routes} from './utils/routes'
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createBrowserHistory } from "history";

const hist = createBrowserHistory();

function App() {
  return (
    <Router history={hist}>
     <div className="app">
       <ToastContainer/>
     <Switch>
       <Route path={Routes.signin} component={Signin} />
       <Route path={Routes.signup} component={Signup}/>
       <Route path={Routes.home} render={props => <Home {...props}/>}/>
       <Route path="*">
         <Redirect to={Routes.home}></Redirect>
       </Route>
     </Switch>
     </div>
     </Router>
  );
}

export default App;
