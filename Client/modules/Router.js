"use strict";
/* eslint-disable no-console */

// Import view modules
import Login       from "../views/Login.js";
import Matchmaking from "../views/Matchmaking.js";
import GameView    from "../views/GameView.js";
import NotFound    from "../views/NotFound.js";


// Default selector for the render target
const DEFAULT_RENDER_TARGET_SEL = "#render-content";

// Provides names for the routes
const Routes = Object.freeze({ login: "#/login"
	, matchmaking: "#/matchmaking"
	, game: "#/game"
	, notFound: "#/404" });

// Map routes to view modules 
const RouteTable = Object.freeze({ "#/login": new Login()
	, "#/matchmaking": new Matchmaking()
	, "#/game": new GameView()
	, "#/404": new NotFound() });


class Router
{
	constructor(renderTarget=null, defaultPage=NotFound)
	{
		if( renderTarget === null )
		{
			renderTarget = document.querySelector(DEFAULT_RENDER_TARGET_SEL);
		}

		this.renderTarget = renderTarget;
		this.defaultPage  = defaultPage;
	}

	getView(destination)
	{
		if( destination in RouteTable )
		{
			return RouteTable[destination];
		}
		else
		{
			// If the destination is invalid, reroute to the "notFound" route.
			this.routeTo(Routes.notFound);
			return null;
		}

	}

	routeTo(route)
	{
		console.log("Routing to: " + route);
		window.location.hash = route;
	}

	renderRoute(route)
	{
		console.log("Rendering: ", route);

		// Get view content
		let page = this.getView(route);
		if( page )
		{
			let content = page.render();

			// Insert view content into render target
			this.renderTarget.innerHTML = content;

			// Complete any post-render setup
			page.setup();
		}
	}
}
Router.Routes = Routes;

export default Router;