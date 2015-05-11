# -*- coding: utf-8 -*-
import asyncio
import websockets
import json
from process import Performance

@asyncio.coroutine
def websocket(websocket, path):
    """Asyncronus websocket handler
    """

    # initilize
    perf = Performance()

    # once per second meausure and send current system performance
    while True:
        performance = perf.measure()
        if not websocket.open:
            break
        yield from websocket.send(json.dumps({'event': "heartbeat", 'data': performance}))
        yield from asyncio.sleep(1)


    while True:

        message = yield from websocket.recv()
        if message is None:
            break
        print("< {}".format(message))

if __name__ == '__main__':
    start_server = websockets.serve(websocket, 'localhost', 8675)
    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()
