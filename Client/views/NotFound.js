"use strict";

import html   from "../modules/html.js";
import Router from "../modules/Router.js";

class Login
{
	constructor()
	{
	}

	render()
	{
		return(html`
        <div class="container flex-center vert">
            <div class="card flex-center vert">
                <div class="card-header default-primary-color">
                    <span class="text-light-primary-color">You Made a Wrong Turn (404)</span>
                </div>
                <div class="card-content flex-center vert">
					<div class="flex-center">
						<p class="text-primary-color center-text">
							This place doesn't exist...
							<br/>
							Quick! Retreat to the safety of the <a href="/#/matchmaking">main page</a>!
						</p>
                    </div>
                </div>
            </div>
		`);
	}

	setup()
	{
	}
}

export default Login;