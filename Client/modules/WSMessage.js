"use strict";

const MessageType = Object.freeze(
{ gameFound: 0
, quitGame: 1
, movePiece: 2
, joinQueue: 3
, leaveQueue: 4
, setUsername: 5
, opponentDisconnected: 6
});

function opcodeIsValid(opcode)
{
	for(let type in MessageType)
	{
		let code = MessageType[type];
		if( opcode === code )
		{
			return true;
		}
	}
	return false;
}


class WSMessage
{
	constructor(opcode, args)
	{
		// Assert that the opcode given is valid
		if( !opcodeIsValid(opcode) )
		{
			throw new Error(`Invalid opcode: ${opcode}`);
		}

		// Construct the messasge
		this.code = opcode;

		// Bind the properties of the args array to this instance
		if( !(args instanceof Array) )
		{
			throw new Error(`Expected type "Array", got "${typeof args}"`);
		}
		for(let prop in args)
		{
			this[prop] = args[prop];
		}
	}


	static parseMessage(msg)
	{
		let { code, ...args } = msg;

		try
		{
			let message = new WSMessage(code, args);
			return message;
		}
		catch(e)
		{
			throw new Error(`Error parsing message: ${e}`);
		}
	}
}