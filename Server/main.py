from autobahn.twisted.websocket import WebSocketServerProtocol
from json import loads, JSONDecodeError

def handleJoinGame(transport, data):
    print('Join event called')

def handleQuitGame(transport, data):
    print('Quit event called')

def handleMovePiece(transport, data):
    ...

def invalidData(transport, _):
    print('Discarding event. Invalid op code')


_events = {
            0 : handleJoinGame,
            1 : handleQuitGame,
            2 : handleMovePiece,
          }


class ChessProtocol(WebSocketServerProtocol):

   def onConnect(self, req):
       print('{peer} connected'.format(peer=req.peer))

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
           _events.get(message['code'], invalidData)(self.transport, message)


if __name__ == '__main__':

   import sys

   from twisted.python import log
   from twisted.internet import reactor

   log.startLogging(sys.stdout)

   from autobahn.twisted.websocket import WebSocketServerFactory

   factory = WebSocketServerFactory()
   factory.protocol = ChessProtocol

   reactor.listenTCP(9000, factory)
   reactor.run()
