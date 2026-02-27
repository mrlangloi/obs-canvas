import { useState } from 'react'
import './App.css'
import TwitchEmbed from './components/TwitchEmbed'
import Canvas from './components/Canvas'

function App() {
    const [count, setCount] = useState(0)
    const [showPanel, setShowPanel] = useState(true)

    return (
        <>
            <div className="container">
                {/* Control panel for fine-tuning controls */}
                <aside className={`control-panel ${!showPanel ? 'hidden' : ''}`}>
                    {/* The button is now inside the panel */}
                    <button className="toggle-tab" onClick={() => setShowPanel(!showPanel)}>
                        {showPanel ? '◀' : '▶'}
                    </button>
                    <h2 className="control-panel-title">Control Panel</h2>
                </aside>

                {/* Main canvas */}
                <Canvas />
            </div>
        </>
    )
}

export default App
