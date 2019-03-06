"use strict";


(function(matchmaking, window, siteNav, searchModal, undefined)
{
	// === CONSTANTS ==========================================================
	// Assorted consts
	const ENTER_KEYCODE = 13;

	// Helper funcs
	const andThrow = (err) => { throw new Error(err); };
	const greet    = (username) => "Hi, " + username + "!";

	// Element selectors
	const USERNAME_LABEL_SEL = "#username-label";
	// ========================================================================


	// === ONLOAD =============================================================
	// Register any element event listeners on load
	window.addEventListener("load", () =>
	{
		restoreUsername();
	});
	// ========================================================================


	// === UI/ELEMENT FUNCTIONS ===============================================
	// Check to see if the user has a value for "username" in the
	// session storage.  If not, send them back to the login page.
	function restoreUsername()
	{
		let username = sessionStorage.getItem("username");
		if( !username )
		{
			siteNav.routeTo(siteNav.endpoints.login);
			return;
		}
		setUsernameLabel(username);
	}

	// Fill the navbar username label with the given value.
	function setUsernameLabel(username)
	{
		let usernameLabelEle = document.querySelector(USERNAME_LABEL_SEL);
		usernameLabelEle.innerText = greet(username);
	}
	// ========================================================================

}
( typeof window.matchmaking === "undefined" ? window.matchmaking = {} : window.matchmaking
, window
, siteNav
, searchModal
))
