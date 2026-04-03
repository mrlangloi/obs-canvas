package com.ricky.obscanvas.service;

import com.corundumstudio.socketio.SocketIOServer;
import com.ricky.obscanvas.model.CardItem;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import org.springframework.stereotype.Service;

@Service
public class SocketService {

    private final SocketIOServer server;

    public SocketService(SocketIOServer server) {
        this.server = server;

        // listen for new connections
        this.server.addConnectListener(client -> {
            System.out.println("Frontend connected! ID: " + client.getSessionId());
        });

        // listen for a custom event called "send_ping" from the client
        // String.class means we expect the data sent to be text
        this.server.addEventListener("send_ping", String.class, (client, data, ackSender) -> {
            System.out.println("Client said: " + data);
            
            // send a response back to the client
            client.sendEvent("server_pong", "Hello from Spring Boot 4!");
        });

        // listen for card updates from the frontend
        this.server.addEventListener("card_update", CardItem.class, (client, data, ackSender) -> {
            // log the movement for debugging
            System.out.println("Card " + data.id() + " moved to: (" + data.position().x() + ", " + data.position().y() + ")");

            // broadcast the data to everyone else so their canvas updates
            // .sendEvent(eventName, data)
            server.getBroadcastOperations().sendEvent("card_moved", data);
        });
    }

    @PostConstruct
    public void start() { server.start(); }

    @PreDestroy
    public void stop() { server.stop(); }
}