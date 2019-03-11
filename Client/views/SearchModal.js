"use strict";

import html    from "../modules/html.js";
import Utils   from "../modules/Utils.js";
import Router  from "../modules/Router.js";
import Network from "../modules/Network.js";


// === CONSTANTS ==============================================================
// Element selectors
const MODAL_CONTAINER_SEL     = "#modal-container";

const SEARCHING_CONTENT_SEL   = "#match-search-modal-searching";
const FOUND_CONTENT_SEL       = "#match-search-modal-found";
const CANCELLED_CONTENT_SEL   = "#match-search-modal-cancelled";
const ERROR_CONTENT_SEL       = "#match-search-modal-error";
const GAME_WON_CONTENT_SEL    = "#match-search-modal-gameWon";
const GAME_LOST_CONTENT_SEL   = "#match-search-modal-gameLost";
const GAME_DRAW_CONTENT_SEL   = "#match-search-modal-gameDraw";

const CANCEL_BUTTON_SEL       = "#cancel-search-btn";
const ACCEPT_BUTTON_SEL       = "#accept-match-btn";
const REJECT_BUTTON_SEL       = "#reject-match-btn";
const OKAY_BUTTON_SEL         = "#cancelled-okay-btn";
const CLOSE_BUTTON_SEL        = "#error-close-btn";
const MATCHMAKING_BUTTON_SELS = ".return-to-matchmaking-btn"; // NOTE: this is a class and there are multiple!

const ERROR_MESSAGE_SEL       = "#search-modal-error-message";
const WIN_INFO_SEL            = "#additional-win-info";

// Modal States
const ModalState = Object.freeze(
{ hidden: 0
, searching: 1
, found: 2
, cancelled: 3
, error: 4
, gameWon: 5
, gameLost: 6
, gameDraw: 7
})

// Assorted
const HIDDEN_CLASS_NAME   = "hidden";
const INVALID_STATE_ERROR = (state) => `Attempted to use invalid state: "${state}"`;
// ============================================================================


// === UI/ELEMENT FUNCTIONS ===================================================
function setErrorMessage(message)
{
	let errorMessageEle = document.querySelector(ERROR_MESSAGE_SEL);
	errorMessageEle.innerText = message;
}

function getStateElements()
{
	let stateEles = {};

	stateEles[ModalState.hidden]    = document.querySelector(MODAL_CONTAINER_SEL);
	stateEles[ModalState.searching] = document.querySelector(SEARCHING_CONTENT_SEL);
	stateEles[ModalState.found]     = document.querySelector(FOUND_CONTENT_SEL);
	stateEles[ModalState.cancelled] = document.querySelector(CANCELLED_CONTENT_SEL);
	stateEles[ModalState.error]     = document.querySelector(ERROR_CONTENT_SEL);
	stateEles[ModalState.gameWon]   = document.querySelector(GAME_WON_CONTENT_SEL);
	stateEles[ModalState.gameLost]  = document.querySelector(GAME_LOST_CONTENT_SEL);
	stateEles[ModalState.gameDraw]  = document.querySelector(GAME_DRAW_CONTENT_SEL);

	return stateEles;
}
// ============================================================================


// === STATE FUNCTIONS ========================================================
// Returns true iff the given state value is in the ModalState object
function isValidState(state)
{
	for(let current in ModalState)
	{
		if( state === ModalState[current] )
		{
			return true;
		}
	}
	return false;
}

// Checks if the given state is valid.  If it is not, throws an error.
function assertStateIsValid(state)
{
	if( !isValidState(state) )
	{
		Utils.traceIfLocal();
		throw new Error(INVALID_STATE_ERROR(state));
	}
}
// ============================================================================


// === VIEW MODULE ============================================================
class SearchModal
{
	constructor()
	{
		this.currentState  = ModalState.hidden;
		this.stateElements = null;
	}

