/***********************************************************************************************************************
*   MAIN VALIDATION FUNCTION                                                                                           *
***********************************************************************************************************************/

/*
# Function for checking if any type of move is valid
#
# move : {old_pos: {row: int, col: int},
#         new_pos: {row : int, col: int}}
#
# board : see Board class
#
# Returns true or false
#
*/

const MUST_TAKE_JUMP_MESSAGE = "You have a jump available, you must make a jump.";
const INVALID_MOVE_MESSAGE   = "That move is invalid.";
const INVALID_JUMP_MESSAGE   = "That jump is invalid.";

// TODO: maybe change this??
class Validator
{
	static moveIsValid(move, board)
	{
		return validate(move, board);
	}
}
export default Validator;

function validate(move, board) {
	var new_pos = move["new_pos"];
	var old_pos = move["old_pos"];
	var player = get_piece_at(old_pos, board).owner;

	// Get all pieces that can jump
	var piece_jump_list = pieces_with_jumps(board, player);

	// If there are pieces that can jump, find out if move given is one of the jumps possible
	if (piece_jump_list.length !== 0) {
		// Iterate through pieces that can jump
		for (var i = 0; i < piece_jump_list.length; i++) {
			var jump_list = piece_jump_list[i].jumps;

			// compare jump coordinate to possible jump coordinates
			for (var k = 0; k < jump_list.length; k++) {
				if (is_coord_equal(new_pos, jump_list[k])) {
					return { valid: true, reason: null };
				}
			}
		}

		return { valid: false, reason: MUST_TAKE_JUMP_MESSAGE };

	} else {
		if (is_move(move)) {
			let valid = is_valid_move(move, board);
			return { valid: valid, reason: INVALID_MOVE_MESSAGE };
		} else {
			let valid = is_valid_jump(move, board);
			return { valid: valid, reason: INVALID_JUMP_MESSAGE };
		}
	}
}

/***********************************************************************************************************************
 *   END OF VALIDATION FUNCTION                                                                                        *
 ***********************************************************************************************************************/


/*
# Function for checking valid jumps (King or regular)
#
# move : {old_pos: {row: int, col: int},
#         new_pos: {row : int, col: int}}
#
# board : see Board class
#
# Returns true or false
#
*/
function is_valid_jump(move, board) {
	var old_pos = move["old_pos"];

	var piece = get_piece_at(old_pos, board);

	if (piece.piece_type === "REGULAR") {
		return is_valid_regular_jump(move, board);
	} else if (piece.piece_type === "KING") {
		return is_valid_king_jump(move, board);
	} else {
		return false;
	}
}

/* Function for checking valid moves
#
# move : {old_pos: {row: int, col: int},
#         new_pos: {row : int, col: int}}
#
# match_board : see Board class
#
# Returns true or false
#
*/
function is_valid_move(move, board) {
	var old_pos = move["old_pos"];

	var piece = get_piece_at(old_pos, board);

	if (piece.piece_type === "REGULAR") {
		return is_valid_regular_move(move, board);
	} else if (piece.piece_type === "KING") {
		return is_valid_king_move(move, board);
	} else {
		return false;
	}
}

/*
# Function for getting list of valid jumps for king or regular piece
#
# coordinates of jumping piece: {row: int, col: int}
#
#
# board : see Board class
#
# Returns list of jumps available
#
*/
function has_jumps(coordinates, board) {
	var row = coordinates["row"];
	var col = coordinates["col"];

	// Possible jump positions
	var j_pos = [{"row": row + 2, "col": col - 2},
		{"row": row + 2, "col": col + 2},
		{"row": row - 2, "col": col + 2},
		{"row": row - 2, "col": col - 2}];

	var valid_jumps = [];

	for (var i = 0; i < j_pos.length; i++) {
		var move = {"old_pos": coordinates, "new_pos": j_pos[i]};

		if (is_valid_jump(move, board)) {
			valid_jumps.push(j_pos[i]);
		}

	}

	return valid_jumps;
}

