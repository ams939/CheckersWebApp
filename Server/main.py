from autobahn.twisted.websocket import WebSocketServerProtocol
from json import loads, dumps, JSONDecodeError
from GameSession import GameSession
from Player import Player
from CheckersBoard import Board
import uuid

games = {}
queue = []
usernames = []

class DummyTransport():
  def __init__(self):
      pass
  def sendMessage(self, text):
      return

class DummyPlayer():
  def __init__(self, username, websocket=None):
      self.username = username

  def get_websocket(self):
      return DummyTransport()

  def set_session_id(self, id):
      self.session_id = id

def buildPacket(code, args):
    return dumps({'code': code, **args}).encode()

def handleJoinGame(player, data):
    """Only called for games where a username/id is used?"""
    print('Join event called')

def handleQuitGame(player, data, disconnected=False):

    if games.get(player.get_session_id(), None):
       sess = games[player.get_session_id()]

       sess.get_player_two().get_websocket().sendMessage(buildPacket(6, {}))

       print(games)

       if games.get(player.get_session_id(), None):
          del games[player.get_session_id()]

       print('%s has quit match with session id: %s' % (player.username, player.session_id))

       player.session_id = None
       sess.get_player_two().session_id = None

       if not disconnected:
          player.get_websocket().sendMessage(buildPacket(1, {'success': True}))
          print('Session no longer exists')
          print(games)

def handleMovePiece(player, data):
    #move = {'old_pos': {'row': data['pos'][0],
    #                    'col': data['pos'][1]},
    #        'new_pos': {'row': data['new_pos'][0],
    #                    'col': data['new_pos'][1]}}

    move = {'old_pos': data['old_pos'],
            'new_pos': data['new_pos']}

    print(move)

    #validate both player's session_ids are the same and they match the one in the packet
    #validate the coordinates are integers

    #No validation yet
    sess = games.get(player.session_id, None)

    if sess:

       print(sess.get_board())
       sess.move_piece(move)
       new_board = sess.get_board()
       print(new_board)

       sess.change_turn()

       packet = {'session_id'   : sess.session_id,
                 'current_turn' : sess.current_turn,
                 'board'        : new_board.to_json(),
                 'valid'        : True}

       if sess.get_player_two() == player:
          player.get_websocket().sendMessage(buildPacket(2, packet))
          sess.get_player_one().get_websocket().sendMessage(buildPacket(2, packet))
       else:
          player.get_websocket().sendMessage(buildPacket(2, packet))
          sess.get_player_two().get_websocket().sendMessage(buildPacket(2, packet))
    else:
       print('Player is not in a game')

def handleJoinQueue(player, data):
    #queue.append(DummyPlayer("Test1"))
    #todo: possible to double join queue

    player.get_websocket().sendMessage(buildPacket(3, {'success': True}))

    if len(queue) > 0:
       player_two = queue.pop(0)
       sess = GameSession(player, player_two, uuid.uuid4().hex)
       games[sess.id] = sess
       player.set_session_id(sess.id)
       player_two.set_session_id(sess.id)
       print('Game session created with users: %s, %s' % (player.username, player_two.username))

       player.get_websocket().sendMessage(buildPacket(0, {
                                                    'player_one': player.username,
                                                    'player_two': player_two.username,
                                                    'session_id': sess.id,
                                                    'board': sess.get_board().to_json()}))

       player_two.get_websocket().sendMessage(buildPacket(0, {
                                                    'player_one': player.username,
                                                    'player_two': player_two.username,
                                                    'session_id': sess.id,
                                                    'board': sess.get_board().to_json()}))
    else:
       queue.append(player)
       print('%s joined queue' % player.username)

def handleLeaveQueue(player, data):
    if player in queue:
       queue.remove(player)
       print('%s has left the queue' % player.username)
       player.get_websocket().sendMessage(buildPacket(4, {'success': True}))
    else:
       print('Player tried to leave queue but wasn\'t in queue')
       player.get_websocket().sendMessage(buildPacket(4, {'success': False}))

def handleSetUsername(player, data):

    username = data['username']

    if username not in usernames:
       player.username = username
       usernames.append(username)
       print('Player is now known as %s' % username)
       player.get_websocket().sendMessage(buildPacket(5, {'success': True}))
    else:
       print('Player requested a username which is taken')
       player.get_websocket().sendMessage(buildPacket(5, {'success': False}))

def invalidData(transport, _):
    print('Discarding event. Invalid op code')

_events = {
            0 : handleJoinGame,
            1 : handleQuitGame,
            2 : handleMovePiece,
            3 : handleJoinQueue,
            4 : handleLeaveQueue,
            5 : handleSetUsername,
          }


class CheckersProtocol(WebSocketServerProtocol):


   def __init__(self):
       super().__init__()
       self.player = Player(None, None)

   def onConnect(self, req):
       self.player.set_websocket(self)
       print('{peer} connected'.format(peer=req.peer))

   def onClose(self, wasClean, code, reason):

       if self.player.username:
          if self.player.username in usernames:
             usernames.remove(self.player.username)
             print('Username: %s is now available' % self.player.username)

       handleQuitGame(self.player, dict())
       print("WebSocket connection closed: {}".format(reason))

   def onMessage(self, payload, isBinary):
       print('onMessage: {m}'.format(m=payload.decode()))
       self.handleMessage(payload)

   def handleMessage(self, payload):
       try:
           message = loads(payload.decode())

           if type(message) != dict:
              raise Exception('Invalid data')

       except JSONDecodeError:
           print('Could not parse data')
           return
       except Exception:
           print('Data wasn\'t formatted properly')
           return
       else:
           _events.get(message['code'], invalidData)(self.player, message)

if __name__ == '__main__':

   import sys

   from twisted.python import log
   from twisted.internet import reactor

   log.startLogging(sys.stdout)

   from autobahn.twisted.websocket import WebSocketServerFactory

   factory = WebSocketServerFactory()
   factory.protocol = CheckersProtocol

   reactor.listenTCP(9000, factory)
   reactor.run()
