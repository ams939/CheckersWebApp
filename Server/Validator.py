# Drexel University - CS451 Checkers Web Application
# Authors: Alex Sladek, Brian Stump, Eric Szabo, Philip Stephenson
# 2.21.2019
#
#
# CheckersBoard.py - Python module with classes to represent a checkers board
#
# Python v. 3.7.1
#
#
#
import copy as cp
import CheckersBoard as cb


########################################################################################################################
# MAIN MOVE VALIDATION INTERFACE FUNCTIONS BELOW                                                                       #
########################################################################################################################


# Function for checking valid moves (King or regular)
#
# move : {old_pos: {row: int, col: int},
#         new_pos: {row : int, col: int}}
#
# board : see Board class
#
# Returns true or false
#
def is_valid_move(move, board):
    old_pos = move["old_pos"]

    piece = board.get_piece_at(old_pos)

    if piece.get_type() == "REGULAR":
        return is_valid_regular_move(move, board)
    elif piece.get_type() == "KING":
        return is_valid_king_move(move, board)
    else:
        return False



# Function for checking valid jumps (King or regular)
#
# move : {old_pos: {row: int, col: int},
#         new_pos: {row : int, col: int}}
#
# board : see Board class
#
# Returns true or false
#
def is_valid_jump(move, board):
    old_pos = move["old_pos"]

    piece = board.get_piece_at(old_pos)

    if piece.get_type() == "REGULAR":
        return is_valid_regular_jump(move, board)
    elif piece.get_type() == "KING":
        return is_valid_king_jump(move, board)
    else:
        return False



# Function for getting list of valid jumps for king or regular piece
#
# coordinates of jumping piece: {row: int, col: int}
#
#
# board : see Board class
#
# Returns list of jumps available
#
def has_jumps(coordinates, board):
    row = coordinates["row"]
    col = coordinates["col"]

    # Possible jump positions
    j_pos = [{"row": row + 2, "col": col - 2},
             {"row": row + 2, "col": col + 2},
             {"row": row - 2, "col": col + 2},
             {"row": row - 2, "col": col - 2}]

    valid_jumps = []

    for pos in j_pos:
        move = {"old_pos": coordinates, "new_pos": pos}

        if is_valid_jump(move, board):
            valid_jumps.append(pos)

    return valid_jumps

########################################################################################################################
# END OF MAIN MOVE VALIDATION INTERFACE FUNCTIONS                                                                      #
########################################################################################################################




########################################################################################################################
# HELPER FUNCTIONS BELOW                                                                                               #
########################################################################################################################


# Function for inverting a given set of coordinates
# Coordinates given in form: {"row": int, "col": int}
#
# Returns dict of same form with inverted coordinates
#
def invert_coords(coordinates):
    coordinates["row"] = 7 - coordinates["row"]
    coordinates["col"] = 7 - coordinates["col"]
    return coordinates


# Function for checking if given coordinates are out of bounds
def is_out_of_bounds(coordinates):
    if  coordinates["row"] < 0 or coordinates["row"] > 7:
        return True
    elif coordinates["col"] < 0 or coordinates["col"] > 7:
        return True
    else:
        return False





# Function for checking valid moves for regular pieces
#
# move : {old_pos: {row: int, col: int},
#         new_pos: {row : int, col: int}}
#
# match_board : see Board class
#
# Returns true or false
#
def is_valid_regular_move(move, match_board):
    move_dict = cp.deepcopy(move)
    board = cp.deepcopy(match_board)
    old_pos = move_dict["old_pos"]
    new_pos = move_dict["new_pos"]
    checker_piece = board.get_piece_at(old_pos)

    piece_owner = checker_piece.owned_by()

    # Check that new position is not out of bounds
    if is_out_of_bounds(new_pos):
        return False



    # Check that new position is not occupied
    if board.get_piece_at(new_pos) is not None:
        return False

    # Flip the board if player 2 is making the move
    if piece_owner == 2:
        # flip board
        board.flip_board()

        # Flip the move coordinates
        old_pos = invert_coords(old_pos)
        new_pos = invert_coords(new_pos)


    # Check that piece has been moved forward one space
    if old_pos["row"] == (new_pos["row"] + 1):
        # Check that piece has moved diagonally left or right one space
        if old_pos ["col"] == (new_pos["col"] + 1):
            return True
        elif old_pos ["col"] == (new_pos["col"] - 1):
            return True
        else:
            return False
    else:
        return False



