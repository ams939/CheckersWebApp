"use strict";

/*
 * The purpose of this file is to provide a standard interface for
 * programmatically redirecting the user to various places in the
 * site.  This helps avoid hardcoding URLs and other data that has
 * a high likelihood of changing in the future.
 */


(function(siteNav, window, undefined)
{
	

	// === CONSTS ================================================================
	// A collection of endpoints available on the site.  This exists as a "set",
	// and for convenience the value of each pair is the string representation
	// of the key.
	const ENDPOINTS = Object.freeze(
	{ login: "/login"
	, matchmaking: "/matchmaking"
	});
	// ===========================================================================
	

	// === NAVIGATION FUNCTIONS ==================================================
	function routeTo(endpoint)
	{
		let origin = window.location.origin;
		let href   = origin + endpoint;
		window.location.href = href;
	}
	// ===========================================================================
	

	// === SET UP EXPORTS ========================================================
	siteNav.routeTo   = routeTo;
	siteNav.endpoints = ENDPOINTS;
	// ===========================================================================

}
( typeof siteNav === "undefined" ? window.siteNav = {} : siteNav
, window
))
