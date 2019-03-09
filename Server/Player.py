"""
Drexel University - CS451 Checkers Web Application
Authors: Alex Sladek, Brian Stump, Eric Szabo, Philip Stephenson
3.3.2019
Player.py - Python module with class that represents a player
Python v. 3.7.1
"""


class Player:
    """
    Player object, initialized with username string and Websocket object as arguments
    """

    def __init__(self, username, websocket):
        self.username = username
        self.websocket = websocket # Websocket object
        self.session_id = None


    def set_session_id(self, new_session_id):
        """
        :param new_session_id: String
        :return: None
        """
        self.session_id = new_session_id

    def get_session_id(self):
        """
        :return: String
        """
        return self.session_id


    def get_websocket(self):
        """
        :return: Websocket Object
        """
        return self.websocket


    def set_websocket(self, new_websocket):
        """
        :param new_websocket: Websocket object
        :return: None
        """
        self.websocket = new_websocket


    def to_json(self):
        """
        Converts object to json
        :return: json object
        """
        player_dict = {}
        player_dict["username"] = self.username
        player_dict["session_id"] = self.session_id
        return player_dict
    