from unittest import TestCase
from Server import CheckersBoard as cb
from Server import Validator as vd


class TestValidate(TestCase):
    def test_validate(self):
        board = cb.Board()
        piece_type = cb.PieceType.KING

        piece1 = cb.Piece(piece_type, 1, {"row": 5, "col": 5})
        piece2 = cb.Piece(piece_type, 1, {"row": 6, "col": 6})
        piece3 = cb.Piece(piece_type, 2, {"row": 1, "col": 1})
        piece4 = cb.Piece(piece_type, 2, {"row": 2, "col": 2})

        board.put_piece(piece1, {"row": 5, "col": 5})
        board.put_piece(piece2, {"row": 6, "col": 6})

        board.put_piece(piece3, {"row": 1, "col": 1})
        board.put_piece(piece4, {"row": 2, "col": 2})

        # Valid P1 Moves
        move1 = {"old_pos": {"row": 5, "col": 5}, "new_pos": {"row": 4, "col": 4}}
        move2 = {"old_pos": {"row": 5, "col": 5}, "new_pos": {"row": 4, "col": 6}}
        move3 = {"old_pos": {"row": 5, "col": 5}, "new_pos": {"row": 6, "col": 4}}

        # Valid P2 Moves
        move4 = {"old_pos": {"row": 2, "col": 2}, "new_pos": {"row": 3, "col": 3}}
        move5 = {"old_pos": {"row": 2, "col": 2}, "new_pos": {"row": 3, "col": 1}}
        move6 = {"old_pos": {"row": 2, "col": 2}, "new_pos": {"row": 1, "col": 3}}

        self.assertEqual(vd.validate(move1, board), True, "Valid P1 KING Move")
        self.assertEqual(vd.validate(move2, board), True, "Valid P1 KING Move 2")
        self.assertEqual(vd.validate(move3, board), True, "Valid P1 KING Move 3")


        self.assertEqual(vd.validate(move4, board), True, "Valid P2 KING Move")
        self.assertEqual(vd.validate(move5, board), True, "Valid P2 KING Move 2")
        self.assertEqual(vd.validate(move6, board), True, "Valid P2 KING Move 3")

        # Invalid P1 Moves
        move1 = {"old_pos": {"row": 6, "col": 6}, "new_pos": {"row": 5, "col": 5}}
        move2 = {"old_pos": {"row": 6, "col": 6}, "new_pos": {"row": 4, "col": 4}}

        # Invalid P2 Moves
        move3 = {"old_pos": {"row": 1, "col": 1}, "new_pos": {"row": 2, "col": 2}}
        move4 = {"old_pos": {"row": 1, "col": 1}, "new_pos": {"row": 4, "col": 4}}

        self.assertEqual(vd.validate(move1, board), False, "Invalid P1 KING Move (moving into occupied space)")
        self.assertEqual(vd.validate(move2, board), False, "Invalid P1 Reg Move 2 (moving too far")
        self.assertEqual(vd.validate(move3, board), False, "Valid P2 Reg Move (moving into occupied space)")
        self.assertEqual(vd.validate(move4, board), False, "Valid P2 Reg Move 2 (going backwards)")
