# Drexel University - CS451 Checkers Web Application
# Authors: Alex Sladek, Brian Stump, Eric Szabo, Philip Stephenson
# 3.3.2019
#
#
# Player.py - Python module with class that represents a player
#
# Python v. 3.7.1
#
#


# Player object, initialized with username string and Websocket object as arguments
class Player:
    def __init__(self, username, websocket):
        self.username = username
        self.websocket = websocket # Websocket object
        self.session_id = None


    # Function for checking if user is still connected
    def is_connected(self):
        # TODO: Define function behavior for checking if user connected
        return True

    def set_session_id(self, new_session_id):
        self.session_id = new_session_id

    def get_session_id(self):
        return self.session_id

    def get_websocket(self):
        return self.websocket

    def set_websocket(self, new_websocket):
        self.websocket = new_websocket

    def to_json(self):
        d = {}
        d["username"] = self.username
        d["session_id"] = self.session_id
        return d


