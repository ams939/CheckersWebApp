"use strict";

import html      from "../modules/html.js";
import Navbar    from "./Navbar.js";
import Network   from "../modules/Network.js";
import WSMessage from "../modules/WSMessage.js";
const { MessageType } = WSMessage;

// === CONSTS =================================================================
const OLD_POS_SEL   = "#DB-old-pos-input";
const NEW_POS_SEL   = "#DB-new-pos-input";
const SEND_MOVE_SEL = "#DB-send-move-btn";
// ============================================================================

class GameView
{
	constructor()
	{
		// Subviews
		this.navbar = new Navbar();
		this.gameInstance = null;
	}

	loadGame(gameInstance)
	{
		this.lastState = this.state;
		this.state     = gameInstance;
		this.update();
	}

	render()
	{

		return(html`

			${this.navbar.render()}


			<div class="container withnav flex-center">

				<div id="turn-info-area" class="card">
					<div class="card-header default-primary-color">
						<span class="text-light-primary-color">Turn Info</span>
					</div>
					<div class="card-content flex-center vert">
						<div class="spacer m8">
							<span id="turn-indicator">It's <strong>${this.player1}</strong>'s turn.</span>
						</div>
						<div class="spacer m8">
							<span id="turn-counter">Current Turn: ${this.turnCount}</span>
						</div>
					</div>
				</div>


				<div id="board-area" class="card">
					<div class="card-header default-primary-color">
						<span class="text-light-primary-color">Move Sending Test</span>
					</div>
					<div class="card-content flex-center vert">
						<input id="DB-old-pos-input" class="spacer m8" placeholder="old_pos" type="text"/>
						<input id="DB-new-pos-input" class="spacer m8" placeholder="new_pos" type="text"/>
						<button id="DB-send-move-btn" class="accent-color text-light-primary-color spacer m8">SEND MOVE</button>
					</div>
				</div>

			</div>
		`);
	}

	setup()
	{
		// Set up subviews
		this.navbar.setup();

		let sendMoveBtn = document.querySelector(SEND_MOVE_SEL);
		let oldPosEle   = document.querySelector(OLD_POS_SEL);
		let newPosEle   = document.querySelector(NEW_POS_SEL);

		sendMoveBtn.addEventListener("click", () =>
		{
			let oldPos = JSON.parse(oldPosEle.value);
			let newPos = JSON.parse(newPosEle.value);

			Network.movePiece(oldPos, newPos, ""); // TODO: FIX THE SPOOFED SESSION_ID
		});

		// Register handler for receiving a move
		Network.registerResponseHandler(MessageType.movePiece, (response) =>
		{
			console.log("MOVE RECEIVED:", response);
			let { board } = JSON.parse(response).board;
			console.log(board[2][1]);
		});
	}

	// Updates the UI based on the state of the game.
	update()
	{
		// TODO: update the game UI based on the current game state 
	}
}

window.TEST = () =>
{
	Network.movePiece([0,1], [2,0], "");
}

export default GameView;