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


# Function for inverting a given set of coordinates
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
def is_valid_regular_move(move, match_board):
    old_pos = move["old_pos"]
    new_pos = move["new_pos"]
    checker_piece = match_board.get_piece_at(old_pos)

    piece_owner = checker_piece.owned_by()

    # Check that new position is not out of bounds
    if is_out_of_bounds(new_pos):
        return False

    # Check that new position is not occupied
    if match_board.get_piece_at(new_pos) is not None:
        return False

    # Flip the board if player 2 is making the move
    if piece_owner == 2:
        # make a copy of the board being handled and flip it
        match_board = cp.deepcopy(match_board)
        match_board.flip_board()

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



def is_valid_king_move(move, match_board):
    pass

def is_valid_regular_jump(move, match_board):
    pass

def is_valid_king_jump(move, match_board):
    pass

def is_king_row(coordinates):
    pass