// src/services/socket.js
import { io } from "socket.io-client";

const BACKEND_URL = "https://your-backend.example.com"; // change later
const socket = io(BACKEND_URL, { transports: ["websocket"] });

export default socket;