/*
    Returns a list of dictionaries with pieces that can jump and where they can jump
    List format: [{"piece": <piece dict>, "jumps:": [<list of jump coordinates available>]}, ....]
*/
function pieces_with_jumps(board, player) {
	var pieces_w_jumps = [];
	for (var i = 0; i < board.length; i++) {
		for (var k = 0; k < board[i].length; k++) {
			if (board[i][k] === null) {
				continue;
			}

			var piece = board[i][k];

			var piece_owner = piece.owner;

			if (piece_owner !== player) {
				continue;
			}

			var piece_jumps = has_jumps(piece.coordinates, board);

			if (piece_jumps.length !== 0) {
				pieces_w_jumps.push({"piece": piece, "jumps": piece_jumps});
			}
		}
	}

	return pieces_w_jumps;
}

// Function for checking if two coordinates are equal
function is_coord_equal(coord1, coord2) {
	if (coord1["row"] === coord2["row"] && coord1["col"] === coord2["col"]) {
		return true;
	} else {
		return false;
	}
}



// Function for checking if given coordinates are out of bounds
function is_out_of_bounds(coordinates) {
	if  (coordinates["row"] < 0 || coordinates["row"] > 7) {
		return true;
	} else if (coordinates["col"] < 0 || coordinates["col"] > 7) {
		return true;
	} else {
		return false;
	}
}

function get_piece_at(coords, board) {
	var row = coords["row"];
	var col = coords["col"];

	return board[row][col];
}

function flip_board(board) {
	var new_board = JSON.parse(JSON.stringify(board));

	for (var i = 0; i < new_board.length; i++) {
		new_board[i].reverse();
	}

	new_board.reverse();

	return new_board;
}

function invert_coords(coordinates) {
	coordinates["row"] = 7 - coordinates["row"];
	coordinates["col"] = 7 - coordinates["col"];

	return coordinates;
}

/* Function for checking valid moves for regular pieces
#
# move : {old_pos: {row: int, col: int},
#         new_pos: {row : int, col: int}}
#
# match_board : see Board class
#
# Returns true or false
#
*/
function is_valid_regular_move(move, match_board) {
	var move_dict = JSON.parse(JSON.stringify(move));
	var board = JSON.parse(JSON.stringify(match_board));
	var old_pos = move_dict["old_pos"];
	var new_pos = move_dict["new_pos"];
	var checker_piece = get_piece_at(old_pos, board);

	var piece_owner = checker_piece.owner;

	// Check that new position is not out of bounds
	if (is_out_of_bounds(new_pos)) {
		return false;
	}

	// Check that new position is not occupied
	if (get_piece_at(new_pos, board) !== null) {
		return false;
	}


	// Flip the board if player 2 is making the move
	if (piece_owner === 2) {
		// flip board
		flip_board(board);

		// Flip the move coordinates
		old_pos = invert_coords(old_pos);
		new_pos = invert_coords(new_pos);
	}


	// Check that piece has been moved forward one space
	if (old_pos["row"] === (new_pos["row"] + 1)) {
		// Check that piece has moved diagonally left or right one space
		if (old_pos ["col"] === (new_pos["col"] + 1)) {
			return true;
		} else if (old_pos ["col"] === (new_pos["col"] - 1)) {
			return true;
		} else {
			return false;
		}
	} else {
		return false;
	}

}

// Function for checking if a move is a move rather than a jump
function is_move(move) {
	var old_pos = move["old_pos"];
	var new_pos = move["new_pos"];

	let rowDiff = Math.abs(old_pos["row"] - new_pos["row"]);
	let colDiff = Math.abs(old_pos["col"] - new_pos["col"]);
	let diffSum = rowDiff + colDiff;

	if( diffSum <= 2)
	{
		return true;
	}

	return false;
}




/* Function for checking valid moves for king pieces
#
# move : {old_pos: {row: int, col: int},
#         new_pos: {row : int, col: int}}
#
# match_board : see Board class
#
# Returns true or false
#
*/
function is_valid_king_move(move, match_board) {
	var old_pos = move["old_pos"];
	var new_pos = move["new_pos"];


	// Check that new position is not out of bounds
	if (is_out_of_bounds(new_pos)) {
		return false;
	}

	// Check that new position is not occupied
	if (get_piece_at(new_pos, match_board) !== null) {
		return false;
	}


	// Check that piece has been moved forward or backward one space
	if ((old_pos["row"] === (new_pos["row"] + 1)) || (old_pos["row"] === (new_pos["row"] - 1))) {
		// Check that piece has moved diagonally left or right one space
		if (old_pos["col"] === (new_pos["col"] + 1)) {
			return true;
		} else if (old_pos["col"] === (new_pos["col"] - 1)){
			return true;
		} else {
			return false;
		}

	} else {
		return false;
	}

}


