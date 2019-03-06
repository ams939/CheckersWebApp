"use strict";

class Utils
{
	// Returns a promise that resolves after a minimum of "ms"
	// milliseconds.
	static wait(ms)
	{
		return new Promise((resolve) =>
		{
			setTimeout(resolve, ms);
		});
	}


	// Meant as a wrapper for throwing an error, to be used
	// in Promise syntax like:
	// 		promise.then(() => { ... }).catch(andThrow);
	//
	static andThrow(error)
	{
		throw new Error(error);
	}


	// Performs a console trace if the hostname is "localhost"
	static traceIfLocal()
	{
		if( window.location.hostname === "localhost" )
		{
			console.trace();
		}
	}
}

export default Utils;