"use strict";


(function(matchmaking, window, siteNav, searchModal, serverComm, undefined)
{
	// === CONSTANTS ==========================================================
	// Assorted consts
	const ENTER_KEYCODE = 13;

	// Helper funcs
	const andThrow = (err) => { throw new Error(err); };
	const greet    = (username) => "Hi, " + username + "!";

	// Element selectors
	const USERNAME_LABEL_SEL       = "#username-label";
	const RANDOM_SEARCH_BUTTON_SEL = "#random-matchmaking-btn";
	// ========================================================================


	// === ONLOAD =============================================================
	// Register any element event listeners on load
	window.addEventListener("load", () =>
	{
		restoreUsername();

		// Grab references to UI elements
		let randomSearchBtn = document.querySelector(RANDOM_SEARCH_BUTTON_SEL);

		// Attach UI event listeners
		randomSearchBtn.addEventListener("click", () =>
		{
			enterMatchmakingQueue();
		});
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

	// Attempts to put the user into the search queue for matchmaking.
	// Displays the search modal and binds handlers for its elements.
	function enterMatchmakingQueue(username)
	{
		// 1. Send websocket message to server requesting to be put into
		//    the matchmaking queue.
		// TODO: REQUIRES BACKEND
		let config = {};

		// 2. Open the search
		searchModal.init(config);
	}
	// ========================================================================

}
( typeof window.matchmaking === "undefined" ? window.matchmaking = {} : window.matchmaking
, window
, siteNav
, searchModal
, typeof serverComm === "undefined" ? mock : serverComm
))
