# -*- coding: utf-8 -*-
import asyncio
import psutil


def monitor():
    """Monitor the system this machine is running on.

    :returns CPU and RAM usage persentage in an object:

    """

    cpu = psutil.cpu_times_percent(interval=0.0)
    ram = psutil.virtual_memory().percent

    return {'cpu': cpu.user + cpu.system, 'ram': ram}
