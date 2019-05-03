// === FROM EXTERNAL FILES === //
var cors                 =  require( 'cors' );
var express              =  require( 'express' );
var http                 =  require( 'http' );
var bodyParser           =  require( 'body-parser' );
var passport             =  require( 'passport' );
var jwt                  =  require( 'jsonwebtoken' );
var Blacklist		     =  require( './blacklist' );
var blacklistController  =  require( './blacklistController' );
var requestIp            =  require( 'request-ip' );
require( 'dotenv' ).load( );
require( './mydb.js' );


// === CREATE THE APP === //
var app  =  express( );

// === SET UP BODY PARSER === //
app.use( cors( ) );
app.use( bodyParser.json( ) );
app.use( bodyParser.urlencoded( { extended : false } ) );

// === SET UP PASSPORT === //
app.use( passport.initialize( ) );

// === CREATE ROUTER === //
var router  =  express.Router( );



// === DEFAULT BAD ROUTE MESSAGE === //
function sendBadRouteMessage( res )
{
	res  =  res.status( 404 );
	res.json( { message : "That URL Path Doesn't Exist" } );
}


// === DEFAULT UNSUPPORTED METHOD MESSAGE === //
function sendUnsupportedMethodMessage( req , res , route )
{
	res  =  res.status( 405 );
	res.json( { message : req.method + " requests are not supported by " + route } );
}



// === ROUTES TO GET COUNTRY BLACKLIST === //
router.route( '/ip' )
	.get(
		( req , res ) =>
		{
			res  = res.status( 200 );
			ip   = requestIp.getClientIp( req );
			o    = { ip : ip };
			res.json( o );
		})
	.all(
		( req , res ) =>
		{
			sendUnsupportedMethodMessage( req , res , "/ip" );
		});
		
		
		
// === ROUTES TO GET LOCATION DATA === //
router.route( '/location' )
	.get(
		( req , res ) =>
		{
			ip            =  requestIp.getClientIp( req );
			locationData  =  { };
			http.get(
				'http://api.ipstack.com/' + ip + '?access_key=' + process.env.API_KEY, 
				( resp ) => 
				{
					let data = '';

					// A chunk of data has been recieved
					resp.on( 'data', ( chunk ) => { data += chunk; } );

					// The whole response has been received. Print out the result.
					resp.on(
								'end', 
								( ) => 
								{
									jsonData                 =  JSON.parse( data );
									locationData.countryCode =  jsonData.country_code;
									locationData.countryName =  jsonData.country_name;
									locationData.city        =  jsonData.city;
									locationData.regionCode  =  jsonData.region_code;
									locationData.regionName  =  jsonData.region_name;
									locationData.longitude   =  jsonData.longitude;
									locationData.latitude    =  jsonData.latitude;
									res                      =  res.status( 200 );
									res.json({ 
												ip           : ip, 
												locationData : locationData 
											});
							});//close on "end"
				}) // close http.get
				.on(
					"error", 
					( err ) => 
					{ 
						console.log( "Error: " + err.message ); 
						res  =  res.status( 500 );
						res.json( { message : err.message } );
					});
		}) //close route.get
	// === all other requests to /location are unsupported === //
	.all(
		( req , res ) =>
		{
			sendUnsupportedMethodMessage( req , res , "/location" );
		});



// === ROUTES TO GET COUNTRY BLACKLIST === //
router.route( '/blacklist' )
	.get( blacklistController.getBlacklist )
	.all(
		( req , res ) =>
		{
			sendUnsupportedMethodMessage( req , res , "/blacklist" );
		});



// === ROUTES TO POST PAYMENT === //
router.route( '/purchase' )
	.post(
		( req , res ) =>
		{
			// === Get the IP === //
			ip  =  requestIp.getClientIp( req );
			http.get(
				'http://api.ipstack.com/' + ip + '?access_key=' + process.env.API_KEY, 
				( resp ) => 
				{
					data  =  '';
					resp.on( 'data', ( chunk ) => { data += chunk; } );
					resp.on( 
							'end', 
							( ) =>
							{
								jsonData         =  JSON.parse( data );
								userCountryCode  =  jsonData.country_code;
								userLat          =  jsonData.latitude;
								userLong         =  jsonData.longitude;
								blacklistController.isBlacklisted( userCountryCode )
									.then(
										( blacklist ) =>
										{
											if ( blacklist )
											{
												res  =  res.status( 500 )
												res.json({
															success   : false, 
															message   : "Your IP is from a blacklisted country", 
															latitude  : userLat, 
															longitude : userLong 
														});
											}
											else
											{
												res  =  res.status( 200 )
												res.json({
															success   : true, 
															message   : "You have been cleared for purchase", 
															latitude  : userLat, 
															longitude : userLong
														});
											}
										})
									.catch( 
										( ) => 
										{ 
											res  =  res.status( 500 )
											res.json({
														success   : false,
														message   : "something went wrong internally", 
														latitude  : userLat, 
														longitude : userLong
													});
										});
							});
				})
				.on(
					"error", 
					( err ) => 
					{ 
						console.log( "Error: " + err.message ); 
						res  =  res.status( 500 );
						res.json({
									success   : false,
									message   : err.message,
									latitude  : null,
									longitude : null
								});
					});
			
		})
	.get(
		( req , res ) =>
		{
			// === Get the IP === //
			ip  =  requestIp.getClientIp( req );
			http.get(
				'http://api.ipstack.com/' + ip + '?access_key=' + process.env.API_KEY, 
				( resp ) => 
				{
					data  =  '';
					resp.on( 'data', ( chunk ) => { data += chunk; } );
					resp.on( 
							'end', 
							( ) =>
							{
								jsonData         =  JSON.parse( data );
								userCountryCode  =  jsonData.country_code;
								userLat          =  jsonData.latitude;
								userLong         =  jsonData.longitude;
								blacklistController.isBlacklisted( userCountryCode )
									.then(
										( blacklist ) =>
										{
											if ( blacklist )
											{
												res  =  res.status( 500 )
												res.json({
															success   : false, 
															message   : "Your IP is from a blacklisted country", 
															latitude  : userLat, 
															longitude : userLong 
														});
											}
											else
											{
												res  =  res.status( 200 )
												res.json({
															success   : true, 
															message   : "You have been cleared for purchase", 
															latitude  : userLat, 
															longitude : userLong
														});
											}
										})
									.catch( 
										( ) => 
										{ 
											res  =  res.status( 500 )
											res.json({
														success   : false,
														message   : "something went wrong internally", 
														latitude  : userLat, 
														longitude : userLong
													});
										});
							});
				})
				.on(
					"error", 
					( err ) => 
					{ 
						console.log( "Error: " + err.message ); 
						res  =  res.status( 500 );
						res.json({
									success   : false,
									message   : err.message,
									latitude  : null,
									longitude : null
								});
					});
			
		})
	.all(
		( req , res ) =>
		{
			sendUnsupportedMethodMessage( req , res , "/purchase" );
		});
		

		
// === ATTEMPT TO ROUTE REQUEST === //
app.use( '/' , router );

// === HANDLE ALL BAD URL PATHS === //
app.use(
	( req , res ) =>
	{
		sendBadRouteMessage( res );
	});

// === LISTEN ON THE ENVIRONMENT PORT OR 8080 === //
app.listen( process.env.PORT || 8080 );

// === EXPORT APP FOR TESTS === //
module.exports  =  app; // for testing