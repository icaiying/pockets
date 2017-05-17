import React from 'react';
import ReactDOM from 'react-dom';

import Routes from './routes';

ReactDOM.render(
  <Routes />,
  document.getElementById('root')
);

// Import and attach the favicon
// document.querySelector('[rel="shortcut icon"]').href = require('file!./favicon.png')