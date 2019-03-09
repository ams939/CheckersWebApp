"use strict";

// This is some kind of pseudo-singleton stuff.  Probably done poorly, but what
// more do you expect from JavaScript "classes"?

// === STATIC STATE ===========================================================
const state =
{ playerOne: null
, playerTwo: null
, sessionId: null
, board: null
, gameOver: null
, winner: null
, draw: null
, currentTurn: 1
, turnCount: 1
};
// ============================================================================


// === HELPER FUNCTIONS =======================================================
function parseGameMessage(gameMessage)
{
	// Extract gameState from the message
	let { code, ...gameState } = gameMessage;

	// Fix the "double nesting" of the board array
	// FIXME: make bug report, I don't think this is intentional
	let board = gameState.board.board;
	gameState.board = board;

	// Return the gameState
	return gameState;
}

function parseMoveMessage(moveMessage)
{
	let { code, ...moveState } = moveMessage;

	// FIXME: make bug report, I don't think this is intentional
	let board = moveState.board.board;
	moveState.board = board;

	// Return the moveState
	return moveState;
}

function getCurrentTurnPlayerName()
{
	switch(state.currentTurn)
	{
		case 1:  return state.playerOne;
		case 2:  return state.playerTwo;
		default: return null;
	}
}
// ============================================================================

class GameSession
{
	static create(gameMessage)
	{
		GameSession.destroy();           // wipes the state so a new game can be created

		// Create an initial game state from the "joinGame" message
		let gameState = parseGameMessage(gameMessage);

		state.playerOne = gameState.player_one;
		state.playerTwo = gameState.player_two;
		state.sessionId = gameState.session_id;
		state.board     = gameState.board;

	}

	static update(moveMessage)
	{
		let moveState = parseMoveMessage(moveMessage);
		if( moveState.valid )
		{
			// validation sessionId has not changed
			if( moveState.session_id !== state.sessionId )
			{
				throw new Error(`SessionID mismatch! Old: ${state.sessionId}, New: ${moveState.session_id}`);
			}
			
			// Increment turn counter if the "current_turn" has changed
			if( state.currentTurn !== moveState.current_turn )
			{
				state.turnCount++;
			}

			// Update state
			state.currentTurn = moveState.current_turn;
			state.board       = moveState.board;
			state.gameOver    = moveState.game_over;
			state.winner      = moveState.winner;
			state.draw        = moveState.draw;
		}
		else
		{
			// TODO: notify the UI that the server's validation has failed
			toast(moveState.reason, "error");
		}
	}

	static destroy()
	{
		// Reset state
		state.playerOne   = null;
		state.playerTwo   = null;
		state.sessionId   = null;
		state.board       = null;
		state.gameOver    = null;
		state.winner      = null;
		state.draw        = null;
		state.currentTurn = 1;
		state.turnCount   = 1;
	}

	static getState()
	{
		if( GameSession.sessionExists() )
		{
			// Return a *copy* of the game state
			return Object.assign({}, state);
		}
		return null;
	}

	static sessionExists()
	{
		return !!state.sessionId;
	}

	static getCurrentTurnPlayerName()
	{
		switch(state.currentTurn)
		{
			case 1:  return state.playerOne;
			case 2:  return state.playerTwo;
			default: return null;
		}
	}

	static getTurnCount()
	{
		return state.turnCount;
	}

	static getPlayerNumberFromName(name)
	{
		return name === state.playerOne ? 1 : 2;
	}

	static getPlayerNameFromNumber(number)
	{
		switch(number)
		{
			case 1: return state.playerOne;
			case 2: return state.playerTwo;
			default: return null;
		}
	}

	static endgame()
	{
		// Returns endgame portions of the state if the game has ended
		if( state.gameOver )
		{
			return { winner: state.winner, draw: state.draw };
		}

		return false;
	}
}

export default GameSession
