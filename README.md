# ROS2 E-Stop Web Interface

This project provides a web interface to trigger an emergency stop (e-stop) for a ROS2 system using **rosbridge**, **roslibjs**, **express**, and **socket.io**.

## Dependencies

The following dependencies are required to run this project:

- **rosbridge**: A middleware that provides a JSON API to ROS.
- **roslibjs**: A JavaScript library for interacting with ROS.
- **express**: A fast, unopinionated, minimalist web framework for Node.js.
- **socket.io**: A library for real-time web socket communication.

## Installation

### Prerequisites

- **ROS2 (Humble)** installed and running with `rosbridge_websocket`.
- **Node.js** and **npm** installed. If you don't have them installed, download and install them from [here](https://nodejs.org/en/).

### 1. Set up ROS2 and rosbridge

First, ensure that ROS2 is installed and running on your system.

To install `rosbridge_websocket`, follow these steps:

1. Open a terminal and source your ROS2 environment:

    ```bash
    source /opt/ros/humble/setup.bash
    ```

2. Install `rosbridge_websocket`:

    ```bash
    sudo apt update
    sudo apt install ros-humble-rosbridge-websocket
    ```

3. Launch the rosbridge WebSocket server:

    ```bash
    ros2 launch rosbridge_websocket rosbridge_websocket_launch.xml
    ```

    This will start the WebSocket server that the frontend can connect to.


### 2. Set up the Node.js Server

1. Clone this repository or navigate to your project folder.
2. Install the required dependencies by running the following command:

    ```bash
    npm install
    ```

    This will install the following dependencies listed in the `package.json`:

    - **express**: Web server framework for building the backend.
    - **socket.io**: Real-time communication library for websockets.
    - **roslibjs**: For connecting the frontend with ROS using WebSockets.

### 3. Run the Application

To start the application, run the following command:

```bash
node emergency_stop.js
