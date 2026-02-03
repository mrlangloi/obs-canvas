import { useState } from 'react'
import './App.css'
import TwitchEmbed from './components/TwitchEmbed'

function App() {
    const [count, setCount] = useState(0)

    return (
        <>
            <div className="container flex items-center justify-center min-h-screen flex-1">
                {/* Control panel for fine-tuning controls */}
                <div className="control-panel bg-gray-600 min-h-screen box-border">
                    <h2 className="text-2xl font-bold">Control Panel</h2>
                </div>

                {/* Main canvas */}
                <div className="main-canvas flex items-center justify-center">
                    <TwitchEmbed />
                </div>
            </div>
        </>
    )
}

export default App
