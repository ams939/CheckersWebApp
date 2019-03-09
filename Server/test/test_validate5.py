from unittest import TestCase
from Server import Validator as vd
from Server import CheckersBoard as cb

class TestValidate(TestCase):
    def test_validate(self):
        king = cb.Piece(cb.PieceType.KING, 1, {"row": 3, "col": 3})
        board = cb.Board()
        board.put_piece(king, {"row": 3, "col": 3})

        move = {
            "old_pos": {"row": 3, "col": 3}
        }

        piece1 = cb.Piece(cb.PieceType.KING, 2, {"row": 2, "col": 4})
        piece2 = cb.Piece(cb.PieceType.KING, 2, {"row": 4, "col": 4})
        piece3 = cb.Piece(cb.PieceType.KING, 2, {"row": 4, "col": 2})
        piece4 = cb.Piece(cb.PieceType.KING, 2, {"row": 2, "col": 2})

        board.put_piece(piece1, {"row": 2, "col": 4})
        board.put_piece(piece2, {"row": 4, "col": 4})
        board.put_piece(piece3, {"row": 4, "col": 2})
        board.put_piece(piece4, {"row": 2, "col": 2})

        move["new_pos"] = {"row": 1, "col": 5}
        self.assertEqual(vd.validate(move, board), True)

        move["new_pos"] = {"row": 5, "col": 1}
        self.assertEqual(vd.validate(move, board), True)

        move["new_pos"] = {"row": 1, "col": 1}
        self.assertEqual(vd.validate(move, board), True)

        move["new_pos"] = {"row": 5, "col": 5}
        self.assertEqual(vd.validate(move, board), True)


        king = cb.Piece(cb.PieceType.KING, 1, {"row": 3, "col": 3})
        board = cb.Board()
        board.put_piece(king, {"row": 3, "col": 3})

        move = {
            "old_pos": {"row": 3, "col": 3}
        }

        piece1 = cb.Piece(cb.PieceType.KING, 1, {"row": 2, "col": 4})
        piece2 = cb.Piece(cb.PieceType.KING, 2, {"row": 5, "col": 5})
        piece3 = cb.Piece(cb.PieceType.KING, 2, {"row": 4, "col": 2})

        board.put_piece(piece1, {"row": 2, "col": 4})
        board.put_piece(piece2, {"row": 5, "col": 5})
        board.put_piece(piece3, {"row": 4, "col": 2})

        # Jump over own piece
        move["new_pos"] = {"row": 1, "col": 5}
        self.assertEqual(vd.validate(move, board), False)

        # Jump too far
        move["new_pos"] = {"row": 6, "col": 1}
        self.assertEqual(vd.validate(move, board), False)

        move["new_pos"] = {"row": 1, "col": 3}
        self.assertEqual(vd.validate(move, board), False)

        move["new_pos"] = {"row": 7, "col": 7}
        self.assertEqual(vd.validate(move, board), False)

        move["new_pos"] = {"row": 8, "col": 8}
        self.assertEqual(vd.validate(move, board), False)

        # Jump into occupied space
        move["new_pos"] = {"row": 5, "col": 5}
        self.assertEqual(vd.validate(move, board), False)

        # Jump over empty space
        move["new_pos"] = {"row": 1, "col": 1}
        self.assertEqual(vd.validate(move, board), False)
