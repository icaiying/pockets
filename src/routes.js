import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

import App from './components/App';
import About from './components/About';
import NotFound from './components/NotFound';

const Routes = () => (
  <Router>
    <div>
      {/*<ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/topics">any</Link></li>
      </ul>*/}
      <Route exact path="/" component={App}/>
      <Route path="/about" component={About}/>
      <Route path="/test" component={NotFound}/>
    </div>
  </Router>
);

export default Routes;