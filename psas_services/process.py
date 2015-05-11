# -*- coding: utf-8 -*-
import asyncio
import psutil


class Performance(object):

    def __init__(self):
        pass

    def measure(self):
        cpu = psutil.cpu_times_percent(interval=1)
        ram = psutil.virtual_memory().percent
        return {'cpu': cpu.user + cpu.system, 'ram': ram}
