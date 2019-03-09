from unittest import TestCase
from Server import CheckersBoard as cb
from Server import Validator as vd


class TestValidate(TestCase):
    def test_validate(self):
        board = cb.Board()
        piece_type = cb.PieceType.KING

        piece1 = cb.Piece(piece_type, 1, {"row": 4, "col": 4})
        piece2 = cb.Piece(piece_type, 2, {"row": 3, "col": 3})
        piece3 = cb.Piece(piece_type, 1, {"row": 6, "col": 5})
        piece4 = cb.Piece(piece_type, 2, {"row": 5, "col": 6})

        board.put_piece(piece1, {"row": 4, "col": 4})
        board.put_piece(piece2, {"row": 3, "col": 3})

        board.put_piece(piece3, {"row": 6, "col": 5})
        board.put_piece(piece4, {"row": 5, "col": 6})

        # Valid P1 Jump
        move1 = {"old_pos": {"row": 4, "col": 4}, "new_pos": {"row": 2, "col": 2}}

        # Valid P2 Jump
        move2 = {"old_pos": {"row": 3, "col": 3}, "new_pos": {"row": 5, "col": 5}}

        self.assertEqual(vd.validate(move1, board), True, "Valid P1 Regular JUMP")
        self.assertEqual(vd.validate(move2, board), True, "Valid P2 Regular JUMP")

        # Valid jumps
        move3 = {"old_pos": {"row": 6, "col": 5}, "new_pos": {"row": 4, "col": 7}}
        move4 = {"old_pos": {"row": 5, "col": 6}, "new_pos": {"row": 7, "col": 4}}

        self.assertEqual(vd.validate(move3, board), True, "Invalid P1 Reg Move (jump available")
        self.assertEqual(vd.validate(move4, board), True, "Invalid P2 Reg Move (jump available")
