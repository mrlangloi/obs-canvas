import { useEffect } from 'react'
import './App.css'
import Canvas from './components/Canvas'
import ControlPanel from './components/ControlPanel'
import { SocketProvider } from './contexts/SocketContext'
import useAuthStore from './store/useAuthStore'
import axios from './api/axios'

function App() {

    const setUser = useAuthStore((state) => state.setUser)

    // on app load, check if user is authenticated
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const backendURL = import.meta.env.VITE_BACKEND_URL

                // get user info from backend using the JSESSIONID cookie
                const response = await axios.get(`${backendURL}/api/user`, {
                    // essential line to send the JSESSIONID cookie
                    // it tells the browser to include any cookies to the request (aka JSESSIONID)
                    withCredentials: true 
                })

                if (response.data) {
                    setUser(response.data)
                }

            } catch (err) {
                console.log("Not logged in")
            }
        }

        fetchUser()

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
