import axios from "axios"
import { create } from "zustand"

interface SocketState {
    socket: WebSocket | null;
    connect: (token: string) => void;
    disconnect: () => void;
}

export const useSocket = create<SocketState>((set, get) => ({
    socket: null,
    connect: (token: string) => {

        if (get().socket) return;

        console.log(" Connecting to WebSocket...");


        const newSocket = new WebSocket(`ws://localhost:8080?token=${token}`);

        newSocket.onopen = () => {
            console.log(" WebSocket Connected");
        };

        newSocket.onclose = () => {
            console.log(" WebSocket Disconnected");
            set({ socket: null });
        };


        set({ socket: newSocket });
    },

    disconnect: () => {
        const { socket } = get();
        if (socket) {
            socket.close();
            set({ socket: null });
        }
    }
}))