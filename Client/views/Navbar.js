"use strict";

import html   from "../modules/html.js";
import Router from "../modules/Router.js";

// === CONSTANTS ==============================================================
const USERNAME_LABEL_SEL = "#username-label";
const greet = (name) => "Hi, " + name + "!";
// ============================================================================

class Navbar
{
	static render()
	{
		return(html`
        <div id="navbar">
            <div class="spacer m16">
                <span id="username-label" class="text-light-primary-color"></span>
            </div>
		</div>
		`);
	}


	static setup()
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
	}
}

export default Navbar;