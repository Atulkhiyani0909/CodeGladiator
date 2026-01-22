import { create } from "zustand";

interface SocketState {
    socket: WebSocket | null;
    isConnected: boolean; 
    connect: (userId: string) => void; 
    disconnect: () => void;
}

export const useSocket = create<SocketState>((set, get) => ({
    socket: null,
    isConnected: false,

    connect: (userId: string) => {
        const currentSocket = get().socket;


        if (currentSocket && (currentSocket.readyState === WebSocket.OPEN || currentSocket.readyState === WebSocket.CONNECTING)) {
             console.log(" Socket already active. Skipping connection.");
             return;
        }

        console.log("🔌 Connecting to WebSocket...");
        const newSocket = new WebSocket(`ws://localhost:8080?userId=${userId}`);

        newSocket.onopen = () => {
            console.log(" WebSocket Connected");
            set({ isConnected: true }); 
        };

        newSocket.onclose = () => {
            console.log(" WebSocket Disconnected");
            set({ socket: null, isConnected: false });
        };

      
        set({ socket: newSocket });
    },

    disconnect: () => {
        const { socket } = get();
        if (socket) {
            socket.close();
        }
        set({ socket: null, isConnected: false });
    },
}));