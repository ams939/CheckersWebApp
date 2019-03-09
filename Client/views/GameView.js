"use strict";

import html        from "../modules/html.js";
import Utils       from "../modules/Utils.js";
import Navbar      from "./Navbar.js";
import Router      from "../modules/Router.js";
import Network     from "../modules/Network.js";
import Validator   from "../modules/Validator.js";
import WSMessage   from "../modules/WSMessage.js";
import GameSession from "../modules/GameSession.js";
const { MessageType } = WSMessage;

// === CONSTS =================================================================
const GAME_BOARD_CONTAINER_SEL = "#game-board-container";
const TURN_COUNTER_SEL         = "#turn-counter";
const TURN_INDICATOR_SEL       = "#turn-indicator";

const PIECE_COLORS = Object.freeze({ 1: "red", 2: "white" });
const TILE_COLORS  = Object.freeze({ 0: "black", 1: "white" });

const KING_UNICODE_SYMBOL = "&#9812;";

const NOT_YOUR_TURN_MESSAGE = "You cannot make moves during the other player's turn.";

const YOU_WIN_MESSAGE  = "You won!";
const YOU_LOSE_MESSAGE = "You lost.  Better luck next time!";
const DRAW_MESSAGE     = "The game ended in a draw.";

var lastState = null;
// ============================================================================

class GameView
{
	constructor()
	{
		// Subviews
		this.navbar = new Navbar();
	}

	render()
	{
		return(html`

			${this.navbar.render()}

			<div class="container withnav flex-center">

				<div id="turn-info-area" class="card">
					<div class="card-content flex-center vert">
						<div class="spacer m8">
							<span>
								Turn Count: <span id="turn-counter">${GameSession.getTurnCount()}</span>
							</span>
						</div>
						<div class="spacer m8">
							<span>
								It's <span id="turn-indicator">${GameSession.getCurrentTurnPlayerName()}</span>'s turn.
							</span>
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

		// Save reference to session's username
		this.clientUsername = sessionStorage.getItem("username");

		// Redirect away from game view if there is no valid session
		if( !GameSession.sessionExists() )
		{
			router.routeTo(Router.Routes.matchmaking);
		}

		// Set up subviews
		this.navbar.setup();

		// Render the game board
		this.update();

		// Register handler for receiving a move
		Network.registerResponseHandler(MessageType.movePiece, (response) =>
		{
			try
			{
				// Update the game state
				GameSession.update(response);

				// Check for endgame situation
				let endgame = GameSession.endgame();
				if( endgame )
				{
					if( endgame.draw )
					{
						showEndgameMessage(DRAW_MESSAGE);
						return;
					}
					else if( GameSession.getPlayerNameFromNumber(endgame.winner) === this.clientUsername )
					{
						showEndgameMessage(YOU_WIN_MESSAGE);
						return;
					}
					else
					{
						showEndgameMessage(YOU_LOSE_MESSAGE);
					}

				}

				// If the turn has changed and it is the client's turn, toast them
				if( GameSession.getCurrentTurnPlayerName() === this.clientUsername )
				{
					toast("It's your turn!", "good");
				}

				// Update the UI based on the new state
				this.update();
			}
			catch(e)
			{
				// If the validation failed, we're brought here
				// TODO: show a message to the client about failed validation
				throw e;
			}
		});

		// Register a disconnect handler to say that the user won
		Network.registerResponseHandler(MessageType.opponentDisconnected, (response) =>
		{
			// Show the endgame screen
			let endgameMessage = "You won! (Your opponent disconnected.)";
			showEndgameMessage(endgameMessage);
		});
	}

	// Updates the UI based on the current state of the game.
	update()
	{
		// Get the game state
		let gameState = GameSession.getState();

		// Reset the board state
		let gameBoardContainerEle       = document.querySelector(GAME_BOARD_CONTAINER_SEL);
		gameBoardContainerEle.innerHTML = "";
		this.setupBoard(gameState.board, gameBoardContainerEle);

		// Update the rest of the game UI based on the current game state 
		let turnCounterEle   = document.querySelector(TURN_COUNTER_SEL);
		let turnIndicatorEle = document.querySelector(TURN_INDICATOR_SEL);
		turnCounterEle.innerText   = GameSession.getTurnCount();
		turnIndicatorEle.innerText = GameSession.getCurrentTurnPlayerName();
	}

	// Creates elements and binds event handlers for the game board.
	setupBoard(board, containerEle)
	{
		// Determine whether or not to invert the board
		let invertBoard = GameSession.getPlayerNumberFromName(this.clientUsername) === 2;

		// Compute the client's player number
		let playerNumber = GameSession.getPlayerNumberFromName(this.clientUsername);

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
					let pieceEle = createPieceElement(row[j], playerNumber);

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
					let pieceEle = createPieceElement(row[j], playerNumber);

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

function createPieceElement(piece, clientPlayerNumber)
{
	if( piece === null )
	{
		return null;
	}

	// Construct piece element
	let color    = getPieceColor(piece.owner);
	let pieceEle = Utils.newDiv(["board-piece", color])

	// Conditional to check if the piece is a king
	if( piece.piece_type === "KING" )
	{
		pieceEle.innerHTML = KING_UNICODE_SYMBOL;
	}

	if( piece.owner === clientPlayerNumber )
	{
		pieceEle.setAttribute("draggable", true);
		pieceEle.addEventListener("dragstart", (event) =>
		{
			let pieceJSON = JSON.stringify(piece);
			event.dataTransfer.setData("text/json", pieceJSON);
		});
	}

	return pieceEle;
}

function createTileElement(coordinate, color)
{
	// Construct tile element
	let tileEle = Utils.newDiv(["board-tile", color]);

	// Register event listeners
	tileEle.addEventListener("dragover", (event) => event.preventDefault());
	tileEle.addEventListener("drop", (event) =>
	{
		event.preventDefault();

		// Get the piece from the event data
		let piece = JSON.parse(event.dataTransfer.getData("text/json"));

		// Create a "move" object from the event data and the current coordinate
		let move =
		{ old_pos: piece.coordinates
		, new_pos: coordinate
		};

		// Grab a reference to the game state
		let gameState = GameSession.getState();

		// Do a bit of pre-validation: make sure it's the player's turn before we even validate their move!
		if( GameSession.getState().currentTurn !== piece.owner )
		{
			toast(NOT_YOUR_TURN_MESSAGE, "error");
			return;
		}

		// Route the move through the validation script
		let { valid, reason } = Validator.moveIsValid(move, gameState.board);

		// If validation succeeds, send the move to the 
		if( valid )
		{
			console.log(`Making move [${move.old_pos.row},${move.old_pos.col}] --> [${move.new_pos.row},${move.new_pos.col}]`);
			Network.movePiece(move.old_pos, move.new_pos, gameState.sessionId);
		}
		else
		{
			toast(reason, "error");
		}

	});

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

function showEndgameMessage(endgameMessage)
{
	// TODO: Do a more solid screen, something like a modal that
	//       disables user interaction.
	toast(endgameMessage);
	setTimeout(() => window.location.reload(), 3000);
}

export default GameView;
