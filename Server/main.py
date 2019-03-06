from autobahn.twisted.websocket import WebSocketServerProtocol
from json import loads, dumps, JSONDecodeError
from GameSession import GameSession
from Player import Player

import uuid

games = {}
queue = []
usernames = []

class DummyPlayer():
  def __init__(self, username, websocket=None):
      self.username = username
  def write(self, packet):
      ...


def buildPacket(code, args):
    return dumps({'code': code, **args}).encode()

def handleJoinGame(player, data):
    """Only called for games where a username/id is used?"""
    print('Join event called')

def handleQuitGame(player, data):

    if player.get_session_id():
       sess = games[player.get_session_id()]

       sess.get_player_two().get_websocket().write('Opponent has left the match')

       if games.get(player.get_session_id(), None):
          del games[player.get_session_id()]

       player.session_id = None
       sess.get_player_two().session_id = None

       print('%s has quit match with session id: %s' % (player.username, player.session_id))
       print('Session no longer exists')

def handleMovePiece(player, data):
    ...

def handleJoinQueue(player, data):
    queue.append(DummyPlayer("Test1"))

    if len(queue) > 0:
       player_two = queue.pop(0)
       sess = GameSession(player, player_two, uuid.uuid4().hex)
       games[sess.id] = sess
       player.set_session_id(sess.id)
       player_two.set_session_id(sess.id)
       print('Game session created with users: %s, %s' % (player.username, player_two.username))
    else:
       queue.append(player)
       print('%s joined queue' % player.username)

def handleLeaveQueue(player, data):
    if player in queue:
       queue.remove(player)
       print('%s has left the queue' % player.username)
    else:
       print('Player tried to leave queue but wasn\'t in queue')

def handleSetUsername(player, data):

    username = data['username']

    if username not in usernames:
       player.username = username
       usernames.append(username)
       print('Player is now known as %s' % username)
    else:
       msg = buildPacket(5, {'taken': True})
       player.get_websocket().write(msg)
       print('Player requested a username which is taken')

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

   player = Player(None, None)

   def onConnect(self, req):
       self.player.set_websocket(self.transport)
       print('{peer} connected'.format(peer=req.peer))

   def onClose(self, wasClean, code, reason):

       if self.player.username:
          usernames.remove(self.player.username)
          print('Username: %s is now available' % self.player.username)
       print("WebSocket connection closed: {}".format(reason))

   def onMessage(self, payload, isBinary):
       print('onMessage: {m}'.format(m=payload.decode()))
       self.handleMessage(payload)

   def handleMessage(self, payload):
       try:
           message = loads(payload)

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
