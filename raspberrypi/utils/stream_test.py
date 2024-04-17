import io
import logging
import socketserver
from http import server
from threading import Condition
import utils.common_vars_consts as cvc

PAGE = """\
<html>
<head>
<title>picamera2 MJPEG streaming</title>
</head>
<body style="height:100%;">
<div style="height:100%; width:50%; float: left">
    <h1>Main Camera</h1>
    <img src="stream1.mjpg">
</div>
<div style="height:100%; width:50%; float: left">
    <div style="height:50%;">
        <h1>License plate detection</h1>
        <img src="stream2.mjpg">
    </div>
    <div style="height:50%;">
        <h1>License plate OCR</h1>
        <img src="stream3.mjpg">
    </div>    
</div>
</body>
</html>
"""

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
      self.send_header('Location', '/index.html')
      self.end_headers()
    elif self.path == '/index.html':
      content = PAGE.encode('utf-8')
      self.send_response(200)
      self.send_header('Content-Type', 'text/html')
      self.send_header('Content-Length', len(content))
      self.end_headers()
      self.wfile.write(content)
    elif self.path == '/stream1.mjpg':
      self.send_response(200)
      self.send_header('Age', 0)
      self.send_header('Cache-Control', 'no-cache, private')
      self.send_header('Pragma', 'no-cache')
      self.send_header('Content-Type', 'multipart/x-mixed-replace; boundary=FRAME')
      self.end_headers()
      try:
        while True:
          with stream1.condition:
            stream1.condition.wait()
            frame1 = stream1.frame
          self.wfile.write(b'--FRAME\r\n')
          self.send_header('Content-Type', 'image/jpeg')
          self.send_header('Content-Length', len(frame1))
          self.end_headers()
          self.wfile.write(frame1)
          self.wfile.write(b'\r\n')
      except Exception as e:
        logging.warning(
          'Removed streaming client %s: %s',
          self.client_address, str(e))
    elif self.path == '/stream2.mjpg':
      self.send_response(200)
      self.send_header('Age', 0)
      self.send_header('Cache-Control', 'no-cache, private')
      self.send_header('Pragma', 'no-cache')
      self.send_header('Content-Type', 'multipart/x-mixed-replace; boundary=FRAME2')
      self.end_headers()
      try:
        while True:
          with stream2.condition:
            stream2.condition.wait()
            frame2 = stream2.frame
          self.wfile.write(b'--FRAME2\r\n')
          self.send_header('Content-Type', 'image/jpeg')
          self.send_header('Content-Length', len(frame2))
          self.end_headers()
          if (frame2 is not None):
            self.wfile.write(frame2)
          else:
            self.wfile.write(b'nothing')
          self.wfile.write(b'\r\n')
      except Exception as e:
        logging.warning(
          'Removed streaming client %s: %s',
          self.client_address, str(e))
    elif self.path == '/stream3.mjpg':
      self.send_response(200)
      self.send_header('Age', 0)
      self.send_header('Cache-Control', 'no-cache, private')
      self.send_header('Pragma', 'no-cache')
      self.send_header('Content-Type', 'multipart/x-mixed-replace; boundary=FRAME3')
      self.end_headers()
      try:
        while True:
          with stream3.condition:
            stream3.condition.wait()
            frame3 = stream3.frame
          self.wfile.write(b'--FRAME3\r\n')
          self.send_header('Content-Type', 'image/jpeg')
          self.send_header('Content-Length', len(frame3))
          self.end_headers()
          if (frame3 is not None):
            self.wfile.write(frame3)
          else:
            self.wfile.write(b'nothing')
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

stream1 = StreamingOutput()
stream2 = StreamingOutput()
stream3 = StreamingOutput()
streaming_server = StreamingServer(cvc.STREAMING_SERVER_INFO['address'], StreamingHandler)
