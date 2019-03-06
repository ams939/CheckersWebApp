import CheckersBoard as cb
import Validator as vd
import Player as pl
import json


class GameSession:
    def __init__(self, player_one, player_two, session_id):
        self.player_one = player_one
        self.player_two = player_two
        self.current_turn = 1
        self.turn_count = 0
        self.session_id = session_id
        self.board = cb.Board()
        self.initialize_match()


    @property
    def id(self):
        return self.session_id

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

    def jump_piece(self, move):
        old_pos = move["old_pos"]
        new_pos = move["new_pos"]

        # Move the piece
        self.move_piece(move)


        # Get location of piece jumped over
        row = (old_pos["row"] + new_pos["row"]) // 2
        col = (old_pos["col"] + new_pos["col"]) // 2
        jumped_piece_loc = {"row": row, "col": col}

        # Remove the jumped piece
        self.board.remove_piece(jumped_piece_loc)



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

    def get_board(self):
        return self.board

    def set_board(self, new_board):
        self.board = new_board

    def to_json(self):
        d = {}
        for a, v in self.__dict__.items():
            if (hasattr(v, "to_json")):
                d[a] = v.to_json()
            else:
                d[a] = v
        return d

    def dump(self, indent = 0):
        obj = {
                'player_one' : self.player_one.username,
                'player_two' : self.player_two.username,
                'session_id' : self.session_id,
              }
        return json.dumps( \
                 {**obj, **self.board.to_json()}, indent = indent)


if __name__ == '__main__':
   import uuid
   p1 = pl.Player('John', None)
   p2 = pl.Player('Bob',  None)
   sess = GameSession(p1, p2, uuid.uuid4().hex)
   print(sess.dump(2))
