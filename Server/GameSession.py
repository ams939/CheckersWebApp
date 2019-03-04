import CheckersBoard as cb
import Validator as vd
import Player as pl

class GameSession:
    def __init__(self, player_one, player_two, session_id):
        self.player_one = player_one
        self.player_two = player_two
        self.current_turn = 1
        self.session_id = session_id
        self.board = cb.Board()
        self.initialize_match()




    # Function for moving a piece on the board. Does not validate the move.
    # move format : {old_pos: {row: int, col: int},
    #                new_pos: {row : int, col: int}
    #                }
    #
    def move_piece(self, move):
        old_pos = move["old_pos"]
        new_pos = move["new_pos"]

        piece = self.board.remove_piece(old_pos)
        piece.set_location(new_pos)

        self.board.put_piece(piece, new_pos)


    def initialize_match(self):
        # Initialize the checkers board
        self.board.initialize_board(1, 2)

        # Set session id's for players
        self.player_one.set_session_id(self.session_id)
        self.player_two.set_session_id(self.session_id)


    def get_player_one(self):
        return self.player_one

    def get_player_two(self):
        return self.player_two

    def get_session_id(self):
        return self.session_id

    def change_turn(self):
        if self.current_turn == 1:
            self.current_turn = 2
        elif self.current_turn == 2:
            self.current_turn = 1
        else:
            self.current_turn = 1



