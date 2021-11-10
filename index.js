const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
// const mysql = require('mysql');
const mysql = require('mysql2'); // MySQL client upgrade

// CORS security accept all requests
app.use(cors());
// parse application/json
app.use(bodyParser.json());
 
//create database connection
const conn = mysql.createConnection({
//   host: 'localhost',
  host: '127.0.0.1', // Explicit IPv4 not IPv6
//   user: 'new_user',
  user: 'root', // Switch user
  password: 'password',
  database: 'agency_locations_schema', 
  
});
 
//connect to database
conn.connect((err) =>{
  if(err) throw err;
});
app.set('json spaces', 2);

// set GET request for API - return crime rates by category of crime as JSON
app.get('/api/crimerates/',(req, res, next) => {
    // define lat and long queries
    const lat = req.query.lat;
    const long = req.query.long;
    // get nearest county provided lat and long
    axios.get('https://geo.fcc.gov/api/census/area?lat='+lat+'&lon='+long+'&format=json')
    .then(function(response){
        var county_name = response.data.results[0].county_name;
        let sql = 'SELECT DISTINCT nibrs_crime_desc FROM agency_raw_crime_data WHERE county='+'"'+county_name+'"'+' OR county='+'"'+county_name.toUpperCase()+'"';
        conn.query(sql, (err, results) => {
            if (err) throw err;
            var crime_rates = {};
            results.forEach(crime_desc => {
                var crime_type = crime_desc.nibrs_crime_desc;
                crime_rates[crime_type] = 0;
            });
            var sql2 = 'SELECT nibrs_crime_desc, distinct_offenses FROM agency_raw_crime_data WHERE county='+'"'+county_name+'"'+' OR county='+'"'+county_name.toUpperCase()+'"';
            conn.query(sql2, (err2, results2) => {
              if (err2) throw err2; 
              results2.forEach(element => {
                  crime_rates[element.nibrs_crime_desc] += element.distinct_offenses;
              });
              var sql3 = 'SELECT population FROM counties_and_pop WHERE county='+'"'+county_name+' County"';
              conn.query(sql3, (err3, results3) => {
                  if (err3) throw err3;
                  const county_pop = parseInt(results3[0].population.replace(/,/g, ''));
                  for (var key in crime_rates) {
                      crime_rates[key] /= county_pop;
                      crime_rates[key] *= 100000;
                      crime_rates[key] = crime_rates[key].toFixed(3);
                  }
                  res.json(crime_rates);
              })
            });
        });
    })
    .catch(function(error){
        console.log(error);
        next(error);
    });
  });

app.get('/api/top5', (req, res, next) => {
  /**
   * Here Are The 10 Most Dangerous Towns In Oregon To Live In
   * (Source: https://www.onlyinyourstate.com/oregon/dangerous-towns-or/)
   * 1. Ontario, OR lat 44.0266 lon 116.9629
   * 2. Portland, OR lat 45.5152 lon 122.6784
   * 3. Warrenton, OR lat 46.1651 lon 123.9238
   * 4. Coos Bay, OR lat 43.3665 lon 124.2179
   * 5. Astoria, OR lat 46.1879 lon 123.8313
   */
  res.json([
    {latitude: 44.0266, longitude: 116.9629},
    {latitude: 45.5152, longitude: 122.6784},
    {latitude: 46.1651, longitude: 123.9238},
    {latitude: 43.3665, longitude: 124.2179},
    {latitude: 46.1879, longitude: 123.8313}
  ])
});

  //Handle errors 
  app.use(function(req, res){
    res.type('text/plain');
    res.status(404);
    res.send('404 - Not Found');
  });

  app.use(function(err, req, res, next){
    res.type('plain/text');
    res.status(500);
    res.send('500 - Server Error');
  });
  
//Server listening
const PORT = process.env.PORT || 2000;
app.listen(PORT,() =>{
  console.log(`Server started on port ${PORT}...`);
});