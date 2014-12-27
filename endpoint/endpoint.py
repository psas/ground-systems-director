from flask import Flask
from flask_sockets import Sockets
import json

app = Flask(__name__)
sockets = Sockets(app)


@sockets.route('/')
def echo_socket(ws):
    print "connect"
    while True:
        try:
            message = json.loads(ws.receive())
        except:
            print "json fail"

        print "incoming!: ", message

        if message.get("event", "") == "list":
            print "Got List"
            ws.send(json.dumps({"event": "list", "data": [{"name": "LTC"},{"name": "Mission Time"}]}))

