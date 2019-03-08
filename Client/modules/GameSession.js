"use strict";

// This is some kind of pseudo-singleton stuff.  Probably done poorly, but what
// more do you expect from JavaScript "classes"?

// === STATIC STATE ===========================================================
const state =
{ playerOne: null
, playerTwo: null
, sessionId: null
, board: null
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
	// TODO: make bug report, I don't think this is intentional
	let board = gameState.board.board;
	gameState.board = board;

	// Return the gameState
	return gameState;
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
		GameSession.update(gameMessage); // fills in initial state details
	}

	static update(gameMessage)
	{
		let gameState = parseGameMessage(gameMessage);

		state.playerOne = gameState.player_one;
		state.playerTwo = gameState.player_two;
		state.sessionId = gameState.session_id;
		state.board     = gameState.board;
	}

	static destroy()
	{
		// Reset state
		state.playerOne   = null;
		state.playerTwo   = null;
		state.sessionId   = null;
		state.board       = null;
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
}

export default GameSession