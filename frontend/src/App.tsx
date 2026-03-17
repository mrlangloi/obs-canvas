import { useState } from 'react'
import './App.css'
import TwitchEmbed from './components/TwitchEmbed'
import Canvas from './components/Canvas'
import { CardProvider } from './contexts/CardContext'
import ControlPanel from './components/ControlPanel'

function App() {

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
