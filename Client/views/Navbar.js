"use strict";

import html   from "../modules/html.js";
import Router from "../modules/Router.js";

// === CONSTANTS ==============================================================
const USERNAME_LABEL_SEL = "#username-label";
const LOGOUT_BUTTON_SEL  = "#logout-btn";
const greet = (name) => "Hi, " + name + "!";
// ============================================================================


// === EVENT HANDLERS =========================================================
function onLogoutButtonClick()
{
	// Clear the username from sessionStorage
	sessionStorage.removeItem("username");

	// Reload the page, causing a redirect to the login route
	window.location.reload();
}
// ============================================================================


class Navbar
{
	constructor()
	{
	}

	render()
	{
		return(html`
        <div id="navbar" class="flex-between">
            <div class="spacer m16">
                <span id="username-label" class="text-light-primary-color"></span>
            </div>
			<div class="spacer m16 flex-center vert">
				<button id="logout-btn" class="accent-color text-light-primary-color">LOG OUT</button>
			</div>
		</div>
		`);
	}


	setup()
	{
		let router = new Router();

		// Fetch username from sessionStorage
		let username = sessionStorage.getItem("username");

		// Redirect to login if there is no saved username
		if( !username )
		{
			router.routeTo(Router.Routes.login);
			return;
		}

		// Set the username label
		let usernameLabelEle = document.querySelector(USERNAME_LABEL_SEL);
		usernameLabelEle.innerText = greet(username)

		// Bind event handlers
		let logoutButton = document.querySelector(LOGOUT_BUTTON_SEL);
		logoutButton.addEventListener("click", onLogoutButtonClick);
	}
}

export default Navbar;