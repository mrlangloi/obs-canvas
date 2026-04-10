// SocketContext.tsx
import { createContext, useContext, type ReactNode, useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'

const SocketContext = createContext<Socket | undefined>(undefined)

export const SocketProvider = ({ children }: { children: ReactNode }) => {
    // useRef ensures the socket instance is stable across re-renders
    const socket = useRef(io(import.meta.env.VITE_API_URL))

    useEffect(() => {
        const s = socket.current

        const onConnect = () => {
            console.log("Connected to Socket.IO server with ID:", s.id)
            s.emit("send_ping", "Hello from frontend!")
        }

        s.on("connect", onConnect)

        if (s.connected) {
            onConnect()
        }

        return () => {
            s.off("connect", onConnect)
        }
    }, [])

    return (
        <SocketContext.Provider value={socket.current}>
            {children}
        </SocketContext.Provider>
    )
}

export const useSocket = () => {
    const context = useContext(SocketContext)

    if (context === undefined)
        throw new Error('useSocket must be used within SocketProvider')

    return context
}