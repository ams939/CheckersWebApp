import GameSession as gs

class MatchManager:
    def __init__(self):
        self.queue = []
        self.matches = {}
        self.session_id_counter = 1 # Perhaps better method of generating game session id's needed


    def initialize_match(self, player_one, player_two):
        game_session = gs.GameSession(player_one, player_two, self.session_id_counter)
        self.session_id_counter += 1

    def add_player_to_queue(self, player):
        self.queue.append(player)

    # TODO: Add more functions
