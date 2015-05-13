# -*- coding: utf-8 -*-
import asyncio
import websockets
import json
import process


@asyncio.coroutine
def heartbeat(websocket):
    """Send a heartbeat packet to the websocket.

    :param websocket websocket:

    """

    while True:

        # Measure current system performace
        performance = process.monitor()

        # TODO: store services somewhere else, look them up here and find if they're running
        performance['services'] = [
          {
            "service": "LS",
            "type": "shell",
            "path": "/home/natronics/PSAS/FlightComputer/test-logs/",
            "run": "/bin/ls",
            "arglist": ["-la"]
          }
        ]

        if websocket.open:
            yield from websocket.send(json.dumps({'event': "heartbeat", 'data': performance}))

        yield from asyncio.sleep(1)


@asyncio.coroutine
def websocket(websocket, path):
    """Websocket handler. Delegates tasks when asked
    """

    # Start the heartbeat service
    asyncio.async(heartbeat(websocket))

    # Listen for messages
    while True:
        message = yield from websocket.recv()
        if message is None:
            break
        print("< {}".format(message))


if __name__ == '__main__':
    loop = asyncio.get_event_loop()
    server = websockets.serve(websocket, 'localhost', 8675)
    loop.run_until_complete(server)
    try:
        loop.run_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.close()
        loop.close()
