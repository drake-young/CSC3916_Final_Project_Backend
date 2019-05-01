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
		
		
		
// === ROUTES TO GET LOCATION DATA === //
router.route('/location')
	.get(
		function ( req , res )
		{
			ip = requestIp.getClientIp(req);
			locationData = {};
			http.get(
				'http://api.ipstack.com/'+ip+'?access_key='+process.env.API_KEY, 
				(resp) => 
				{
					let data = '';

					// A chunk of data has been recieved
					resp.on('data', ( chunk ) => { data += chunk; } );

					// The whole response has been received. Print out the result.
					resp.on(
								'end', 
								() => 
								{
									jsonData = JSON.parse(data);
									locationData.countryCode = jsonData.country_code;
									locationData.countryName = jsonData.country_name;
									locationData.city        = jsonData.city;
									locationData.regionCode  = jsonData.region_code;
									locationData.regionName  = jsonData.region_name;
									locationData.longitude   = jsonData.longitude;
									locationData.latitude    = jsonData.latitude;
									console.log(locationData);
									res = res.status(200);
									res.json({ip:ip, locationData:locationData});
							}); })
				.on(
					"error", 
					(err) => 
					{ 
						console.log("Error: " + err.message); 
						res = res.status(200);
						res.json({message: err.message});
					});
		});



// === ROUTES TO GET COUNTRY BLACKLIST === //
router.route( '/blacklist' ).get( blacklistController.getBlacklist );



// === ROUTES TO POST PAYMENT === //
router.route( '/purchase' )
	.post(
		function ( req , res )
		{
			// === Get the IP === //
			ip = requestIp.getClientIp(req);
			http.get(
				'http://api.ipstack.com/'+ip+'?access_key='+process.env.API_KEY, 
				( resp ) => 
				{
					data = '';
					resp.on( 'data', ( chunk ) => { data += chunk; } );
					resp.on( 
							'end', 
							()=>
							{
								jsonData = JSON.parse( data );
								userCountryCode = jsonData.country_code;
								blacklistController.isBlacklisted( userCountryCode )
									.then(
										function ( blacklist )
										{
											if ( blacklist )
											{
												res.status(500).json( { success:false, message:"Your IP is from a blacklisted country" } );
											}
											else
											{
												res.status(200).json({success:true, message:"You have been cleared for purchase"});
											}
										})
									.catch(()=>{ res.status(500).json({message:"something went wrong internally"})});
							});
				})
				.on(
					"error", 
					(err) => 
					{ 
						console.log("Error: " + err.message); 
						res = res.status(200);
						res.json({message: err.message});
					});
			
		})
	// just for testing, will delete for final submission
	.get(
		function ( req , res )
		{
			// === Get the IP === //
			ip = requestIp.getClientIp(req);
			http.get(
				'http://api.ipstack.com/'+ip+'?access_key='+process.env.API_KEY, 
				( resp ) => 
				{
					data = '';
					resp.on( 'data', ( chunk ) => { data += chunk; } );
					resp.on( 
							'end', 
							()=>
							{
								jsonData = JSON.parse( data );
								userCountryCode = jsonData.country_code;
								blacklistController.isBlacklisted( userCountryCode )
									.then(
										function ( blacklist )
										{
											if ( blacklist )
											{
												res.status(500).json( { success:false, message:"Your IP is from a blacklisted country" } );
											}
											else
											{
												res.status(200).json({success:true, message:"You have been cleared for purchase"});
											}
										})
									.catch(()=>{ res.status(500).json({message:"something went wrong internally"})});
							});
				})
				.on(
					"error", 
					(err) => 
					{ 
						console.log("Error: " + err.message); 
						res = res.status(200);
						res.json({message: err.message});
					});
			
		});
		

		
// === ATTEMPT TO ROUTE REQUEST === //
app.use( '/' , router );

// === LISTEN ON THE ENVIRONMENT PORT OR 8080 === //
app.listen( process.env.PORT || 8080 );

// === EXPORT APP FOR TESTS === //
module.exports  =  app; // for testing