"use strict";

import html        from "../modules/html.js";
import Utils       from "../modules/Utils.js";
import Navbar      from "./Navbar.js";
import Router      from "../modules/Router.js";
import Network     from "../modules/Network.js";
import WSMessage   from "../modules/WSMessage.js";
import GameSession from "../modules/GameSession.js";
const { MessageType } = WSMessage;

// === CONSTS =================================================================
const OLD_POS_SEL   = "#DB-old-pos-input";
const NEW_POS_SEL   = "#DB-new-pos-input";
const SEND_MOVE_SEL = "#DB-send-move-btn";

const GAME_BOARD_CONTAINER_SEL = "#game-board-container";

const PIECE_COLORS = Object.freeze({ 1: "red", 2: "white" });
const TILE_COLORS  = Object.freeze({ 0: "white", 1: "black" });
// ============================================================================

class GameView
{
	constructor()
	{
		// Subviews
		this.navbar = new Navbar();

		// Save reference to session's username
		this.clientUsername = sessionStorage.getItem("username");
	}

	render()
	{

		return(html`

			${this.navbar.render()}


			<div class="container withnav flex-center">

				<div id="turn-info-area" class="card">
					<div class="card-content flex-center vert">
						<div class="spacer m8">
							<span id="turn-counter">Turn Count: ${GameSession.getTurnCount()}</span>
						</div>
						<div class="spacer m8">
							<span id="turn-indicator">It's <strong>${GameSession.getCurrentTurnPlayerName()}</strong>'s turn.</span>
						</div>
					</div>
				</div>

				<div id="game-board-container">
				</div>

			</div>
		`);
	}

	setup()
	{
		let router = new Router();

		// Redirect away from game view if there is no valid session
		if( !GameSession.sessionExists() )
		{
			router.routeTo(Router.Routes.matchmaking);
		}

		// Set up subviews
		this.navbar.setup();

		// Render the game board
		let gameBoardContainerEle = document.querySelector(GAME_BOARD_CONTAINER_SEL);
		this.setupBoard(gameBoardContainerEle);

		// Register handler for receiving a move
		Network.registerResponseHandler(MessageType.movePiece, (response) =>
		{
			// TODO: implement this
		});
	}

	// Updates the UI based on the state of the game.
	update()
	{
		// TODO: update the game UI based on the current game state 
	}

	// Creates elements and binds event handlers for the game board.
	setupBoard(containerEle)
	{
		// Determine whether or not to invert the board
		let invertBoard = GameSession.getPlayerNumberFromName(this.clientUsername) === 2;

		// Grab ref to board from GameSession
		let { board } = GameSession.getState();

		// Set up render loop
		let boardEle = null;
		if( invertBoard )
		{

			// it may look weird but this is a pretty idiomatic reverse loop
			let rowEles = [];
			for(let i = board.length; --i >= 0; ) 
			{
				let tileEles = [];

				let row = board[i];
				for(let j = row.length; --j >= 0; )
				{
					let coord    = { row: i, col: j };
					let color    = getTileColor(coord);
					let tileEle  = createTileElement(coord, color);
					let pieceEle = createPieceElement(row[j]);

					// If the piece element exists, place it inside the tile element
					if( pieceEle !== null )
					{
						tileEle.appendChild(pieceEle);
					}

					// Add the tileEle to the list
					tileEles.push(tileEle);
				}

				// Create and append the row element to the list of rowEles
				let rowEle = createBoardRowElement(tileEles);
				rowEles.push(rowEle);
			}

			// Finally, create the board element from the list of rowEles
			boardEle = createBoardElement(rowEles);
		}
		else
		{
			let rowEles = []
			for(let i = 0; i < board.length; i++)
			{
				let tileEles = [];

				let row = board[i];
				for(let j = 0; j < row.length; j++)
				{
					let coord    = { row: i, col: j };
					let color    = getTileColor(coord);
					let tileEle  = createTileElement(coord, color);
					let pieceEle = createPieceElement(row[j]);

					// If the piece element exists, place it inside the tile element
					if( pieceEle !== null )
					{
						tileEle.appendChild(pieceEle);
					}

					// Add the tileEle to the list
					tileEles.push(tileEle)
				}

				// Create and append the row element to the list of rowEles
				let rowEle = createBoardRowElement(tileEles);
				rowEles.push(rowEle);
			}

			// Finally, create the board element from the list of rowEles
			boardEle = createBoardElement(rowEles)
		}

		containerEle.appendChild(boardEle);
	}
}

function createPieceElement(piece)
{
	if( piece === null )
	{
		return null;
	}

	// Construct piece element
	let color    = getPieceColor(piece.owner);
	let pieceEle = Utils.newDiv(["board-piece", color])

	// TODO: add conditional to check if the piece is a king

	// TODO: add event handlers to piece if the client owns it

	return pieceEle;
}

function createTileElement(coordinate, color)
{
	// Construct tile element
	let tileEle = Utils.newDiv(["board-tile", color]);

	// TODO: add event handlers to tile

	return tileEle;
}

function createBoardRowElement(tiles)
{
	let rowEle = Utils.newDiv(["board-row"]);
	for(let tile of tiles)
	{
		rowEle.appendChild(tile);
	}

	return rowEle;
}

function createBoardElement(rows)
{
	let boardEle = Utils.newDiv(["board"]);
	for(let row of rows)
	{
		boardEle.appendChild(row);
	}
	return boardEle;
}

function getTileColor(coordinate)
{
	let { row, col } = coordinate;
	return TILE_COLORS[(row + col % 2) % 2];
}

function getPieceColor(owningPlayerNumber)
{
	return PIECE_COLORS[owningPlayerNumber];
}

export default GameView;