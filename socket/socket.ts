import { io } from "socket.io-client";

export const tradeSocket = io(process.env.API_URL!);