/*
# Function for checking valid jumps for regular pieces
#
# move : {old_pos: {row: int, col: int},
#         new_pos: {row : int, col: int}}
#
# match_board : see Board class
#
# Returns true or false
#
 */
function is_valid_regular_jump(move, match_board) {
	var move_dict = JSON.parse(JSON.stringify(move));
	var board = JSON.parse(JSON.stringify(match_board));

	var old_pos = move_dict["old_pos"];
	var new_pos = move_dict["new_pos"];
	var checker_piece = get_piece_at(old_pos, board);

	var piece_owner = checker_piece.owner;

	// Check that new position is not out of bounds
	if (is_out_of_bounds(new_pos)) {
		return false;
	}

	// Check that new position is not occupied
	if (get_piece_at(new_pos, board) !== null) {
		return false;
	}

	// Flip the board if player 2 is making the move
	if (piece_owner === 2) {
		// flip board
		board = flip_board(board);

		// Flip the move coordinates
		old_pos = invert_coords(old_pos);
		new_pos = invert_coords(new_pos);
	}




	// Check that piece has been moved forward 2 spaces
	if (old_pos["row"] === (new_pos["row"] + 2)) {
		// Check that piece has moved diagonally left or right 2 spaces
		if (old_pos["col"] === (new_pos["col"] + 2)) {
			return jumps_opponent_piece(move_dict, board, piece_owner);
		} else if (old_pos["col"] === (new_pos["col"] - 2)) {
			return jumps_opponent_piece(move_dict, board, piece_owner);
		} else {
			return false;
		}
	} else {
		return false;
	}
}



/*
# Function for checking valid jumps for king pieces
#
# move : {old_pos: {row: int, col: int},
    #         new_pos: {row : int, col: int}}
#
# match_board : see Board class
#
# Returns true or false
#
*/
function is_valid_king_jump(move, match_board) {
	var move_dict = JSON.parse(JSON.stringify(move));
	var old_pos = move_dict["old_pos"];
	var new_pos = move_dict["new_pos"];

	var checker_piece = get_piece_at(old_pos, match_board);
	var owner = checker_piece.owner;

	// Check that new position is not out of bounds
	if (is_out_of_bounds(new_pos)) {
		return false;
	}


	// Check that new position is not occupied
	if (get_piece_at(new_pos, match_board) !== null) {
		return false;
	}

	// Check that piece has been moved forward or backward two spaces
	if ((old_pos["row"] === (new_pos["row"] + 2)) || (old_pos["row"] === (new_pos["row"] - 2))) {
		// Check that piece has moved diagonally left or right two spaces
		if (old_pos["col"] === (new_pos["col"] + 2)) {
			return jumps_opponent_piece(move_dict, match_board, owner);
		} else if (old_pos["col"] === (new_pos["col"] - 2)) {
			return jumps_opponent_piece(move_dict, match_board, owner);
		} else {
			return false;
		}
	} else {
		return false;
	}
}




/*
# returns true or false depending if move jumps over opponent piece
# Takes player as int, board object and move dict
*/
function jumps_opponent_piece(move, board, player) {
	var move_dict = JSON.parse(JSON.stringify(move));
	var old_pos = move_dict["old_pos"];
	var new_pos = move_dict["new_pos"];

	// Get piece between old point and new point using midpoint formula
	var row = Math.floor((old_pos["row"] + new_pos["row"]) / 2 );
	var col = Math.floor((old_pos["col"] + new_pos["col"]) / 2);
	var pos = {"row": row, "col": col};

	var piece_jumped = get_piece_at(pos, board);

	// Jump was not over a piece
	if (piece_jumped === null) {
		return false;
	}


	// Jump was over opponent piece
	if (piece_jumped.owner !== player) {
		return true;
	} else {
		return false;
	}

}
