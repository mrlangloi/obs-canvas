import './App.css'
import Canvas from './components/Canvas'
import { CardProvider } from './contexts/CardContext'
import ControlPanel from './components/ControlPanel'
import { SocketProvider } from './contexts/SocketContext'

function App() {

    return (
        <>
            <SocketProvider>
                <CardProvider>
                    <div className="container">
                        {/* Control panel for fine-tuning controls */}
                        <ControlPanel />

                        {/* Main canvas */}
                        <Canvas />
                    </div>
                </CardProvider>
            </SocketProvider>
        </>
    )
}

export default App
