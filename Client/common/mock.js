"use strict";

/*
 * The purpose of this file is to provide "mock" functions for various
 * parts of the client-side implementation in order to ease testing.
 * Certain network communications or otherwise expensive operations should
 * be mocked to allow for reliable and isolated tests of the client-side
 * components.
 */


(function(mock, window, undefined)
{
	// === SET UP FUNCTION GROUPS =============================================
	mock.serverComm =
	{ sendUsername: (username) => sendUsername(username)
	};
	mock.serverCommFail =
	{ sendUsername: (username) => sendUsername(username, true)
	};

	mock.utils = 
	{ wait: wait
	};
	// ========================================================================

	
	// === CONSTANTS ==========================================================
	const LOW_LATENCY_MS  = 20;
	const AVG_LATENCY_MS  = 100;
	const HIGH_LATENCY_MS = 350;
	// ========================================================================


	// === FUNCTION DEFINITIONS ===============================================
	function wait(ms)
	{
		return new Promise((resolve, reject) =>
		{
			setTimeout(resolve, ms);
		});
	}


	function sendUsername(username, shouldFail)
	{
		// Fake "success" response
		const cannedResponse =
		{ code: 1
		, data: { username: username }
		, error: null
		};

		return new Promise((resolve, reject) =>
		{
			// Fake some latency, then return the canned response
			wait(LOW_LATENCY_MS).then(() =>
			{
				// For testing reasons, we may want this call to fail
				if( shouldFail )
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
	// ========================================================================
}
( typeof mock === "undefined" ? window.mock = {} : mock
, window
))