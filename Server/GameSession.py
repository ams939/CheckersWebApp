import hashlib
import json
import copy as cp

import CheckersBoard as cb
import Validator as vd
import Player as pl

class GameSession:
    def __init__(self, player_one, player_two, session_id):
        """
        Initialize the game session
        """
        self.player_one = player_one
        self.player_two = player_two
        self.current_turn = 1
        self.turn_count = 0
        self.turns_no_advance = 0
        self.turns_no_pieces_removed = [0, 0]
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

        new_pos = move["new_pos"]

        # Handle consecutive jumps
        if self.last_jump is not None:
            return self.handle_consecutive_jumps(move)

        #Validate move
        if not vd.validate(move, self.board):
            if vd.is_move(move):
                return False, "Invalid move."
            return False, "Invalid jump."

        if vd.is_move(move):
            self.move_piece(move)
        else:
            self.jump_piece(move)

            #Check if chain jumps are possible
            if vd.has_jumps(new_pos, self.board):
                self.last_jump = cp.deepcopy(move)
                return True, None

        self.change_turn()
        return True, None

    def handle_consecutive_jumps(self, move):
        """
        Handles validating chain jumps and updating the board
        """
        last_jump_pos = self.last_jump["new_pos"]
        old_pos = move["old_pos"]
        new_pos = move["new_pos"]

        # Make sure user moves piece that just jumped
        if not vd.is_coord_equal(old_pos, last_jump_pos):
            return False, "You must move the piece you jumped with previously."

        # Make sure move given is not a regular move
        if vd.is_move(move):
            return False, "You must make a jump."

        # Validate the jump
        if vd.validate(move, self.board):
            # Move the piece in the board
            self.jump_piece(move)

            #See if piece has more jumps available
            if vd.has_jumps(new_pos, self.board):
                # Let user continue current turn
                self.last_jump = cp.deepcopy(move)
                return True, None
            # No more jumps available, change turn
            self.change_turn()
            return True, None

        # Invalid jump with correct piece
        return False, "Invalid jump."

    @property
    def id(self):
        """
        Returns session id
        """
        return self.session_id

    def move_piece(self, move):
        """
        Function for moving a piece on the board. Does not validate the move.
        move format : {old_pos: {row: int, col: int},
                       new_pos: {row : int, col: int}
                       }
        """

        #Increments turns with no captures counter
        self.turns_no_pieces_removed[self.current_turn-1] = \
                self.turns_no_pieces_removed[self.current_turn-1] + 1

        old_pos = move["old_pos"]
        new_pos = move["new_pos"]

        piece = self.board.remove_piece(old_pos)
        piece.set_location(new_pos)

        self.board.put_piece(piece, new_pos)

    def jump_piece(self, move):
        """
        Handles a jump move
        """
        #Reset turns with no captures counter
        self.turns_no_pieces_removed[self.current_turn-1] = 0

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
        """
        Initializes the game session with a fresh board
        """
        # Initialize the checkers board
        self.board.initialize_board(1, 2)

        # Set session id's for players
        self.player_one.set_session_id(self.session_id)
        self.player_two.set_session_id(self.session_id)

    def get_player_one(self):
        """
        Returns player 1
        """
        return self.player_one

    def get_player_two(self):
        """
        Returns player 2
        """
        return self.player_two

    def get_session_id(self):
        """
        Returns the game session id
        """
        return self.session_id

    def change_turn(self):
        """
        Changes the active player after the conclusion of their turn
        """
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
        """
        Returns the current board
        """
        return self.board

    def set_board(self, new_board):
        """
        Updates board state
        """
        self.board = new_board

    def to_json(self):
        """
        Converts the game session to json
        """
        d = {}
        for a, v in self.__dict__.items():
            if hasattr(v, "to_json"):
                d[a] = v.to_json()
            else:
                d[a] = v
        return d

    def dump(self, indent=0):
        """
        dumps game session to json
        """
        obj = {
            'player_one' : self.player_one.username,
            'player_two' : self.player_two.username,
            'session_id' : self.session_id,
            }
        return json.dumps({**obj, **self.board.to_json()}, indent=indent)

    def check_stale(self):
        """
        Returns true if the game has reached a point where nothing has occurred for over 80 turns
        """
        print("%i without advance" % self.turns_no_advance)
        print("%s without removal" % self.turns_no_pieces_removed)
        return self.turns_no_advance >= 80 and \
            self.turns_no_pieces_removed[self.current_turn-1] >= 40

    def check_draw(self):
        """
        Returns true if any draw conditions have been met
        """
        return self.check_stale() or self.check_hashes()

    def check_hashes(self):
        """
        Returns true if a board state has been seen 3 times
        """
        print(self.hashes)
        if len(self.hashes) >= 5 and self.hashes[0] == self.hashes[2] == self.hashes[4]:
            return True
        return False

    def store_hash(self):
        """
        Saves a hash of the board
        """
        if len(self.hashes) >= 5:
            self.hashes.pop(0)

        if self.current_turn == 1:
            self.hashes.append(hashlib.sha256(json.dumps(self.board.to_json())
                                              .encode()).hexdigest())

    def lost_all_pieces(self, player):
        """
        Returns true if player given has no pieces left on board
        Changes "winner" attribute to player who won
        """
        for row in range(0, 8):
            for col in range(0, 8):
                pos = {"row": row, "col": col}

                piece = self.board.get_piece_at(pos)

                if piece is None:
                    continue

                owner = piece.owned_by()

                if owner == player:
                    return False
                continue

        if player == 1:
            self.winner = 2
            return True

        self.winner = 1
        return True

    def can_move(self, player):
        """
        Returns true if player can move, false if cannot
        Sets winner as opponent if player given cannot move
        :param player: int
        :return: Bool
        """

        for row in range(0, 8):
            for col in range(0, 8):
                pos = {"row": row, "col": col}

                piece = self.board.get_piece_at(pos)

                if piece is None:
                    continue

                owner = piece.owned_by()

                if owner != player:
                    continue

                if vd.has_moves(pos, self.board):
                    return True

                if vd.has_jumps(pos, self.board):
                    return True
                continue


        if player == 1:
            self.winner = 2
            return False
        self.winner = 1
        return False

if __name__ == '__main__':
    import uuid
    p1 = pl.Player('John', None)
    p2 = pl.Player('Bob', None)
    sess = GameSession(p1, p2, uuid.uuid4().hex)
    print(sess.dump(2))
