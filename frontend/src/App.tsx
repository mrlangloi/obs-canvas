import { useState } from 'react'
import './App.css'
import TwitchEmbed from './components/TwitchEmbed'

function App() {
    const [count, setCount] = useState(0)

    return (
        <>
            <div className="container">
                {/* Control panel for fine-tuning controls */}
                <aside className="control-panel">
                    <h2 className="control-panel-title">Control Panel</h2>
                </aside>

                {/* Main canvas */}
                <main className="main-canvas">
                    <TwitchEmbed />
                </main>
            </div>
        </>
    )
}

export default App