# Function for checking valid moves for king pieces
#
# move : {old_pos: {row: int, col: int},
#         new_pos: {row : int, col: int}}
#
# match_board : see Board class
#
# Returns true or false
#
def is_valid_king_move(move, match_board):
    old_pos = move["old_pos"]
    new_pos = move["new_pos"]


    # Check that new position is not out of bounds
    if is_out_of_bounds(new_pos):
        return False

    # Check that new position is not occupied
    if match_board.get_piece_at(new_pos) is not None:
        return False


    # Check that piece has been moved forward or backward one space
    if (old_pos["row"] == (new_pos["row"] + 1)) or (old_pos["row"] == (new_pos["row"] - 1)):
        # Check that piece has moved diagonally left or right one space
        if old_pos["col"] == (new_pos["col"] + 1):
            return True
        elif old_pos["col"] == (new_pos["col"] - 1):
            return True
        else:
            return False
    else:
        return False


# Function for checking valid jumps for regular pieces
#
# move : {old_pos: {row: int, col: int},
#         new_pos: {row : int, col: int}}
#
# match_board : see Board class
#
# Returns true or false
#
def is_valid_regular_jump(move, match_board):
    move_dict = cp.deepcopy(move)
    board = cp.deepcopy(match_board)

    old_pos = move_dict["old_pos"]
    new_pos = move_dict["new_pos"]
    checker_piece = board.get_piece_at(old_pos)

    piece_owner = checker_piece.owned_by()

    # Check that new position is not out of bounds
    if is_out_of_bounds(new_pos):
        return False

    # Check that new position is not occupied
    if board.get_piece_at(new_pos) is not None:
        return False

    # Flip the board if player 2 is making the move
    if piece_owner == 2:
        # flip board
        board.flip_board()

        # Flip the move coordinates
        old_pos = invert_coords(old_pos)
        new_pos = invert_coords(new_pos)

    # Check that piece has been moved forward 2 spaces
    if old_pos["row"] == (new_pos["row"] + 2):
        # Check that piece has moved diagonally left or right 2 spaces
        if old_pos["col"] == (new_pos["col"] + 2):
            return jumps_opponent_piece(move_dict, board, piece_owner)
        elif old_pos["col"] == (new_pos["col"] - 2):
            return jumps_opponent_piece(move_dict, board, piece_owner)
        else:
            return False
    else:
        return False


# Function for checking valid jumps for king pieces
#
# move : {old_pos: {row: int, col: int},
#         new_pos: {row : int, col: int}}
#
# match_board : see Board class
#
# Returns true or false
#
def is_valid_king_jump(move, match_board):
    move_dict = cp.deepcopy(move)
    old_pos = move_dict["old_pos"]
    new_pos = move_dict["new_pos"]

    checker_piece = match_board.get_piece_at(old_pos)
    owner = checker_piece.owned_by()

    # Check that new position is not out of bounds
    if is_out_of_bounds(new_pos):
        return False

    # Check that new position is not occupied
    if match_board.get_piece_at(new_pos) is not None:
        return False

    # Check that piece has been moved forward or backward one space
    if (old_pos["row"] == (new_pos["row"] + 2)) or (old_pos["row"] == (new_pos["row"] - 2)):
        # Check that piece has moved diagonally left or right one space
        if old_pos["col"] == (new_pos["col"] + 2):
            return jumps_opponent_piece(move_dict, match_board, owner)
        elif old_pos["col"] == (new_pos["col"] - 2):
            return jumps_opponent_piece(move_dict, match_board, owner)
        else:
            return False
    else:
        return False


# returns true or false depending if move jumps over opponent piece
# Takes player as int, board object and move dict
def jumps_opponent_piece(move, board, player):
    move_dict = cp.deepcopy(move)
    old_pos = move_dict["old_pos"]
    new_pos = move_dict["new_pos"]

    # Get piece between old point and new point using midpoint formula
    row = (old_pos["row"] + new_pos["row"]) // 2
    col = (old_pos["col"] + new_pos["col"]) // 2
    pos = {"row": row, "col": col}

    piece_jumped = board.get_piece_at(pos)

    # Jump was not over a piece
    if piece_jumped is None:
        return False

    # Jump was over opponent piece
    if piece_jumped.owned_by() != player:
        return True
    else:
        return False


# Returns true or false depending on if checker_piece Piece object is a king
def is_king(checker_piece):
    # If no piece at location, return false
    if checker_piece is None:
        return False

    if checker_piece.get_type() == "KING":
        return True
    else:
        return False



