// === GRAB EXTERNAL RESOURCES === //
var mongoose  =  require( 'mongoose' );
var Schema    =  mongoose.Schema;

// === CREATE THE USER SCHEMA === //
var blacklistSchema  =  new Schema({
		countryCode  :	{ 
							type     : String, 
							required : true,
							unique   : true
						}
	});
	
// === CREATE THE USER MODEL === //
var Blacklist  =  mongoose.model( 'Blacklist' , blacklistSchema );

// === EXPORT THE USER MODEL === //
module.exports  =  Blacklist;