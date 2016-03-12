'''
Created on Mar 12, 2016

@author: manish_kelkar
'''
async_mode = None
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

import numpy
import pyaudio
import analyse


#pyaud = pyaudio.PyAudio()
#stream = pyaud.open( format = pyaudio.paInt16, channels = 1, rate = 44100, input_device_index = 1, input = True)
#stream = pyaud.open( format = pyaudio.paInt16, channels = 1, rate = 44100,  input = True, frames_per_buffer= 44100)

class LiveData(Thread):
    def __init__(self):
        self.delay = 1
        super(LiveData, self).__init__()

    def live_thread(self):
        """
        Generate a random number every 1 second and emit to a socketio instance (broadcast)
        Ideally to be run in a separate thread?
        """
        #infinite loop of magical random numbers
        print "Making random numbers"
        pyaud = pyaudio.PyAudio()
        stream = pyaud.open( format = pyaudio.paInt16, channels = 1, rate = 44100,  input = True, frames_per_buffer= 44100)
        while not thread_stop_event.isSet():
            #number = random.randint(0,50)
            # Read raw microphone data
            rawsamps = stream.read(44100)
            # Convert raw data to NumPy array
            samps = numpy.fromstring(rawsamps, dtype=numpy.int16)
            # Show the volume and pitch
            current= round(abs(-1.15 + 47/abs(analyse.loudness(samps))), 2)
            print ("%f" % current)
            w = numpy.fft.fft(samps)
            freqs = numpy.fft.fftfreq(len(w))
            idx = numpy.argmax(numpy.abs(w))
            freq = freqs[idx]
            #print abs(freq*44100)
            voltage= 230
            if current < 0.5:
                power=0
            else :
                power = round(abs(current * voltage),1)
            print "Power %s " % power
            import time
            timestamp = int(time.time())
            socketio.emit('my response', {'value': power,'timestamp':timestamp*1000 }, namespace='/test')
            #time.sleep(self.delay)

    def run(self):
        self.live_thread()

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
    #session['receive_count'] = session.get('receive_count', 0) + 1
    #emit('my response',
    #     {'data': 'Disconnected!', 'count': session['receive_count']})
    thread_stop_event.set()
    disconnect()

if __name__ == '__main__':
    try:
        socketio.run(app,host="0.0.0.0",port=8080)
    except (KeyboardInterrupt, SystemExit) as e :
        global thread
        thread.stop()
        sys.exit()