	render()
	{
		return(html`
		<div id="modal-container" class="flex-center hidden">

			<!-- TODO: move this attribution inside the "searching" content so it doesn't show on every state -->
			<div id="loadingio-attribution">
				<span>
					Loading icon provided for free courtesy of <a href="https://loading.io/" target="_blank" style="color: inherit">loading.io</a>
				</span>
			</div>

			<div id="match-search-modal" class="card">

				<!-- Modal content when state=SEARCHING -->
				<div id="match-search-modal-searching" class="hidden">
					<div class="card-header default-primary-color">
						<span class="text-light-primary-color">Searching...</span>
					</div>
					<div class="card-content flex-center vert">
						<div class="flex-center spacer m8">
							<span class="text-light-secondary-color">Waiting for an opponent...</span>
						</div>
						<div class="flex-center spacer m8">
							<img class="loading-spinner" src="../assets/loading.svg"/>
						</div>
						<div class="flex-center spacer m8">
							<button id="cancel-search-btn" class="accent-color text-light-primary-color">CANCEL SEARCH</button>
						</div>
					</div>
				</div>
				
				<!-- Modal content when state=FOUND -->
				<div id="match-search-modal-found" class="hidden"> 
					<div class="card-header default-primary-color">
						<span class="text-light-primary-color">Match Found!</span>
					</div>
					<div class="card-content flex-center vert">
						<div class="flex-center vert spacer m8">
							<p class="text-light-secondary-color center-text">
								You've been matched with an opponent.
								<br/>
								Please accept or reject this match below.
							</p>
						</div>
						<div class="flex-around spacer m8">
							<button id="accept-match-btn">ACCEPT</button>
							<button id="reject-match-btn">REJECT</button>
						</div>
					</div>
				</div>

				<!-- Modal content when state=CANCELLED -->
				<div id="match-search-modal-cancelled" class="hidden"> 
					<div class="card-header default-primary-color">
						<span class="text-light-primary-color">Match Cancelled</span>
					</div>
					<div class="card-content flex-center vert">
						<div class="flex-center vert spacer m8">
							<p class="text-light-secondary-color center-text">
								Your opponent has withdrawn from the match.
								<br/>
								Click "okay" to return to close this window.
							</p>
						</div>
						<div class="flex-around spacer m8">
							<button id="cancelled-okay-btn" class="accent-color text-light-primary-color">OKAY</button>
						</div>
					</div>
				</div>

				<!-- Modal content when state=ERROR -->
				<div id="match-search-modal-error" class="hidden"> 
					<div class="card-header error-background">
						<span class="text-light-primary-color">Whoops...</span>
					</div>
					<div class="card-content flex-center vert">
						<div class="flex-center vert spacer m8">
							<p class="text-light-secondary-color center-text">
								An error has occurred.
								<br/>
								<span id="search-modal-error-message"></span>
							</p>
						</div>
						<div class="flex-around spacer m8">
							<button id="error-close-btn" class="accent-color text-light-primary-color">CLOSE</button>
						</div>
					</div>
				</div>

				<!-- Modal content when state=GAMEWON -->
				<div id="match-search-modal-gameWon" class="hidden"> 
					<div class="card-header good-background">
						<span class="text-light-primary-color">You Win!</span>
					</div>
					<div class="card-content flex-center vert">
						<div class="flex-center vert spacer m8">
							<span class="text-light-secondary-color center-text spacer m8">
								Congratulations, you won! 
							</span>
							<span id="additional-win-info" class="secondary-text-color small spacer m4"></span>
						</div>
						<div class="flex-center vert spacer m8">
							<button class="return-to-matchmaking-btn accent-color text-light-primary-color">RETURN TO MATCHMAKING</button>
						</div>
					</div>
				</div>

				<!-- Modal content when state=GAMELOST -->
				<div id="match-search-modal-gameLost" class="hidden"> 
					<div class="card-header error-background">
						<span class="text-light-primary-color">You Lose.</span>
					</div>
					<div class="card-content flex-center vert">
						<div class="flex-center vert spacer m8">
							<p class="text-light-secondary-color center-text">
								You lost the game.  Better luck next time! 
							</p>
						</div>
						<div class="flex-around spacer m8">
							<button class="return-to-matchmaking-btn accent-color text-light-primary-color">RETURN TO MATCHMAKING</button>
						</div>
					</div>
				</div>

				<!-- Modal content when state=GAMEDRAW -->
				<div id="match-search-modal-gameDraw" class="hidden"> 
					<div class="card-header default-primary-color">
						<span class="text-light-primary-color">It's a Draw!</span>
					</div>
					<div class="card-content flex-center vert">
						<div class="flex-center vert spacer m8">
							<p class="text-light-secondary-color center-text">
								Neither you nor your opponent was able to win.
							</p>
						</div>
						<div class="flex-around spacer m8">
							<button class="return-to-matchmaking-btn accent-color text-light-primary-color">RETURN TO MATCHMAKING</button>
						</div>
					</div>
				</div>



			</div>
		</div>
		`);
	}

