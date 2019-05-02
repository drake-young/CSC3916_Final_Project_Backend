# CSC3916_Final_Project_Backend

##Base URL of Server hosted on Heroku:

If you want to access the base URL (and receive an error message) [click here!](https://csc3916-final-project-backend.herokuapp.com)

## /ip

The server supports GET requests to the /ip route. All other types of requests should result in an appropriate response message which explains why the failure occurred.

This route was initially designed for testing IP extraction from HTTP requests, however the team decided it was best to leave this route in to demo the functionality of this individual component.

[Click Here to see your IP!](https://csc3916-final-project-backend.herokuapp.com/ip)

## /location

The server supports GET requests to the /location route. All other types of requests should result in an appropriate response message which explains why the failure occurred.

This route was initially designed for testing an interface with the ipstack API to determine location data from IP address, but the team decided it was best to leave this route in to demo the functionality of this individual component.

[Click Here to see Your Calculated Location!](https://csc3916-final-project-backend.herokuapp.com/location)

## /blacklist

The server supports GET requests to the /blacklist route. All other types of requests should result in an appropriate response message which explains why the failure occurred.

This route was initially designed to test the contents of the database and ensure that the server was successfully querying values in the database, but the team decided it was best to leave this route in to demo our database connectivity and structure.

[Click Here to see All Blacklisted Country Codes!](https://csc3916-final-project-backend.herokuapp.com/blacklist)

[Click Here to see if Russia is in the Blacklist!](https://csc3916-final-project-backend.herokuapp.com/blacklist?countryCode=RU)

[Click Here to see if the United States is in the Blacklist!](https://csc3916-final-project-backend.herokuapp.com/blacklist?countryCode=US)

## /purchase

The server currently supports both GET and POST methods to the /purchase, however, GET requests will be removed when the debugging period has finished. All other requests should result in an appropriate response message which explains why the failure occurred.

This route is meant to simulate handling a purchase form from a react application (link to that app coming soon). This route extracts the IP from the requests, cross-references the database to determine whether the user is in a blacklisted country, and either approves or denies the transaction based on the status of the database query. If we were truly handling payments, we would then process that payment and send a receipt instead. 

Note that the user's longitude and latitude are also included in the response sent. This is intended for the react app to use Google Maps' API to generate a map of the user's location on declined purchases

[Click Here to Demo a GET Request!](https://csc3916-final-project-backend.herokuapp.com/purchase)

## Postman

A postman button with all the supported requests is coming soon!
