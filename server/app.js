const express = require('express');
const morgan = require('morgan');
const path = require('path');
const axios = require('axios');
const moment = require('moment');
const app = express();
const URI = require('urijs');

// Setup logger
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));

// Serve static assets
app.use(express.static(path.resolve(__dirname, '..', 'build')));

app.all('*', (req, res, next) => {
    req.header('Access-Control-Request-Headers', '*');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('X-Frame-Options', 'DENY');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-app-id');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,OPTIONS');
    next();
});

app.get('/pocket', (req, res) => {
  let url = new URI(`http://getpocket.com/v3/get`);
  url.addQuery("consumer_key", "67012-ef0752f8de314e0297670d14");
  url.addQuery("access_token", "8f463a11-ed8c-c83f-a89d-7083e0");
  url.addQuery("sort", "newest");
  url.addQuery("tag", "yktt");
  
  for (let key in req.query) {
    url.addQuery(key, req.query[key]);
  }

  console.log(url.toString())
  axios.get(url.toString())
  .then(function (response) {
    const list = response.data.list;
    const data = []
    let pocket = null;
    for (let key in list) {
      pocket = list[key]
      pocket['created_at'] = moment.unix(pocket['time_added']).format("YYYY-MM-DD");
      data.push(pocket)
    }
    data.sort(function(a, b) {
      return parseFloat(a.sort_id) - parseFloat(b.sort_id);
    })
    return res.send(data);
  })
  .catch(function (error) {
    // console.log(error);
    return res.send({'error': error});
  });
});

// Always return the main index.html, so react-router render the route in the client
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});

module.exports = app;