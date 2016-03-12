'''
Created on Mar 12, 2016

@author: manish_kelkar
'''

import numpy
import pyaudio
import analyse


pyaud = pyaudio.PyAudio()
#stream = pyaud.open( format = pyaudio.paInt16, channels = 1, rate = 44100, input_device_index = 1, input = True)
stream = pyaud.open( format = pyaudio.paInt16, channels = 1, rate = 44100,  input = True, frames_per_buffer= 44100)


while True:
        # Read raw microphone data
        rawsamps = stream.read(44100)
        # Convert raw data to NumPy array
        samps = numpy.fromstring(rawsamps, dtype=numpy.int16)
        # Show the volume and pitch
        print ("%.2f" % (-1.15 + 47/abs(analyse.loudness(samps) ) ) )
        w = numpy.fft.fft(samps)
        freqs = numpy.fft.fftfreq(len(w))
        idx = numpy.argmax(numpy.abs(w))
        freq = freqs[idx]
        #print abs(freq*44100)
