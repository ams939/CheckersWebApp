"use strict";

import html   from "../modules/html.js";
import Mock   from "../modules/Mock.js";
import Utils  from "../modules/Utils.js";
import Router from "../modules/Router.js";

const serverComm = new Mock.ServerComm(false); // mocked serverComm with FAILING

// === CONSTANTS ==========================================================
// Assorted consts
const ENTER_KEYCODE = 13;
const LOGIN_ERROR_TIMEOUT = 3000; // in milliseconds

// Error messages
const EMPTY_USERNAME_MSG = "Your username cannot be blank.";

// Element selectors
const USERNAME_SEL       = "#username-input";
const PLAYBTN_SEL        = "#play-button";
const ERROR_MSG_SEL      = "#error-message";
const ERROR_MSG_TEXT_SEL = "#error-message > span";
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


function registerPlayButtonClickListener(usernameInput, playButton, router)
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
		// TODO: NETWORK
		let { code, data, error } = await serverComm.sendUsername(username).catch(Utils.andThrow);

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
			//siteNav.routeTo(siteNav.endpoints.matchmaking);
			router.routeTo(Router.Routes.matchmaking);
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


// === VIEW MODULE ========================================================
class Login
{
	constructor()
	{
	}

	render()
	{
		return(html`
		<div id="login">
			<div class="container flex-center vert">
				<div class="card flex-center vert">
					<div class="card-header default-primary-color">
						<span class="text-light-primary-color">Welcome to Checkers!</span>
					</div>
					<div class="card-content flex-center vert">
						<div class="flex-center spacer m8">
							<span class="text-primary-color">Please choose a username:</span>
						</div>
						<div class="flex-center spacer m8">
							<input id="username-input" type="text" placeholder="Username"/>
						</div>
						<div id="error-message" class="flex-center hide">
							<span class="error-color"><!-- error text goes here --></span>
						</div>
						<div class="flex-center spacer m8">
							<button id="play-button" class="accent-color text-light-primary-color">PLAY</button>
						</div>
					</div>
				</div>
			</div>
		`);
	}


	setup()
	{
		// Initalize a router instance to use in the event bindings
		let router = new Router();

		let usernameInput = document.querySelector(USERNAME_SEL);
		let playButton    = document.querySelector(PLAYBTN_SEL);

		// Register event listeners
		registerEnterKeyListener(usernameInput, playButton);
		registerPlayButtonClickListener(usernameInput, playButton, router);
	}
}

export default Login;
// ========================================================================
