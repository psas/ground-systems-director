from flask import Flask
from flask_sockets import Sockets
import psutil
import json

app = Flask(__name__)
sockets = Sockets(app)

services = []


@sockets.route('/')
def echo_socket(ws):
    print "connect"
    while True:
        try:
            message = json.loads(ws.receive())
        except:
            print "json fail"

        print "incoming!: ", message

        if message.get("event", "") == "heartbeat":
            cpu = psutil.cpu_times_percent(interval=1)
            ram = psutil.virtual_memory().percent
            data = {'cpu': cpu.user + cpu.system, 'ram': ram}
            s = []
            for service in services:
                s.append({'name': service['service'], 'pid': 0})
            data['services'] = s
            ws.send(json.dumps({'event': "heartbeat", 'data': data}))


def run(config, service_config):
    global services
    app.config.from_pyfile(config)
    with open(service_config, 'r') as fin:
        services = json.loads(fin.read())
    print services
    return app
