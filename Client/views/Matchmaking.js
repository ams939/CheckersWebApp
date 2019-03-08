"use strict";

import html        from "../modules/html.js";
import Router      from "../modules/Router.js";
import Network     from "../modules/Network.js";
import WSMessage   from "../modules/WSMessage.js";
import GameSession from "../modules/GameSession.js";

const { MessageType } = WSMessage;

// Import subviews
import Navbar      from "./Navbar.js";
import SearchModal from "./SearchModal.js";


// === CONSTANTS ==============================================================
const RANDOM_SEARCH_BUTTON_SEL = "#random-matchmaking-btn";

const JOIN_QUEUE_ERROR_MSG  = "Failed to join the matchmaking queue.  Please try again.";
const LEAVE_QUEUE_ERROR_MSG = "There was an issue taking you out of the queue.  This is an issue on our end, sorry about that!  You'll be reconnected in five seconds.";
// ============================================================================

class Matchmaking
{
	constructor()
	{
		this.searchModal = new SearchModal();
		this.navbar      = new Navbar();
	}

	render()
	{
		return(html`

		${this.navbar.render()}

		${this.searchModal.render()}

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


	setup()
	{
		// Setup subviews
		this.navbar.setup();
		this.searchModal.setup();

		// Grab references to interactive elements
		let randomSearchButton = document.querySelector(RANDOM_SEARCH_BUTTON_SEL);
		
		// Attach event handlers
		randomSearchButton.addEventListener("click", () =>
		{
			this.searchModal.open();
			Network.joinQueue(); // send a message to join the queue
		});

		// Register network response handlers
		Network.registerResponseHandler(MessageType.joinQueue, (response) =>
		{
			// Check for success
			if( response.success )
			{
				console.log("Joined matchmaking queue.");
			}
			else
			{
				// If we errored out, show the error modal
				console.log("Failed to join the matchmaking queue.");
				this.searchModal.showError(JOIN_QUEUE_ERROR_MSG);
			}
		});

		Network.registerResponseHandler(MessageType.leaveQueue, (response) =>
		{
			// Check for success
			if( response.success )
			{
				console.log("Left matchmaking queue.");
				this.searchModal.close();
			}
			else
			{
				// For some reason we're still in the queue?
				console.log("Failed to leave matchmaking queue.");
				this.searchModal.showError(LEAVE_QUEUE_ERROR_MSG);

				// Reconnect after five seconds.  This attempts to fix the issue, at least client-side.
				setTimeout(() => window.location.reload(), 5000);
			}
		});

		Network.registerResponseHandler(MessageType.gameFound, (response) =>
		{
			console.log("Game found!");

			// Use the message to initialize the GameSession and redirect to the GameView route
			let { code, ...gameState } = response;
			GameSession.create(gameState);

			// Reroute to the game page
			let router = new Router();
			router.routeTo(Router.Routes.game);
		});


	}
}

export default Matchmaking;