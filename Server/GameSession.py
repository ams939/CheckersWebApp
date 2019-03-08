import CheckersBoard as cb
import Validator as vd
import Player as pl
import json
import copy as cp
import hashlib

class GameSession:
    def __init__(self, player_one, player_two, session_id):
        self.player_one = player_one
        self.player_two = player_two
        self.current_turn = 1
        self.turn_count = 0
        self.session_id = session_id
        self.board = cb.Board()
        self.initialize_match()
        self.last_jump = None # Last jump move storage
        self.hashes = []
        self.winner = None


    def handle_move(self, move):
        """ Function for handling moves and updating game state accordingly
            Returns false if move was invalid and does not update turn counter
            Returns true if move was valid, updates turn counter accordingly

            Keyword arguments:
            move -- {old_pos: {row: int, col: int},
                    new_pos: {row : int, col: int}}

        """

        old_pos = move["old_pos"]
        new_pos = move["new_pos"]

        # Handle consecutive jumps
        if self.last_jump is not None:
            last_jump_pos = self.last_jump["new_pos"]

            # Make sure user moves piece that just jumped
            if not vd.is_coord_equal(old_pos, last_jump_pos):
                return False

            # Make sure move given is not a regular move
            if vd.is_move(move):
                return False

            # Validate the jump
            if vd.validate(move, self.board):
                # Move the piece in the board
                self.jump_piece(move)

                #See if piece has more jumps available
                if len(vd.has_jumps(new_pos, self.board)) != 0:
                    # Let user continue current turn
                    self.last_jump = cp.deepcopy(move)
                    return True
                else:
                    # No more jumps available, change turn
                    self.change_turn()
                    return True
            else:
                # Invalid jump with correct piece
                return False


        # Handle regular moves and non-consecutive jumps
        if vd.is_move(move):
            # Validate the regular move
            if vd.validate(move, self.board):
                # Valid move regular move, move the piece
                self.move_piece(move)

                # Change the turn
                self.change_turn()
                return True
            else:
                # Invalid regular move, user continues turn
                return False

        else:
            # Validate the jump
            if vd.validate(move, self.board):
                # Valid jump, move the piece to the new position
                self.jump_piece(move)

                # Check if piece has consecutive jumps available
                if len(vd.has_jumps(new_pos, self.board)) != 0:
                    # Consecutive jumps available, let user continue turn
                    self.last_jump = cp.deepcopy(move)
                    return True
                else:
                    # No jumps available, change turn
                    self.change_turn()
                    return True


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

        # Reset last jump
        self.last_jump = None

        # Increment turn counter
        self.turn_count += 1


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

    def check_hashes(self):
        print(self.hashes)
        if len(self.hashes) >= 5:
           if self.hashes[0] == self.hashes[2] == self.hashes[4]:
              return True
        return False

    def store_hash(self):
        if len(self.hashes) >= 5:
           self.hashes.pop(0)

        if self.current_turn == 1:
           self.hashes.append(hashlib.sha256(json.dumps(self.board.to_json()).encode()).hexdigest())


    def lost_all_pieces(self, player):
        """Returns true if player given has no pieces left on board
           Changes "winner" attribute to player who won

        """
        for row in range(0, 8):
            for col in range(0,8):
                pos = {"row": row, "col": col}

                piece = self.board.get_piece_at(pos)

                if piece is None:
                    continue

                owner = piece.owned_by()

                if owner == player:
                    return False
                else:
                    continue

        if player == 1:
            self.winner = 2
            return True
        else:
            self.winner = 1
            return True


if __name__ == '__main__':
   import uuid
   p1 = pl.Player('John', None)
   p2 = pl.Player('Bob',  None)
   sess = GameSession(p1, p2, uuid.uuid4().hex)
   print(sess.dump(2))
