import io
import logging
import socketserver
from http import server
from threading import Condition
import raspberrypi.utils.common_vars_consts as cvc

class StreamingOutput(io.BufferedIOBase):
  def __init__(self):
    self.frame = None
    self.condition = Condition()

  def write(self, buf):
    with self.condition:
      self.frame = buf
      self.condition.notify_all()

class StreamingHandler(server.BaseHTTPRequestHandler):
  def do_GET(self):
    if self.path == '/':
      self.send_response(301)
      self.send_header('Location', '/stream')
      self.end_headers()
    elif self.path == '/stream':
      self.send_response(200)
      self.send_header('Age', 0)
      self.send_header('Cache-Control', 'no-cache, private')
      self.send_header('Pragma', 'no-cache')
      self.send_header('Content-Type', 'multipart/x-mixed-replace; boundary=FRAME')
      self.end_headers()
      try:
        while True:
          with stream.condition:
            stream.condition.wait()
            frame = stream.frame
          self.wfile.write(b'--FRAME\r\n')
          self.send_header('Content-Type', 'image/jpeg')
          self.send_header('Content-Length', len(frame))
          self.end_headers()
          self.wfile.write(frame)
          self.wfile.write(b'\r\n')
      except Exception as e:
        logging.warning(
          'Removed streaming client %s: %s',
          self.client_address, str(e))
    else:
      self.send_error(404)
      self.end_headers()

class StreamingServer(socketserver.ThreadingMixIn, server.HTTPServer):
  allow_reuse_address = True
  daemon_threads = True

stream = StreamingOutput()
streaming_server = StreamingServer(cvc.STREAMING_SERVER_INFO['address'], StreamingHandler)