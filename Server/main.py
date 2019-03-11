"""
Checkers server
"""
from json import loads, dumps, JSONDecodeError
import uuid

from autobahn.twisted.websocket import WebSocketServerFactory
from autobahn.twisted.websocket import WebSocketServerProtocol
from GameSession import GameSession
from Player import Player


GAMES = {}
QUEUE = []
USERNAMES = []


class InvalidDataException(Exception):
    """
    Invalid data exception
    """
    pass

def build_packet(code, args):
    """
    Build a packet using the opcode and arguments
    """
    return dumps({'code': code, **args}).encode()

def handle_join_game(player, _):
    """Only called for games where a username/id is used?"""
    print('Join event called by %s' % player.username)

def handle_quit_game(player, _, disconnected=False):
    """
    Quit game handler
    Check if the user is in a game first, or ignore the packet.
    Also handles disconnects
    """
    if GAMES.get(player.get_session_id(), None):

        sess = GAMES[player.get_session_id()]

        sess.get_player_one().get_websocket().sendMessage(build_packet(6, {}))
        sess.get_player_two().get_websocket().sendMessage(build_packet(6, {}))

        print(GAMES)

        if GAMES.get(player.get_session_id(), None):
            del GAMES[player.get_session_id()]

        print('%s has quit match with session id: %s' % (player.username, player.session_id))

        player.session_id = None
        sess.get_player_two().session_id = None

        if not disconnected:
            player.get_websocket().sendMessage(build_packet(1, {'success': True}))
            print('Session no longer exists')
            print(GAMES)

def handle_move_piece(player, data):
    """
    Move piece handler.
    Check if player is in a game first or discard the packet
    """
    move = {'old_pos': data['old_pos'],
            'new_pos': data['new_pos']}

    print(move)

    if not isinstance(move['old_pos']['row'], int) or \
       not isinstance(move['old_pos']['col'], int) or \
       not isinstance(move['new_pos']['row'], int) or \
       not isinstance(move['new_pos']['col'], int):
        print('Spoofed move')
        return

    sess = GAMES.get(player.session_id, None)

    if sess:

        if not player.session_id == sess.get_player_two().session_id == sess.session_id:
            print('Spoofed move piece')
            return

        print(sess.get_board())

        is_valid, reason = sess.handle_move(move)

        sess.store_hash()

        new_board = sess.get_board()

        print(new_board)

        game_over = False
        draw = False
        winner = ''

        if sess.check_hashes():
            draw = True

        if sess.lost_all_pieces(1):
            game_over = True
            winner = 2

        if sess.lost_all_pieces(2):
            game_over = True
            winner = 1

        # Fix for detecting when a user can't move
        if not sess.can_move(sess.current_turn):
            game_over = True
            if sess.current_turn == 2:
                winner = 1
            else:
                winner = 2

        packet = {'session_id'   : sess.session_id,
                  'current_turn' : sess.current_turn,
                  'board'        : new_board.to_json(),
                  'valid'        : is_valid,
                  'winner'       : winner,
                  'draw'         : draw,
                  'game_over'    : game_over,
                  'reason'       : reason}

        print(packet)

        if sess.get_player_two() == player:
            player.get_websocket().sendMessage(build_packet(2, packet))
            sess.get_player_one().get_websocket().sendMessage(build_packet(2, packet))
        else:
            player.get_websocket().sendMessage(build_packet(2, packet))
            sess.get_player_two().get_websocket().sendMessage(build_packet(2, packet))
    else:
        print('Player is not in a game')

def handle_join_queue(player, _):
    """
    Handle join game
    Todo: possible to double join queue
    """

    player.get_websocket().sendMessage(build_packet(3, {'success': True}))

    if QUEUE:
        player_two = QUEUE.pop(0)
        sess = GameSession(player, player_two, uuid.uuid4().hex)
        GAMES[sess.id] = sess
        player.set_session_id(sess.id)
        player_two.set_session_id(sess.id)

        print('Game session created with users: %s, %s' % (player.username, player_two.username))

        player.get_websocket().sendMessage(build_packet(0, {
            'player_one': player.username,
            'player_two': player_two.username,
            'session_id': sess.id,
            'board': sess.get_board().to_json()}))

        player_two.get_websocket().sendMessage(build_packet(0, {
            'player_one': player.username,
            'player_two': player_two.username,
            'session_id': sess.id,
            'board': sess.get_board().to_json()}))
    else:
        QUEUE.append(player)
        print('%s joined queue' % player.username)

def handle_leave_queue(player, _):
    """
    Handle leave game
    """
    if player in QUEUE:
        QUEUE.remove(player)
        print('%s has left the queue' % player.username)
        player.get_websocket().sendMessage(build_packet(4, {'success': True}))
    else:
        print('Player tried to leave queue but wasn\'t in queue')
        player.get_websocket().sendMessage(build_packet(4, {'success': False}))

def handle_set_username(player, data):
    """
    Handle set username
    """
    username = data['username']

    if username not in USERNAMES:
        player.username = username
        USERNAMES.append(username)
        print('Player is now known as %s' % username)
        player.get_websocket().sendMessage(build_packet(5, {'success': True}))
    else:
        print('Player requested a username which is taken')
        player.get_websocket().sendMessage(build_packet(5, {'success': False}))

def handle_invalid_data(data, _):
    """
    Handle invalid data
    """
    print('Discarding event. Invalid op code %s ' % data)

EVENTS = {
    0 : handle_join_game,
    1 : handle_quit_game,
    2 : handle_move_piece,
    3 : handle_join_queue,
    4 : handle_leave_queue,
    5 : handle_set_username,
    }


class CheckersProtocol(WebSocketServerProtocol):
    """
    The whole checkers protocol
    """
    def __init__(self):
        super().__init__()
        self.player = Player(None, None)

    def onConnect(self, request):
        self.player.set_websocket(self)
        print('{peer} connected'.format(peer=request.peer))

    def onClose(self, wasClean, code, reason):
        if self.player.username:
            if self.player.username in USERNAMES:
                USERNAMES.remove(self.player.username)
                print('Username: %s is now available' % self.player.username)

        handle_leave_queue(self.player, dict())
        handle_quit_game(self.player, dict())
        print("WebSocket connection closed: {}".format(reason))

    def onMessage(self, payload, isBinary):
        print('onMessage: {m}'.format(m=payload.decode()))
        self.handle_message(payload)

    def handle_message(self, payload):
        """
        Handle the received json message.
        Discard it if it is invalid
        """
        try:
            message = loads(payload.decode())

            if not isinstance(message, dict):
                raise InvalidDataException()

        except JSONDecodeError:
            print('Could not parse data')
            return
        except InvalidDataException:
            print('Data wasn\'t formatted properly')
            return
        else:
            EVENTS.get(message['code'], handle_invalid_data)(self.player, message)

if __name__ == '__main__':
    import sys

    from twisted.python import log
    from twisted.internet import reactor

    log.startLogging(sys.stdout)


    FACTORY = WebSocketServerFactory()
    FACTORY.protocol = CheckersProtocol

    reactor.listenTCP(9000, FACTORY)
    reactor.run()
