import { io } from 'socket.io-client'
import { useState, useEffect } from 'react'
import './App.css'
import TwitchEmbed from './components/TwitchEmbed'
import Canvas from './components/Canvas'
import { CardProvider } from './contexts/CardContext'
import ControlPanel from './components/ControlPanel'

const socket = io('http://localhost:5174')

function App() {

    useEffect(() => {
        // testing the backend connection
        socket.on("connect", () => {
            console.log("Connected to backend with socket ID: ", socket.id)
            // send test message to backend
            socket.emit("send_ping", "Hello from frontend!")
        })

        socket.on("server_pong", (data) => {
            console.log("Received: ", data)
        })

        return () => {
            if (socket.connected) {
                socket.emit("Disconnected from socket")
                socket.disconnect()
            }
        }
    }, [])

    return (
        <>
            <CardProvider>
                <div className="container">
                    {/* Control panel for fine-tuning controls */}
                    <ControlPanel />

                    {/* Main canvas */}
                    <Canvas />
                </div>
            </CardProvider>
        </>
    )
}

export default App
