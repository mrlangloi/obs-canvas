package com.ricky.obscanvas.config;

import com.corundumstudio.socketio.SocketIOServer;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SocketIOConfig {

    @Value("${app.frontend.url}")
    private String frontendURL;

    @Value("${socket.server.port}")
    private int socketServerPort;

    @Bean
    public SocketIOServer socketIOServer() {
        com.corundumstudio.socketio.Configuration config = new com.corundumstudio.socketio.Configuration();
        config.setHostname("localhost");
        // where the Socket.io traffic will live
        config.setPort(socketServerPort);
        
        // this allows the frontend to talk to this port
        config.setOrigin(frontendURL);

        // CORS settings to allow the frontend to talk to this port
        config.setAllowHeaders("Content-Type, Authorization, x-requested-with");
        
        return new SocketIOServer(config);
    }
}