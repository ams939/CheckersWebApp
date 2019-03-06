"use strict";

import html   from "../modules/html.js";
import Router from "../modules/Router.js";

// Import subviews
import Navbar      from "./Navbar.js";
import SearchModal from "./SearchModal.js";

class Matchmaking
{
	static render()
	{
		return(html`

		${Navbar.render()}

		${SearchModal.render()}

		<div id="matchmaking">
			<div class="container withnav flex-center">

				<div id="random-card" class="card spacer m32">
					<div class="card-header default-primary-color">
						<span class="text-light-primary-color">Random Matchmaking</span>
					</div>
					<div class="card-content flex-center vert">
						<p>Click the button below to enter the random matchmaking queue.</p>
						<button id="random-matchmaking-btn" class="accent-color text-light-primary-color">ENTER MATCHMAKING QUEUE</button>
						<p class="tip-text center-text">
							You will be put into the first available open match.
							<br/>
							You can cancel the search any time by clicking on the "cancel" button.
						</p>
					</div>
				</div>


				<div id="game-search-card" class="card spacer m32">
					<div class="card-header default-primary-color">
						<span class="text-light-primary-color">Search Open Games</span>
					</div>
					<div class="card-content flex-center vert">
						<input id="game-search-input" type="text" placeholder="Search for username or room name"/>
						<div id="game-search-results-area" class="flex-center vert">
							<div id="game-search-results-placeholder" class="flex-center">
								<span class="secondary-text-color">No games found.</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		`);
	}


	static setup()
	{
		// Setup subviews
		Navbar.setup();
		SearchModal.setup();

		// Setup this view
	}
}

export default Matchmaking;