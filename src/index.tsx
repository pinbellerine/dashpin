/* @refresh reload */
import './index.css';
import { render, } from 'solid-js/web';
import { Router, Routes, Route  } from '@solidjs/router';

import App from './app';
import Login from './Login/Login';
import Register from './Register/Register';
import Dashboard from './Dashboard/Dashboard';
import AgGrid from './Dashboard/Ag-Grid/Ag-Grid';
import Maps from './GoogleMaps/GoogleMap';




const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  );
}

render(
  () => (
    <Router>
      <Login />
     <Routes>
       
        <Route path="/Register" component={Register} />
        <Route path="/Dashboard" component={Dashboard}/>
        <Route path="/AgGrid" component={AgGrid}/>
        <Route path="/GoogleMaps" component={Maps}/>



     </Routes>
  </Router>
  ),
  root,
);
