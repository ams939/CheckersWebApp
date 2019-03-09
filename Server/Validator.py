"""
# Drexel University - CS451 Checkers Web Application
# Authors: Alex Sladek, Brian Stump, Eric Szabo, Philip Stephenson
# 2.21.2019
#
#
# Validator.py - Python module with functions for validating checker's moves
#
# Python v. 3.7.1
#
#
#
"""
import copy as cp


####################################################################################################
# MAIN MOVE VALIDATION FUNCTION BELOW                                                              #
####################################################################################################

def validate(move, board):
    """
    validate - Validates checkers moves, returns true or false if move valid

    Arguments:
        move : {old_pos: {row: int, col: int},
                new_pos: {row : int, col: int}}

        board : Board object - See Board class
    """

    new_pos = move["new_pos"]
    old_pos = move["old_pos"]

    # Temporary fix for handling duplicate moves
    if board.get_piece_at(old_pos) is None:
        return False

    player = (board.get_piece_at(old_pos)).owner

    # Get all pieces that can jump
    piece_jump_list = pieces_with_jumps(board, player)

    # If there are pieces that can jump, find out if move given is one of the jumps possible
    if len(piece_jump_list) != 0:
        # Iterate through pieces that can jump
        for i in range(0, len(piece_jump_list)):
            jump_list = piece_jump_list[i]["jumps"]

            # compare jump coordinate to possible jump coordinates
            for k in range(0, len(jump_list)):
                if is_coord_equal(new_pos, jump_list[k]):
                    return True




        return False

    else:
        if is_move(move):
            return is_valid_move(move, board)
        else:
            return is_valid_jump(move, board)


####################################################################################################
# END OF MAIN MOVE VALIDATION FUNCTION                                                             #
####################################################################################################


def is_valid_move(move, board):
    """
    is_valid_move - Validates regular checkers moves, returns true or false if move valid

    Arguments:
        move : {old_pos: {row: int, col: int},
                new_pos: {row : int, col: int}}

        board : Board object - See Board class
    """

    old_pos = move["old_pos"]

    piece = board.get_piece_at(old_pos)

    if piece.get_type() == "REGULAR":
        return is_valid_regular_move(move, board)
    elif piece.get_type() == "KING":
        return is_valid_king_move(move, board)
    else:
        return False


def is_valid_jump(move, board):
    """
    is_valid_jump - Validates jump checkers moves, returns true or false if move valid

    Arguments:
        move : {old_pos: {row: int, col: int},
                new_pos: {row : int, col: int}}

        board : Board object - See Board class
    """

    old_pos = move["old_pos"]

    piece = board.get_piece_at(old_pos)

    if piece.get_type() == "REGULAR":
        return is_valid_regular_jump(move, board)
    elif piece.get_type() == "KING":
        return is_valid_king_jump(move, board)
    else:
        return False


def is_coord_equal(coord1, coord2):
    """
    Function for checking if two coordinates are equal
    """

    if (coord1["row"] == coord2["row"]) and (coord1["col"] == coord2["col"]):
        return True
    else:
        return False


def has_jumps(coordinates, board):
    """
    Function for getting list of valid jumps for king or regular piece

    Arguments:
        coordinates: {row: int, col: int}

        board : see Board class

        Returns list of jumps available
    """

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


####################################################################################################
# HELPER FUNCTIONS BELOW                                                                           #
####################################################################################################

def pieces_with_jumps(match_board, player):
    """
    Finds list of pieces that have jumps available

    :param match_board: Board object
    :param player: Player identifier (int)
    :return: list of dicts {"piece": Piece, "jumps": [coord dict]
    """

    pieces_w_jumps = []

    for i in range(0, 8):
        for k in range(0, 8):
            coords = {"row": i, "col": k}

            piece = match_board.get_piece_at(coords)

            if piece is None:
                continue

            piece_owner = piece.owner

            if piece_owner != player:
                continue

            piece_jumps = has_jumps(piece.coordinates, match_board)

            if len(piece_jumps) != 0:
                pieces_w_jumps.append({"piece": piece, "jumps": piece_jumps})


    return pieces_w_jumps


def invert_coords(coordinates):
    """
    Function for inverting a given set of coordinates
    Coordinates given in form: {"row": int, "col": int}

    Returns dict of same form with inverted coordinates
    """

    coordinates["row"] = 7 - coordinates["row"]
    coordinates["col"] = 7 - coordinates["col"]

    return coordinates


def is_out_of_bounds(coordinates):
    """
    Function for checking if given coordinates are out of bounds
    """

    if  coordinates["row"] < 0 or coordinates["row"] > 7:
        return True
    elif coordinates["col"] < 0 or coordinates["col"] > 7:
        return True
    else:
        return False


def is_valid_regular_move(move, match_board):
    """
    Function for checking valid moves for regular pieces

    move : {old_pos: {row: int, col: int},
         new_pos: {row : int, col: int}}

    match_board : see Board class

    Returns true or false

    """

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
        if old_pos["col"] == (new_pos["col"] + 1):
            return True
        elif old_pos["col"] == (new_pos["col"] - 1):
            return True
        else:
            return False
    else:
        return False


def is_valid_king_move(move, match_board):
    """
    Function for checking valid moves for king pieces

    move : {old_pos: {row: int, col: int},
             new_pos: {row : int, col: int}}

    match_board : see Board class

    Returns true or false

    """

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


def is_valid_regular_jump(move, match_board):
    """
    Function for checking valid jumps for regular pieces

    move : {old_pos: {row: int, col: int},
            new_pos: {row : int, col: int}}

    match_board : see Board class

    Returns true or false
    """

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


def is_valid_king_jump(move, match_board):
    """
    Function for checking valid jumps for king pieces

    move : {old_pos: {row: int, col: int},
             new_pos: {row : int, col: int}}

    match_board : see Board class

    Returns true or false
    """

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


def jumps_opponent_piece(move, board, player):
    """
    returns true or false depending if move jumps over opponent piece
    Takes player as int, board object and move dict
    """

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


def is_king(checker_piece):
    """
    Returns true or false depending on if checker_piece Piece object is a king
    """

    # If no piece at location, return false
    if checker_piece is None:
        return False

    if checker_piece.get_type() == "KING":
        return True
    else:
        return False


def is_move(move):
    """
    Function for checking if a move is a move rather than a jump
    """

    old_pos = move["old_pos"]
    new_pos = move["new_pos"]

    if abs(old_pos["row"] - new_pos["row"]) == 1:
        if abs(old_pos["col"] - new_pos["col"]) == 1:
            return True
        else:
            return False

    else:
        return False
