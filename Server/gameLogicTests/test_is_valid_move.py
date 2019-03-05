from unittest import TestCase
import Validator as vd
import CheckersBoard as cb


class TestIs_valid_move(TestCase):
    def test_is_valid_move(self):
        kingpiece = cb.Piece(cb.PieceType.KING, 1, {"row": 3, "col": 3})

        board = cb.Board()
        board.put_piece(kingpiece, {"row": 3, "col": 3})

        move = {
            "old_pos": {"row": 3, "col": 3}
        }

        # Valid moves
        move["new_pos"] = {"row": 4, "col": 4}
        self.assertEqual(vd.is_valid_move(move, board), True)
        move["new_pos"] = {"row": 2, "col": 4}
        self.assertEqual(vd.is_valid_move(move, board), True)
        move["new_pos"] = {"row": 2, "col": 2}
        self.assertEqual(vd.is_valid_move(move, board), True)
        move["new_pos"] = {"row": 4, "col": 2}
        self.assertEqual(vd.is_valid_move(move, board), True)

        # Invalid moves
        regularpiece = cb.Piece(cb.PieceType.REGULAR, 1, {"row": 4, "col": 4})
        board.put_piece(regularpiece, {"row": 4, "col": 4})
        move["new_pos"] = {"row": 4, "col": 4}
        self.assertEqual(vd.is_valid_move(move, board), False)
        move["new_pos"] = {"row": 0, "col": 0}
        self.assertEqual(vd.is_valid_move(move, board), False)
        move["new_pos"] = {"row": 3, "col": 4}
        self.assertEqual(vd.is_valid_move(move, board), False)
        move["new_pos"] = {"row": 3, "col": 2}
        self.assertEqual(vd.is_valid_move(move, board), False)
        move["new_pos"] = {"row": 2, "col": 3}
        self.assertEqual(vd.is_valid_move(move, board), False)
        move["new_pos"] = {"row": -1, "col": 0}
        self.assertEqual(vd.is_valid_move(move, board), False)
        move["new_pos"] = {"row": 8, "col": 0}
        self.assertEqual(vd.is_valid_move(move, board), False)

    def test_is_valid_move2(self):
        regular = cb.Piece(cb.PieceType.REGULAR, 1, {"row": 3, "col": 3})

        board = cb.Board()
        board.put_piece(regular, {"row": 3, "col": 3})
        move = {
            "old_pos": {"row": 3, "col": 3}
        }

        # Valid moves
        move["new_pos"] = {"row": 2, "col": 4}
        self.assertEqual(vd.is_valid_move(move, board), True)
        move["new_pos"] = {"row": 2, "col": 2}
        self.assertEqual(vd.is_valid_move(move, board), True)

        # Invalid moves
        move["new_pos"] = {"row": 4, "col": 2}
        self.assertEqual(vd.is_valid_move(move, board), False)
        move["new_pos"] = {"row": 4, "col": 4}
        self.assertEqual(vd.is_valid_move(move, board), False)

        regularpiece = cb.Piece(cb.PieceType.REGULAR, 1, {"row": 2, "col": 4})
        board.put_piece(regularpiece, {"row": 2, "col": 4})
        move["new_pos"] = {"row": 4, "col": 4}
        self.assertEqual(vd.is_valid_move(move, board), False)
        move["new_pos"] = {"row": 0, "col": 0}
        self.assertEqual(vd.is_valid_move(move, board), False)
        move["new_pos"] = {"row": 3, "col": 4}
        self.assertEqual(vd.is_valid_move(move, board), False)
        move["new_pos"] = {"row": 3, "col": 2}
        self.assertEqual(vd.is_valid_move(move, board), False)
        move["new_pos"] = {"row": 2, "col": 3}
        self.assertEqual(vd.is_valid_move(move, board), False)
        move["new_pos"] = {"row": -1, "col": 0}
        self.assertEqual(vd.is_valid_move(move, board), False)
        move["new_pos"] = {"row": 8, "col": 0}
        self.assertEqual(vd.is_valid_move(move, board), False)


        # Valid moves  for player 2
        regular2 = cb.Piece(cb.PieceType.REGULAR, 2, {"row": 3, "col": 3})
        board2 = cb.Board()

        board2.put_piece(regular2, {"row": 3, "col": 3})

        move = {
            "old_pos": {"row": 3, "col": 3}
        }

        move["new_pos"] = {"row": 4, "col": 2}
        self.assertEqual(vd.is_valid_move(move, board2), True)

        move["new_pos"] = {"row": 4, "col": 4}
        self.assertEqual(vd.is_valid_move(move, board2), True)

        # Invalid moves
        move["new_pos"] = {"row": 2, "col": 4}
        self.assertEqual(vd.is_valid_move(move, board2), False)
        move["new_pos"] = {"row": 2, "col": 2}
        self.assertEqual(vd.is_valid_move(move, board2), False)

        self.assertEqual(vd.is_valid_move(move, board2), False)
        move["new_pos"] = {"row": 0, "col": 0}
        self.assertEqual(vd.is_valid_move(move, board2), False)
        move["new_pos"] = {"row": 3, "col": 4}
        self.assertEqual(vd.is_valid_move(move, board2), False)
        move["new_pos"] = {"row": 3, "col": 2}
        self.assertEqual(vd.is_valid_move(move, board2), False)
        move["new_pos"] = {"row": 2, "col": 3}
        self.assertEqual(vd.is_valid_move(move, board2), False)
        move["new_pos"] = {"row": -1, "col": 0}
        self.assertEqual(vd.is_valid_move(move, board2), False)
        move["new_pos"] = {"row": 8, "col": 0}
        self.assertEqual(vd.is_valid_move(move, board2), False)
