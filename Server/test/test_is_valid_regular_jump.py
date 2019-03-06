from unittest import TestCase
from Server import Validator as vd
from Server import CheckersBoard as cb

class TestIs_valid_regular_jump(TestCase):
    def test_is_valid_regular_jump(self):
        regular = cb.Piece(cb.PieceType.REGULAR, 1, {"row": 3, "col": 3})
        board = cb.Board()
        board.put_piece(regular, {"row": 3, "col": 3})

        move = {
            "old_pos": {"row": 3, "col": 3}
        }

        piece1 = cb.Piece(cb.PieceType.REGULAR, 2, {"row": 2, "col": 4})
        piece2 = cb.Piece(cb.PieceType.REGULAR, 1, {"row": 4, "col": 4})
        piece3 = cb.Piece(cb.PieceType.REGULAR, 1, {"row": 4, "col": 2})
        piece4 = cb.Piece(cb.PieceType.REGULAR, 2, {"row": 2, "col": 2})

        board.put_piece(piece1, {"row": 2, "col": 4})
        board.put_piece(piece2, {"row": 4, "col": 4})
        board.put_piece(piece3, {"row": 4, "col": 2})
        board.put_piece(piece4, {"row": 2, "col": 2})

        # Test player 1 valid jumps
        move["new_pos"] = {"row": 1, "col": 5}
        self.assertEqual(vd.is_valid_regular_jump(move, board), True)

        move["new_pos"] = {"row": 1, "col": 1}
        self.assertEqual(vd.is_valid_regular_jump(move, board), True)


        # Test player 2 valid jumps
        regular = cb.Piece(cb.PieceType.REGULAR, 2, {"row": 3, "col": 3})
        board.put_piece(regular, {"row": 3, "col": 3})

        move["new_pos"] = {"row": 5, "col": 5}
        self.assertEqual(vd.is_valid_regular_jump(move, board), True)

        move["new_pos"] = {"row": 5, "col": 1}
        self.assertEqual(vd.is_valid_regular_jump(move, board), True)



    def test_invalid_regular_jump(self):
        regular = cb.Piece(cb.PieceType.REGULAR, 1, {"row": 3, "col": 3})
        board = cb.Board()
        board.put_piece(regular, {"row": 3, "col": 3})

        move = {
            "old_pos": {"row": 3, "col": 3}
        }

        piece1 = cb.Piece(cb.PieceType.REGULAR, 1, {"row": 2, "col": 4})
        piece3 = cb.Piece(cb.PieceType.REGULAR, 2, {"row": 4, "col": 2})

        board.put_piece(piece1, {"row": 2, "col": 4})
        board.put_piece(piece3, {"row": 4, "col": 2})

        # Test player 1 invalid jumps

        # Jump over own piece
        move["new_pos"] = {"row": 1, "col": 5}
        self.assertEqual(vd.is_valid_regular_jump(move, board), False)

        # Jump over empty space
        move["new_pos"] = {"row": 1, "col": 1}
        self.assertEqual(vd.is_valid_regular_jump(move, board), False)

        # Jump backwards
        move["new_pos"] = {"row": 5, "col": 1}
        self.assertEqual(vd.is_valid_regular_jump(move, board), False)

        # Jump too far
        move["new_pos"] = {"row": 0, "col": 0}
        self.assertEqual(vd.is_valid_regular_jump(move, board), False)

        move["new_pos"] = {"row": 7, "col": 7}
        self.assertEqual(vd.is_valid_regular_jump(move, board), False)

        move["new_pos"] = {"row": 8, "col": 0}
        self.assertEqual(vd.is_valid_regular_jump(move, board), False)



        # Test player 2 invalid jumps
        regular = cb.Piece(cb.PieceType.REGULAR, 2, {"row": 3, "col": 3})
        board.put_piece(regular, {"row": 3, "col": 3})

        # Jump over empty space
        move["new_pos"] = {"row": 5, "col": 5}
        self.assertEqual(vd.is_valid_regular_jump(move, board), False)

        # Jump over own piece
        move["new_pos"] = {"row": 5, "col": 1}
        self.assertEqual(vd.is_valid_regular_jump(move, board), False)

        # Jump backwards
        move["new_pos"] = {"row": 1, "col": 5}
        self.assertEqual(vd.is_valid_regular_jump(move, board), False)

        # Jump too far
        move["new_pos"] = {"row": 0, "col": 0}
        self.assertEqual(vd.is_valid_regular_jump(move, board), False)

        move["new_pos"] = {"row": 7, "col": 7}
        self.assertEqual(vd.is_valid_regular_jump(move, board), False)

        move["new_pos"] = {"row": 8, "col": 0}
        self.assertEqual(vd.is_valid_regular_jump(move, board), False)
