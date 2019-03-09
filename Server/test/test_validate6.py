from unittest import TestCase
from Server import GameSession as gs
from Server import Player as p
from Server import Validator as vd

class TestValidate(TestCase):
    def test_validate(self):
        p1 = p.Player("Hank", 2)
        p2 = p.Player("Bob", 1)

        game = gs.GameSession(p1, p2, 1)

        # Default board
        board = game.get_board()

        move = {"old_pos": {"row": 5, "col": 1}, "new_pos": {"row":4, "col":2}}

        self.assertEqual(vd.validate(move, board), True)

        move = {"old_pos": {"row": 2, "col": 4}, "new_pos": {"row": 3, "col": 3}}
        self.assertEqual(vd.validate(move, board), True)
        move = {"old_pos": {"row": 2, "col": 4}, "new_pos": {"row": 3, "col": 5}}
        self.assertEqual(vd.validate(move, board), True)

        move = {"old_pos": {"row": 2, "col": 4}, "new_pos": {"row": 1, "col": 5}}
        self.assertEqual(vd.validate(move, board), False)

        move = {"old_pos": {"row": 6, "col": 4}, "new_pos": {"row": 5, "col": 3}}
        self.assertEqual(vd.validate(move, board), False)
