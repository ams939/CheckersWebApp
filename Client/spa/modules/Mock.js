"use strict";

import Utils from "./Utils.js";

// === CONSTANTS ==========================================================
const LOW_LATENCY_MS  = 20;
const AVG_LATENCY_MS  = 100;
const HIGH_LATENCY_MS = 350;
// ========================================================================

class MockServerComm
{
	constructor(shouldFail=false)
	{
		this.shouldFail = shouldFail;
	}

	sendUsername(username)
	{
		// Fake "success" response
		const cannedResponse =
		{ code: 1
		, data: { username: username }
		, error: null
		};

		return new Promise((resolve) =>
		{
			// Fake some latency, then return the canned response
			Utils.wait(LOW_LATENCY_MS).then(() =>
			{
				// For testing reasons, we may want this call to fail
				if( this.shouldFail )
				{
					cannedResponse.error = 
					{ message: "The username \"" + username + "\" is already registered, please choose another."
					};

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
{ ServerComm: MockServerComm // This is a class! Be aware that you have to instantiate to use.
};

export default Mock;
// ============================================================================