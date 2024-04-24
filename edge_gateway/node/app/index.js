const express = require('express');
const multer = require('multer');
const mqtt = require("mqtt");


const client = mqtt.connect('mqtt://mqtt_broker:1883', {
  clientId: `mqtt_${Math.random().toString(16).slice(3)}`,
  clean: true,
  connectTimeout: 4000,
  username: 'iot',
  password: '123456',
  reconnectPeriod: 1000,
})

client.on("connect", () => {
  client.subscribe("test_topic", (err) => {
    if (err) {
      console.log(err)
    } else {
      console.log('mqtt connected!')
    }
    client.on('message', function(topic, message, packet) {
      console.log('topic: '+topic)
      console.log('message: '+message)
    });
  });
});

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '/storage/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage })

const app = express ();
port = 8800
app.listen(port, () => {
  console.log("Server Listening on port:", port);
});

app.post('/data',upload.single('log'),(req,res)=>{
  const data = JSON.parse(JSON.stringify(req.body));
  console.log(`direction: ${data.direction}`);
  console.log(`license-plate: ${data.lp_part1}-${data.lp_part2}`);
  console.log(`saved file at: ${req.file.path}`)
  res.status(200).json("okla")
})