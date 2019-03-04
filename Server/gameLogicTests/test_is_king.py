from unittest import TestCase
import Validator as vd
import CheckersBoard as cb


class TestIs_king(TestCase):
    def test_is_king(self):
        kingpiece = cb.Piece(cb.PieceType.KING, 1, {"row": 0, "col": 0})
        regularpiece = cb.Piece(cb.PieceType.REGULAR, 1, {"row": 1, "col": 0})

        self.assertEqual(vd.is_king(kingpiece), True)
        self.assertEqual(vd.is_king(regularpiece), False)


