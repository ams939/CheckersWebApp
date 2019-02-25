"use strict";

(function(login, window, serverComm, siteNav, undefined)
{
	// === CONSTANTS ==========================================================
	// Assorted consts
	const ENTER_KEYCODE = 13;
	const LOGIN_ERROR_TIMEOUT = 3000; // in milliseconds

	// Error messages
	const EMPTY_USERNAME_MSG = "Your username cannot be blank.";

	// Helper funcs
	const andThrow = (err) => { throw new Error(err); };

	// Element selectors
	const USERNAME_SEL  = "#username-input";
	const PLAYBTN_SEL   = "#play-button";
	const ERROR_MSG_SEL      = "#error-message";
	const ERROR_MSG_TEXT_SEL = "#error-message > span";
	// ========================================================================


	// === ONLOAD =============================================================
	// Register any element event listeners on load
	window.addEventListener("load", () =>
	{
		let usernameInput = document.querySelector(USERNAME_SEL);
		let playButton    = document.querySelector(PLAYBTN_SEL);

		// Register event listeners
		registerEnterKeyListener(usernameInput, playButton);
		registerPlayButtonClickListener(usernameInput, playButton);
	});
	// ========================================================================


	// === EVENT REGISTRATION FUNCTIONS =======================================
	function registerEnterKeyListener(usernameInput, playButton)
	{
		usernameInput.addEventListener("keydown", (event) =>
		{
			if( event.keyCode === ENTER_KEYCODE )
			{
				playButton.click();
			}
		});
	}


	function registerPlayButtonClickListener(usernameInput, playButton)
	{
		playButton.addEventListener("click", async function(event)
		{
			// Get the username from the input
			let username = usernameInput.value;

			if( !username.length )
			{
				displayError(EMPTY_USERNAME_MSG, LOGIN_ERROR_TIMEOUT, [usernameInput]);
				return;
			}

			// Send the username to the server to be registered
			let { code, data, error } = await serverComm.sendUsername(username).catch(andThrow);

			// If there was a reason we couldn't register the username, display this
			// reason to user and set the input to have the "error" class.
			if( error !== null )
			{
				displayError(error.message, LOGIN_ERROR_TIMEOUT, [usernameInput]);
				return;
			}

			// If the username was successfully registered, save it in sessionStorage
			// and send the user to the matchmaking page.
			if( data.username )
			{
				// Save username in session data
				window.sessionStorage.setItem("username", data.username);

				// Clear the input
				usernameInput.value = "";

				// Redirect user to matchmaking
				siteNav.routeTo(siteNav.endpoints.matchmaking);
			}
		});
	}
	// ========================================================================


	// === UI/ELEMENT MANIPULATION FUNCTIONS ==================================
	function updateErrorMessage(message)
	{
		// Show/hide an error message depending on the value passed.
		// If given a string message, the error message is displayed.  If a blank
		// message is passed (or none at all), the error message area is hidden.

		let errorMessageEle     = document.querySelector(ERROR_MSG_SEL);
		let errorMessageTextEle = document.querySelector(ERROR_MSG_TEXT_SEL);

		if( typeof message !== "undefined" && message.length )
		{
			errorMessageTextEle.innerText = message;
			errorMessageEle.classList.remove("hide");
		}
		else
		{
			errorMessageEle.classList.add("hide");
			errorMessageTextEle.innerText = "";
		}
	}


	function displayError(message, timeout, errorEles=[])
	{
		updateErrorMessage(message); // Show the error message
		for( let ele of errorEles )
		{
			ele.classList.add("error"); // Add the "error" class 
		}

		// Revert the status of the error elements after a timeout
		setTimeout(() =>
		{
			updateErrorMessage();
			for( let ele of errorEles )
			{
				ele.classList.remove("error"); // Remove the "error" class 
			}
		}, timeout); 
	}

	// ========================================================================
}
( typeof login === "undefined" ? window.login = {} : login
, window
, mock.serverComm // TODO: mocked 
, siteNav
))
