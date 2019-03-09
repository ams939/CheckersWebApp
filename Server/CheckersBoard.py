"""
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
"""

from enum import Enum
import numpy as np


class PieceType(Enum):
    """
    Enum for checkers piece types
    """
    REGULAR = 1
    KING = 2


class Piece:
    """
    Checkers piece class, represents a checkers piece

    """


    def __init__(self, piece_type, owner, coordinates):
        self.piece_type = piece_type
        self.owner = owner
        self.coordinates = coordinates


    def get_type(self):
        """
        # Get the Enum type name of the piece
        :return: String
        """
        return self.piece_type.name


    def owned_by(self):
        """
        # Return owner of piece
        :return: Int
        """
        return self.owner


    def crown_piece(self):
        """
        # Change the type of the piece to KING
        :return: None
        """
        self.piece_type = PieceType.KING


    def set_location(self, new_coordinates):
        """
        # Set the location of the piece, takes dictionary {row: int, col: int} as coordinates arg

        :param new_coordinates: {row : int, col : int}
        :return: None
        """

        row = new_coordinates["row"]

        if (self.owner == 1) and (row == 0):
            self.crown_piece()
        elif (self.owner == 2) and (row == 7):
            self.crown_piece()

        self.coordinates = new_coordinates


    def __repr__(self):
        """
        # String representation of piece
        :return: String
        """

        return self.piece_type.name

    def to_json(self):
        """
        Converts object to json, returns json object
        """

        piece_dict = {}
        for attribute, value in self.__dict__.items():
            if hasattr(value, "to_json"):
                piece_dict[attribute] = value.to_json()
            else:
                piece_dict[attribute] = value

        piece_dict["piece_type"] = self.piece_type.name
        return piece_dict


class Board:
    """
    # Board class, represents checkers board as numpy matrix
    """
    def __init__(self):
        self.board = np.empty((8, 8), dtype=Piece)


    def get_board(self):
        """
        # Returns the board datastructure
        :return: Board object
        """
        return self.board


    def get_piece_at(self, coordinates):
        """
        # Returns piece at specified coordinates {row : int, col : int}

        :param coordinates: {row : int, col : int}
        :return: Piece Object
        """

        piece_row = coordinates["row"]
        piece_col = coordinates["col"]

        return self.board[piece_row, piece_col]


    def put_piece(self, piece, coordinates):
        """
        # Function for putting a Piece object at location specified in coordinates

        :param piece: Piece Object
        :param coordinates: {row: int, col: int}
        :return: None
        """

        piece_row = coordinates["row"]
        piece_col = coordinates["col"]

        self.board[piece_row][piece_col] = piece


    def remove_piece(self, coordinates):
        """
        # Removes piece at "coordinates" arg from board, returns the piece removed

        :param coordinates: {row: int, col: int}
        :return: Piece Object
        """

        piece = self.board[coordinates["row"], coordinates["col"]]
        self.board[coordinates["row"], coordinates["col"]] = None
        return piece


    def initialize_board(self, player_1, player_2):
        """
        # Function for populating board with initial piece setup

        :param player_1: Player number
        :param player_2: Player number
        :return: None
        """

        for (row, col), _ in np.ndenumerate(self.board):
            # Do not initialize pieces on two middle rows of board
            if 2 < row < 5:
                continue

            # Assign player 2 to pieces at rows 0-2, player 1 to pieces at rows 5-7
            if row <= 2:
                player = player_2
            else:
                player = player_1

            # Initialize pieces on spaces with even column and even row number
            if (col % 2 == 0) and (row % 2 == 0):
                self.board[row][col] = Piece(PieceType.REGULAR, player, {"row":row, "col":col})

            # Initialize pieces on spaces with odd column and odd row number
            if (col % 2 != 0) and (row % 2 != 0):
                self.board[row][col] = Piece(PieceType.REGULAR, player, {"row":row, "col":col})



    def flip_board(self):
        """
        # Flips the board's datastructure

        """
        self.board = np.flipud(np.fliplr(self.board))


    def __repr__(self):
        """
        # String representation of board class
        """
        return np.array2string(self.board)

    def to_json(self):
        """
        Converts object to json, returns json object
        """

        board_dict = {}
        for attribute, value in self.__dict__.items():
            if hasattr(value, "to_json"):
                board_dict[attribute] = value.to_json()
            else:
                board_dict[attribute] = value

        json_board = np.empty((8, 8), dtype=dict)

        for (row, col), value in np.ndenumerate(self.board):
            if self.board[row][col] is not None:
                json_board[row][col] = (self.board[row][col]).to_json()

        board_dict["board"] = json_board.tolist()


        return board_dict
