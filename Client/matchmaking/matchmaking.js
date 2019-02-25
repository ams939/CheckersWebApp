"use strict";


(function(matchmaking, window, siteNav, undefined)
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
		// 1. Check to see if the user has a value for "username" in the
		//    session storage.  If not, send them back to the login page.
		let username = sessionStorage.getItem("username");
		if( !username )
		{
			siteNav.routeTo(siteNav.endpoints.login);
			return;
		}
		setUsernameLabel(username);

	});
	// ========================================================================


	// === EVENT REGISTRATION FUNCTIONS =======================================
	// ========================================================================


	// === UI/ELEMENT MANIPULATION FUNCTIONS ==================================
	function setUsernameLabel(username)
	{
		let usernameLabelEle = document.querySelector(USERNAME_LABEL_SEL);
		usernameLabelEle.innerText = greet(username);
	}
	// ========================================================================

}
( typeof matchmaking === "undefined" ? matchmaking = {} : matchmaking
, window
, siteNav
))
