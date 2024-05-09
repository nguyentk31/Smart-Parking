::docker run -it --rm --name mynode --net edge_network -p 8800:8800 -v %cd%\app\:/app -v %cd%\storage\:/storage -w /app node:20 /bin/bash
docker run -it --rm --name mynode --net edge_network -p 8800:8800 -v %cd%\app\:/app -v %cd%\storage\:/storage -w /app node:20 npm start
pause