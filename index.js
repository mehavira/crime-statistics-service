const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql');
 
// parse application/json
app.use(bodyParser.json());
 
//create database connection
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'new_user',
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

//Server listening
const PORT = process.env.PORT || 2000;
app.listen(PORT,() =>{
  console.log(`Server started on port ${PORT}...`);
});