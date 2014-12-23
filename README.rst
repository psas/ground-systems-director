=======================
Ground Systems Director
=======================

The Ground Systems Director (**GSD**) is a protocol and a screen to coördinate
running all the various services used in carrying out a launch in the desert.


Server End And Front End
========================

There are two halves of the GSD service, a front end web page that is the
control, and a back end which runs on each and every machine that might be
running a Ground Systems Service.

The front end becomes a single place to start, stop, and monitor any PSAS
service on the ground network.

The back end is a simple endpoint websocket that returns data about the services
on the machine it's running on as a heartbeat.

Configuration is done with yaml files.
