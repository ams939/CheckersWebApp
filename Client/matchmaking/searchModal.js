"use strict";

(function(searchModal, window, serverComm, undefined)
{
	// === CONSTANTS ==========================================================
	// Helper funcs
	const andThrow = (err) => { throw new Error(err); };

	// Element selectors
	const MODAL_CONTAINER_SEL   = "#modal-container";

	const SEARCHING_CONTENT_SEL = "#match-search-modal-searching";
	const FOUND_CONTENT_SEL     = "#match-search-modal-found";
	const CANCELLED_CONTENT_SEL = "#match-search-modal-cancelled";

	const CANCEL_BUTTON_SEL     = "#cancel-search-btn";
	const ACCEPT_BUTTON_SEL     = "#accept-match-btn";
	const REJECT_BUTTON_SEL     = "#reject-match-btn";
	const OKAY_BUTTON_SEL       = "#cancelled-okay-btn";

	// Modal States
	const ModalState = Object.freeze(
	{ hidden: 0
	, searching: 1
	, found: 2
	, cancelled: 3
	})
	var currentState      = ModalState.hidden;
	var stateEles         = null;
	var modalContainerEle = null;

	// Assorted
	const HIDDEN_CLASS_NAME   = "hidden";
	const INVALID_STATE_ERROR = (state) => "Attempted to use invalid state: \"" + state + "\"";
	const traceIfLocal        = () => { if( window.origin.indexOf("localhost") >= 0 ) console.trace(); };
	// ========================================================================


	// === ONLOAD =============================================================
	// Register any element event listeners on load
	window.addEventListener("load", () =>
	{
		// First thing should be to get references to the state elements
		getStateElements();
	});
	// ========================================================================


	// === UI/ELEMENT FUNCTIONS ===============================================
	// Returns a dictionary that contains the various elements representing the
	// ModalState enum values (i.e. modal states).
	function getStateElements()
	{
		// Memoization 
		if( stateEles !== null )
		{
			return stateEles;
		}
		
		stateEles = {};

		stateEles[ModalState.hidden]    = document.querySelector(MODAL_CONTAINER_SEL);
		stateEles[ModalState.searching] = document.querySelector(SEARCHING_CONTENT_SEL);
		stateEles[ModalState.found]     = document.querySelector(FOUND_CONTENT_SEL);
		stateEles[ModalState.cancelled] = document.querySelector(CANCELLED_CONTENT_SEL);

		return stateEles;
	}

	function hideState(state)
	{
		assertStateIsValid(state);

		// SPECIAL CASE:
		// When we "hide" the hidden state, we actually are going to show it.
		// This is a direct reversal of what we do for all other states.
		if( state === ModalState.hidden )
		{
			getStateElements()[state].classList.remove(HIDDEN_CLASS_NAME);
			return;
		}

		getStateElements()[state].classList.add(HIDDEN_CLASS_NAME);
	}

	function unhideState(state)
	{
		// SPECIAL CASE:
		// When we "unhide" the hidden state, we actually are going to hide it.
		// This is a direct reversal of what we do for all other states.
		if( state === ModalState.hidden )
		{
			getStateElements()[state].classList.add(HIDDEN_CLASS_NAME);
			return;
		}

		getStateElements()[state].classList.remove(HIDDEN_CLASS_NAME);
	}
	// ========================================================================


	// === STATE FUNCTIONS ====================================================
	function transitionStateElement(destinationState)
	{
		assertStateIsValid(destinationState);

		// Hide all non-destination states
		for(let state in ModalState)
		{
			let stateVal = ModalState[state];
			if( stateVal !== destinationState )
			{
				hideState(stateVal);
			}
		}

		// Show destination state element
		unhideState(destinationState);
	}

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
			traceIfLocal();
			throw new Error(INVALID_STATE_ERROR(state));
		}
	}

	// Sets the modal state and transitions the UI elements accordingly.
	function setState(state)
	{
		console.log(currentState, state);
		assertStateIsValid(state);

		// If an actual change occurred ...
		if( state !== currentState )
		{
			// ... set the current state and do the UI transition.
			currentState = state;
			transitionStateElement(currentState);
		}
	}
	// ========================================================================


	// === EXPORTS ============================================================
	searchModal.ModalState = ModalState;

	searchModal.getCurrentState = () => currentState;
	searchModal.setState        = setState;
	// ========================================================================

}
( typeof window.searchModal === "undefined" ? window.searchModal = {} : window.searchModal
, window
, typeof serverComm === "undefined" ? mock : serverComm
))
