"use strict";
/* eslint-disable no-console */

const VALID_CHARACTERS_REGEX = /[^a-zA-Z0-9_]*/g;


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

	static sanitize(input)
	{
		// Remove unsupported characters
		return input.replace(VALID_CHARACTERS_REGEX, "");
	}

	static newDiv(classes)
	{
		let ele = document.createElement("div");
		for(let item of classes)
		{
			ele.classList.add(item);
		}

		return ele;
	}

}

export default Utils;