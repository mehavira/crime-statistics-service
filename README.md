# crime-statistics-service

## Crime Rates API 

## BASE URL: /api/crimerates
### Description
This service will provide a JSON object containing crime category names and their associated rates, given a pair of coordinates. It will only work for coordinates within Oregon counties.

The crime rate for a category is calculated by totalling all individual sets of reported offenses for that category, dividing that sum 
by the population of the county in which the coordinates reside in, and multiplying that quotient by 100,000. For example, if there have been 23 reported cases of identity theft in a county with a population of 6,325 people, then the identity theft crime rate would be (23/6325) * 100000 = ~363.64.  
### Command to install node-modules
`npm install`
### Command to run file
`node index.js`
### Request Type
GET
### Parameters

|Parameter |Required? |Description |Parameter Type |Data Type |
|-------|--------|------------|-------------|---------|
|lat |Yes|Latitude coordinate [-90, 90] in decimal|query|double
|long|Yes|Longitude coordinate [-180, 180] in decimal|query|double

### Example Request
URL: http://localhost:2000/api/crimerates/?lat=43.117&long=-120.22


Response: 
```
{
  "Oregon Specific Crime (ONIBRS)": "3357.843",
  "Aggravated Assault": "330.882",
  "All Other Offenses": "2512.255",
  "Family Offenses, Nonviolent": "73.529",
  "Forcible Rape": "73.529",
  "Intimidation": "159.314",
  "Statutory Rape": "24.510",
  "Forcible Fondling": "73.529",
  "Simple Assault": "674.020",
  "Arson": "24.510",
  "Burglary/Breaking And Entering": "490.196",
  "Counterfeiting/Forgery": "110.294",
  "Identity Theft": "24.510",
  "Theft From Motor Vehicles": "171.569",
  "All Other Larceny": "453.431",
  "Theft From Building": "98.039",
  "Shoplifting": "73.529",
  "Purse-Snatching": "24.510",
  "Theft From Motor Vehicles Parts/ Accessories": "36.765",
  "Motor Vehicle Theft": "257.353",
  "Robbery": "12.255",
  "Stolen Property Offenses": "73.529",
  "Destruction/Damage/Vandalisim of Property": "563.725",
  "Trespass of Real Property": "465.686",
  "Disorderly Conduct": "404.412",
  "Driving Under the Influence": "625.000",
  "Drug/Narcotic Violations": "1115.196",
  "Drug Equipment Violations": "392.157",
  "Liquor Law Violations": "208.333",
  "Runaway": "24.510",
  "Weapon Law Violations": "477.941",
  "Kidnapping": "12.255",
  "Negligent Manslaughter": "12.255",
  "Forcible Sodomy": "24.510",
  "Murder and Non-Negligent Manslaughter": "12.255",
  "False Pretenses/Swindle/Confidence Game": "147.059",
  "Credit Card/Auto Teller Machine Fraud": "12.255",
  "Animal Cruelty": "12.255"
}
```
