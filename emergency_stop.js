const ROSLIB = require("roslib");
const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const sleep = (sleepTime = 1_000) => new Promise((resolve, _reject) => setTimeout(resolve, sleepTime));

const ros = new ROSLIB.Ros({
	url: "ws://localhost:9090"
});

ros.on("connection", () => {
	console.log("Connected to websocket server");
});

ros.on("close", () => {
	console.log("Connection to websocket server closed")
});

ros.on("error", () => {
	console.log("There was an error connection to the websocket server...");

});

let triggerEStop = true;

const eStopTopic = new ROSLIB.Topic({
	ros,
	name: "/e_stop",
	"messageType": "std_msgs/Bool"
});

const triggerEStopTopic = new ROSLIB.Topic({
	ros,
	name: "/trigger_estop",
	"messageType": "std_msgs/Bool"
});

/** @type {Map<string, boolean>} */
const map = new Map();

async function publishLoop() {
	while (true) {
		if (map.size) {
			triggerEStop = ![...map.values()].every(val => val === false);
		} else  {
			triggerEStop = true
		}
		
		triggerEStopTopic.publish({ data: triggerEStop });
		await sleep(250);
	}
}

publishLoop();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
	pingInterval: 5000,
	pingTimeout: 2_500
});

eStopTopic.subscribe(message => {
	io.sockets.emit("e_stop_state", { state: message.data });
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs")


io.on("connection", socket => {
	console.log("Client connected", socket.id);
	triggerEStopTopic.publish({ data: true });
	map.set(socket.id, true);

	socket.on("release_estop", _ => {
		map.set(socket.id, false);
		console.log("release", triggerEStop);
	});

	socket.on("set_estop", _ => {
		console.log("set");
		triggerEStopTopic.publish({ data: true });
		triggerEStop = true;
		map.set(socket.id, true);
	});

	socket.on("disconnect", reason => {
		console.log(`${socket.id} disconnected: ${reason}`);
		map.delete(socket.id);
		// if all connections die, trigger the e stop
		if (map.size === 0) {
			triggerEStop = true;
			triggerEStopTopic.publish({ data: true });
			console.log("No one is connected, triggering e-stop");
		}
	})

	socket.send("Hello from server!");
});

app.get("/", (req, res) => {
	res.render("index")
});



const port = 5000;
server.listen(port, () => console.log(`Listening on port ${port}`));
