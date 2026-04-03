package com.ricky.obscanvas.config;

import com.corundumstudio.socketio.SocketIOServer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SocketIOConfig {

    @Bean
    public SocketIOServer socketIOServer() {
        com.corundumstudio.socketio.Configuration config = new com.corundumstudio.socketio.Configuration();
        config.setHostname("localhost");
        // where the Socket.io traffic will live
        config.setPort(5174);
        
        // this allows the frontend to talk to this port
        config.setOrigin("http://localhost:5173");

        // CORS settings to allow the frontend to talk to this port
        config.setAllowHeaders("Content-Type, Authorization, x-requested-with");
        
        return new SocketIOServer(config);
    }
}