const Blacklist  =  require( "./blacklist" );

exports.getBlacklist =
	( req , res ) =>
	{
		// === Query Database === //
		// TODO: ping the API using the ip in the request to get location
		// TODO: query database to see if that location is blacklisted
		// TODO: return success/fail message depending on whether it's blacklisted
		Blacklist.find(
			req.query,
			( err , blacklist ) =>
			{
				if ( err )
				{
					res.status( 500 ).send( err );
				}
				res.status(200).send( blacklist );
			});
	};
