# -*- coding: utf-8 -*-
import asyncio
from asyncio.subprocess import PIPE
import websockets


@asyncio.coroutine
def websocket(websocket, path):

    procs = Procc()

    while True:

        message = yield from websocket.recv()
        if message is None:
            break


if __name__ == '__main__':
    start_server = websockets.serve(websocket, 'localhost', 8675)
    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()
