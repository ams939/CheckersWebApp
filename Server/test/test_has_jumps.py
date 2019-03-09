from unittest import TestCase
from Server import Validator as vd
from Server import CheckersBoard as cb


class TestHas_jumps(TestCase):
    def test_has_jumps(self):
        regular = cb.Piece(cb.PieceType.REGULAR, 1, {"row": 5, "col": 5})

        board = cb.Board()
        board.put_piece(regular, {"row": 5, "col": 5})

        piece1 = cb.Piece(cb.PieceType.REGULAR, 2, {"row": 4, "col": 6})
        piece2 = cb.Piece(cb.PieceType.REGULAR, 2, {"row": 4, "col": 4})

        board.put_piece(piece1, {"row": 4, "col": 6})
        board.put_piece(piece2, {"row": 4, "col": 4})

        print(vd.has_jumps({"row": 5, "col": 5}, board))

        regular = cb.Piece(cb.PieceType.REGULAR, 2, {"row": 2, "col": 2})

        board = cb.Board()
        board.put_piece(regular, {"row": 2, "col": 2})

        piece1 = cb.Piece(cb.PieceType.REGULAR, 1, {"row": 3, "col": 1})
        piece2 = cb.Piece(cb.PieceType.REGULAR, 1, {"row": 3, "col": 3})

        board.put_piece(piece1, {"row": 3, "col": 1})
        board.put_piece(piece2, {"row": 3, "col": 3})

        print(vd.has_jumps({"row": 2, "col": 2}, board))

        board.put_piece(piece2, {"row": 4, "col": 4})
        print(vd.has_jumps({"row": 2, "col": 2}, board))


    def test_k_has_jumps(self):
        kingpiece = cb.Piece(cb.PieceType.KING, 1, {"row": 3, "col": 3})

        board = cb.Board()
        board.put_piece(kingpiece, {"row": 3, "col": 3})

        # dummy pieces
        piece1 = cb.Piece(cb.PieceType.KING, 2, {"row": 2, "col": 4})
        piece2 = cb.Piece(cb.PieceType.KING, 2, {"row": 4, "col": 4})
        piece3 = cb.Piece(cb.PieceType.KING, 2, {"row": 4, "col": 2})
        piece4 = cb.Piece(cb.PieceType.KING, 2, {"row": 2, "col": 2})

        board.put_piece(piece1, {"row": 2, "col": 4})
        board.put_piece(piece2, {"row": 4, "col": 4})
        board.put_piece(piece3, {"row": 4, "col": 2})
        board.put_piece(piece4, {"row": 2, "col": 2})

        print(vd.has_jumps({"row": 3, "col": 3}, board))

        self.assertEqual(vd.has_jumps({"row": 3, "col": 3}, board),
                         [{'row': 5, 'col': 1},
                          {'row': 5, 'col': 5},
                          {'row': 1, 'col': 5},
                          {'row': 1, 'col': 1}])


        kingpiece2 = cb.Piece(cb.PieceType.KING, 1, {"row": 7, "col": 7})
        board.put_piece(kingpiece2, {"row": 7, "col": 7})
        print(vd.has_jumps({"row": 7, "col": 7}, board))
        self.assertEqual(vd.has_jumps({"row": 7, "col": 7}, board), [])

        kingpiece = cb.Piece(cb.PieceType.KING, 1, {"row": 3, "col": 3})

        board = cb.Board()
        board.put_piece(kingpiece, {"row": 3, "col": 3})
        piece1 = cb.Piece(cb.PieceType.KING, 2, {"row": 2, "col": 4})
        piece2 = cb.Piece(cb.PieceType.KING, 1, {"row": 4, "col": 4})

        board.put_piece(piece1, {"row": 2, "col": 4})
        board.put_piece(piece2, {"row": 4, "col": 4})

        print(vd.has_jumps({"row": 3, "col": 3}, board))
        self.assertEqual(vd.has_jumps({"row": 3, "col": 3}, board), [{'row': 1, 'col': 5}])
