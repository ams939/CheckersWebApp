"use strict";

import Utils     from "./Utils.js";
import WSMessage from "./WSMessage.js";
const { MessageType } = WSMessage;

// === CONSTANTS ==========================================================
const LOW_LATENCY_MS  = 50;
const AVG_LATENCY_MS  = 200; // eslint-disable-line no-unused-vars
const HIGH_LATENCY_MS = 800; // eslint-disable-line no-unused-vars
// ========================================================================

class MockNetwork
{
	constructor(shouldFail=false)
	{
		this.shouldFail = shouldFail;
	}

	setUsername(username) // eslint-disable-line no-unused-vars
	{
		// Fake "success" response
		const cannedResponse = { code: MessageType.setUsername, success: true };

		return new Promise((resolve) =>
		{
			// Fake some latency, then return the canned response
			Utils.wait(LOW_LATENCY_MS).then(() =>
			{
				// For testing reasons, we may want this call to fail
				if( this.shouldFail )
				{
					cannedResponse.success = false;

					resolve(cannedResponse);
					return;
				}

				// If the above is not the case, just resolve with the original response
				resolve(cannedResponse);
				return;
			});
		});
	}
}


// === EXPORTS ================================================================
let Mock = 
{ Network: MockNetwork // This is a class! Be aware that you have to instantiate to use.
};

export default Mock;
// ============================================================================