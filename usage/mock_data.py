import shelve
import requests

async_mode = "threading"
if async_mode is None:
    try:
        import eventlet
        async_mode = 'eventlet'
    except ImportError:
        pass

    if async_mode is None:
        try:
            from gevent import monkey
            async_mode = 'gevent'
        except ImportError:
            pass

    if async_mode is None:
        async_mode = 'threading'

    print('async_mode is ' + async_mode)

# monkey patching is necessary because this application uses a background
# thread
if async_mode == 'eventlet':
    import eventlet
    eventlet.monkey_patch()
elif async_mode == 'gevent':
    from gevent import monkey
    monkey.patch_all()

import time,random
import sys
from threading import Thread
from threading import Event
from flask import Flask, render_template, session, request
#import flask
from flask_socketio import SocketIO, emit, join_room, leave_room, \
    close_room, rooms, disconnect
app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, async_mode=async_mode)

thread = Thread()
thread_stop_event = Event()

class LiveData(Thread):
    def __init__(self):
        self.delay = 1
        super(LiveData, self).__init__()

    def get_data(self):
        while not thread_stop_event.isSet():
            power = round(760 + random.uniform(-150,150) ,1)
            timestamp = int(time.time())
            socketio.emit('my response', {'value': power,'timestamp':timestamp*1000 }, namespace='/test')
            #db=shelve.open('usage.shelve')
            #db['value'] = db['value'] + power

            time.sleep(self.delay)

    def run(self):
        self.get_data()

    def stop(self):
        self.stopped = True

@socketio.on('connect', namespace='/test')
def test_connect():
    #emit('my response', {'data': 'Power', 'count': random.random() })
    global thread
    global thread_stop_event
    if not thread.isAlive():
        print "Starting Thread"
        thread_stop_event = Event()
        thread = LiveData()
        thread.start()


@socketio.on('disconnect request', namespace='/test')
def disconnect_request():
    thread_stop_event.set()
    disconnect()


if __name__ == '__main__':
    try:
        socketio.run(app,host="0.0.0.0",port=8081)
    except (KeyboardInterrupt, SystemExit) as e :
        global thread
        thread.stop()
        sys.exit()


