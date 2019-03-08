"use strict";

import html      from "../modules/html.js";
import Utils     from "../modules/Utils.js";
import Router    from "../modules/Router.js";
import Network   from "../modules/Network.js";
import WSMessage from "../modules/WSMessage.js";
const { MessageType } = WSMessage;
var router = null;

// === CONSTANTS ==========================================================
// Assorted consts
const ENTER_KEYCODE = 13;
const LOGIN_ERROR_TIMEOUT   = 3000; // in milliseconds
const INVALID_CHARS_TIMEOUT = 5000; // in milliseconds

// Error messages
const EMPTY_USERNAME_MSG       = "Your username cannot be blank.";
const USERNAME_INVALID_MSG     = "Your username contained unallowed characters.  Feel free to use the altered version above.";
const USERNAME_UNAVAILABLE_MSG = "That username is unavailable, please choose another.";

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
		let inputVal = usernameInput.value;
		let username = Utils.sanitize(inputVal);

		// Check for errors
		if( !username.length )
		{
			displayError(EMPTY_USERNAME_MSG, LOGIN_ERROR_TIMEOUT, [usernameInput]);
			return;
		}
		else if( inputVal.length !== username.length )
		{
			// If sanitation altered but did not delete a username, notify
			usernameInput.value = username;
			displayError(USERNAME_INVALID_MSG, INVALID_CHARS_TIMEOUT, [usernameInput]);
			return;
		}


		// Send the username to the server to be registered
		Network.setUsername(username);
	});
}

function handleSetUsernameResponse(response)
{
	// Get the username value from the input field
	let usernameInput = document.querySelector(USERNAME_SEL);
	let username      = usernameInput.value;

	let { code, success } = response;
	if( !success )
	{
		displayError(USERNAME_UNAVAILABLE_MSG, LOGIN_ERROR_TIMEOUT, [usernameInput]);
		return;
	}

	// If the username was successfully registered, save it in sessionStorage
	// and send the user to the matchmaking page.
	window.sessionStorage.setItem("username", username);
	router.routeTo(Router.Routes.matchmaking);
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
		router = new Router();

		let usernameInput = document.querySelector(USERNAME_SEL);
		let playButton    = document.querySelector(PLAYBTN_SEL);

		// Register event listeners
		registerEnterKeyListener(usernameInput, playButton);
		registerPlayButtonClickListener(usernameInput, playButton, router);

		// Register network event listeners
		Network.registerResponseHandler(MessageType.setUsername, handleSetUsernameResponse);
	}
}

export default Login;
// ========================================================================
