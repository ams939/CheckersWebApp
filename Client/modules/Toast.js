"use strict";

import Utils from "../modules/Utils.js";

// === CONSTANTS ==============================================================
const toastQueue   = [];
var currentToast   = null;

const TOAST_ALIVE_TIME_MS = 3000;

const TOAST_QUEUE_SEL = "#toast-queue";
// ============================================================================


// === FUNCTIONS ==============================================================
function enqueue(toastObj)
{
	// Enqueue the toast object
	toastQueue.push(toastObj);

	// If we aren't currently showing a toast, try to pop one
	if( !currentToast )
	{
		tryPopToast();
	}
}


function tryPopToast()
{
	// Pop the head of the queue and display it
	if( !currentToast && toastQueue.length > 0 )
	{
		let toast = toastQueue.shift();
		displayToast(toast);
	}
}


function displayToast(toastObj)
{
	currentToast = toastObj;
	let toastEle = createToastElement(toastObj);

	let toastQueueContainer = document.querySelector(TOAST_QUEUE_SEL);
	toastQueueContainer.appendChild(toastEle);

	setTimeout(() =>
	{
		// TODO: implement animation

		// After the timeout, hide the toast and remove it from the document
		toastEle.remove();

		// Reset the current toast
		currentToast = null;

		// Attempt to pop another toast if it exists
		tryPopToast();

	}, TOAST_ALIVE_TIME_MS);
}


function createToastElement(toastObj)
{
	let classes  = ["toast", "card"];

	if( toastObj.cssClass )
	{
		classes.push(toastObj.cssClass);
	}

	let toastEle   = Utils.newDiv(classes);
	let messageEle = document.createElement("span");

	messageEle.innerText = toastObj.message;
	toastEle.appendChild(messageEle);

	return toastEle;
}
// ============================================================================


class Toast
{
	static create(message, cssClass, keepAliveMs=TOAST_ALIVE_TIME_MS)
	{
		// Create a toast object
		let toast = { message: message
			, cssClass: cssClass
			, keepAliveMs: keepAliveMs };

		// Add this toast to the toast queue IFF the top of the queue
		// or the currentToast are not equal
		if( !Toast.equals(toast, Toast.peekLast()) )
		{
			enqueue(toast);
		}
		
		// Otherwise, ignore the toast because it is a duplicate
	}

	static peek()
	{
		return Object.assign({}, toastQueue[0]);
	}

	static peekLast()
	{
		return Object.assign({}, toastQueue[toastQueue.length - 1]);
	}

	static equals(a, b)
	{
		if( a === null || b === null ) return false;

		return a.message === b.message
			&& a.cssClass === b.cssClass;
	}
}

export default Toast;