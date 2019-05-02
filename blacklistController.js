const Blacklist  =  require( "./blacklist" );

exports.getBlacklist =
	( req , res ) =>
	{
		// === Query Database === //
		Blacklist.find(
			req.query,
			( err , blacklist ) =>
			{
				if ( err )
				{
					res.status( 500 ).send( err );
				}
				res.status( 200 ).send( blacklist );
			});
	};


exports.isBlacklisted = 
	async function ( countryCode )
	{
		query      = { countryCode : countryCode };
		blacklist  = await Blacklist.findOne( query );
		return blacklist;
	};