	setup()
	{
		// Initialize state elements
		this.stateElements = getStateElements();

		// Grab references to the button elements
		let cancelButton       = document.querySelector(CANCEL_BUTTON_SEL);
		let closeButton        = document.querySelector(CLOSE_BUTTON_SEL)
		let matchmakingButtons = document.querySelectorAll(MATCHMAKING_BUTTON_SELS);

		// Attach events
		cancelButton.addEventListener("click", () => 
		{
			// Remove user from search queue
			Network.leaveQueue();
		});

		closeButton.addEventListener("click", () =>
		{
			this.close();
		});

		// Bind button events for the endgame screens
		for(let ele of matchmakingButtons)
		{
			ele.addEventListener("click", () =>
			{
				this.close();
				new Router().routeTo(Router.Routes.matchmaking); // FIXME: eventually make Router static, doesn't make sense for it to have state
			});
		}

		// Hide the modal initially (just in case)
		this.setState(ModalState.hidden);
	};


	setState(state)
	{
		assertStateIsValid(state);

		// If an actual change occurred ...
		if( state !== this.currentState )
		{
			// ... set the current state and do the UI transition.
			this.currentState = state;
			this.transitionStateElement(this.currentState);
		}
	}

	transitionStateElement(destinationState)
	{
		assertStateIsValid(destinationState);

		// Hide all non-destination states
		for(let state in ModalState)
		{
			let stateVal = ModalState[state];
			if( stateVal !== destinationState )
			{
				this.hideState(stateVal);
			}
		}

		// Show destination state element
		this.unhideState(destinationState);
	}

	hideState(state)
	{
		assertStateIsValid(state);

		// SPECIAL CASE:
		// When we "hide" the hidden state, we actually are going to show it.
		// This is a direct reversal of what we do for all other states.
		if( state === ModalState.hidden )
		{
			this.stateElements[state].classList.remove(HIDDEN_CLASS_NAME);
			return;
		}

		this.stateElements[state].classList.add(HIDDEN_CLASS_NAME);
	}

	unhideState(state)
	{
		// SPECIAL CASE:
		// When we "unhide" the hidden state, we actually are going to hide it.
		// This is a direct reversal of what we do for all other states.
		if( state === ModalState.hidden )
		{
			this.stateElements[state].classList.add(HIDDEN_CLASS_NAME);
			return;
		}

		this.stateElements[state].classList.remove(HIDDEN_CLASS_NAME);
	}

	open()
	{
		this.setState(ModalState.searching);
	}

	close()
	{
		this.setState(ModalState.hidden);
	}

	showError(message)
	{
		setErrorMessage(message);
		this.setState(ModalState.error);
	}

	showWin(additionalInfo)
	{
		let wininfo = document.querySelector(WIN_INFO_SEL);
		wininfo.innerText = "";

		if( additionalInfo )
		{
			wininfo.innerText = additionalInfo;
		}

		this.setState(ModalState.gameWon);
	}

	showLose()
	{
		this.setState(ModalState.gameLost);
	}

	showDraw()
	{
		this.setState(ModalState.gameDraw);
	}
}
// ============================================================================

export default SearchModal;