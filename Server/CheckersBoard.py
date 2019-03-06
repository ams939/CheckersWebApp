# Drexel University - CS451 Checkers Web Application
# Authors: Alex Sladek, Brian Stump, Eric Szabo, Philip Stephenson
# 2.21.2019
#
#
# CheckersBoard.py - Python module with classes to represent a checkers board
#
# Python v. 3.7.1
# numpy 1.16.0
#

import numpy as np
from enum import Enum
import json


# Enum for checkers piece types
class PieceType(Enum):
    REGULAR = 1
    KING = 2



# Checkers piece class, takes a type (Enum: REGULAR or KING), owner (Int), coordinates (dict : {row: Int, col: Int})
class Piece:
    # Piece constructor, takes piece_type (Enum KING or REGULAR), owner (Player object) and coordinates (Dict {row: int, col: int})
    # as arguments
    def __init__(self, piece_type, owner, coordinates):
        self.piece_type = piece_type
        self.owner = owner
        self.coordinates = coordinates

    # Get the Enum type name of the piece
    def get_type(self):
        return self.piece_type.name

    # Return owner of piece
    def owned_by(self):
        return self.owner

    # Change the type of the piece to KING
    def crown_piece(self):
        self.piece_type = PieceType.KING

    # Set the location of the piece, takes dictionary {row: int, col: int} as coordinates arg
    def set_location(self, new_coordinates):
        self.coordinates = new_coordinates

    # String representation of piece
    def __repr__(self):
        return self.piece_type.name

    def to_json(self):
        d = {}
        for a, v in self.__dict__.items():
            if (hasattr(v, "to_json")):
                    d[a] = v.to_json()
            else:
                d[a] = v

        d["piece_type"] = self.piece_type.name
        return d




# Board class, represents checkers board as numpy matrix
class Board:
    def __init__(self):
        self.board = np.empty((8,8), dtype=Piece)


    # Returns the board datastructure
    def get_board(self):
        return self.board


    # Returns piece at specified coordinates {row : int, col : int}
    def get_piece_at(self, coordinates):
        piece_row = coordinates["row"]
        piece_col = coordinates["col"]

        return self.board[piece_row, piece_col]


    # Function for putting a Piece object at location specified in coordinates {row: int, col: int}
    def put_piece(self, piece, coordinates):
        piece_row = coordinates["row"]
        piece_col = coordinates["col"]

        self.board[piece_row][piece_col] = piece


    # Removes piece at "coordinates" arg from board, returns the piece removed
    def remove_piece(self, coordinates):
        piece = self.board[coordinates["row"], coordinates["col"]]
        self.board[coordinates["row"], coordinates["col"]] = None
        return piece



    # Function for populating board with initial piece setup
    def initialize_board(self, player_1, player_2):
        for (x, y), value in np.ndenumerate(self.board):
            # Do not initialize pieces on two middle rows of board
            if (x > 2) and (x < 5):
                continue

            # Assign player 2 to pieces at rows 0-2, player 1 to pieces at rows 5-7
            if x <= 2:
                player = player_2
            else:
                player = player_1

            # Initialize pieces on spaces with odd column and even row number
            if (y % 2 != 0) and (x % 2 == 0):
                self.board[x][y] = Piece(PieceType.REGULAR, player, {"row":x, "col":y})

            # Initialize pieces on spaces with even column and odd row number
            if (y % 2 == 0) and (x % 2 != 0):
                self.board[x][y] = Piece(PieceType.REGULAR, player, {"row":x, "col":y})


    # Flips the board's datastructure
    def flip_board(self):
        self.board = np.flipud(np.fliplr(self.board))

    # String representation of board class
    def __repr__(self):
        return np.array2string(self.board)

    def to_json(self):
        d = {}
        for a, v in self.__dict__.items():
            if (hasattr(v, "to_json")):
                d[a] = v.to_json()
            else:
                d[a] = v

        json_board = np.empty((8, 8), dtype=dict)

        for (x, y), value in np.ndenumerate(self.board):
            if self.board[x][y] is not None:
                json_board[x][y] = (self.board[x][y]).to_json()

        d["board"] = json_board.tolist()


        return d





