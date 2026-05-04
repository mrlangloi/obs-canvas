import { useEffect } from 'react'
import './App.css'
import Canvas from './components/Canvas'
import ControlPanel from './components/ControlPanel'
import { SocketProvider } from './contexts/SocketContext'
import api from './api/axios'
import useAuthStore from './store/useAuthStore'

function App() {

    const setUser = useAuthStore((state) => state.setUser)

    // on app load, check if user is authenticated
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await api.get('/auth/check')
                setUser(response.data)
            } catch (error) {
                console.error('Error checking authentication:', error)
                setUser(null)
            }
        }

        checkAuth()

    }, [setUser])

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
