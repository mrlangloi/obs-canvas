import './App.css'
import Canvas from './components/Canvas'
import ControlPanel from './components/ControlPanel'
import { SocketProvider } from './contexts/SocketContext'

function App() {

    return (
        <>
            <SocketProvider>
                <div className="container">
                    {/* Control panel for fine-tuning controls */}
                    <ControlPanel />

                    {/* Main canvas */}
                    <Canvas />
                </div>
            </SocketProvider>
        </>
    )
}

export default App
