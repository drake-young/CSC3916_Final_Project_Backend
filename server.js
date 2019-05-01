// === FROM EXTERNAL FILES === //
var cors                 =  require( 'cors' );
var express              =  require( 'express' );
var http                 =  require( 'http' );
var bodyParser           =  require( 'body-parser' );
var passport             =  require( 'passport' );
var authController       =  require( './auth' );
var authJwtController    =  require( './auth_jwt' );
var jwt                  =  require( 'jsonwebtoken' );
var Blacklist		     =  require( './blacklist' );
var blacklistController  =  require( './blacklistController' );
var requestIp            =  require('request-ip');
require( './mydb.js' );


// === CREATE THE APP === //
var app  =  express( );

// === SET UP BODY PARSER === //
app.use( cors() );
app.use( bodyParser.json( ) );
app.use( bodyParser.urlencoded( { extended : false } ) );

// === SET UP PASSPORT === //
app.use( passport.initialize( ) );

// === CREATE ROUTER === //
var router  =  express.Router( );



// === ROUTES TO GET COUNTRY BLACKLIST === //
router.route('/ip')
	.get(
		function ( req , res )
		{
			res = res.status( 200 );
			ip = requestIp.getClientIp(req);
			o = { ip : ip };
			res.json(o);
		});



// === ROUTES TO GET COUNTRY BLACKLIST === //
router.route('/blacklist')
	.get(
		function ( req , res )
		{
			res = res.status( 200 );
			ip = requestIp.getClientIp(req);
			loc = http.get('http://api.ipstack.com/'+ip+'?access_key=7e69d862992dd6612c72a79f17335c94');
			o = { 
					ip : ip, 
					loc : loc,
					countryCode : loc.country_code,
					lat : loc.latitude,
					lon : loc.longitude,
					city : loc.city,
					countryName : loc.country_name
				};
			res.json(o);
		});
		

		
// === ATTEMPT TO ROUTE REQUEST === //
app.use( '/' , router );

// === LISTEN ON THE ENVIRONMENT PORT OR 8080 === //
app.listen( process.env.PORT || 8080 );

// === EXPORT APP FOR TESTS === //
module.exports  =  app; // for testing