package com.ricky.obscanvas.controller;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.annotation.RegisteredOAuth2AuthorizedClient;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api")
public class UserController {

    @Value("${spring.security.oauth2.client.registration.twitch.client-id}")
    private String clientID;

    @GetMapping("/user")
    public Map<String, Object> getUser(@AuthenticationPrincipal OAuth2User principal, @RegisteredOAuth2AuthorizedClient("twitch") OAuth2AuthorizedClient authorizedClient) {
        if (principal == null) {
            return null;
        }

        // get the user info
        Map<String, Object> userInfo = new HashMap<>(principal.getAttributes());

        if (userInfo.containsKey("id")) {

            // check if the user is authorized and add the result to the user info
            boolean isAuthorized = checkUserAuthorization(userInfo.get("id").toString());
            userInfo.put("isAuthorized", isAuthorized);

            // fetch the channels the user moderates and add it to the user info
            String twitchID = userInfo.get("id").toString();
            String token = authorizedClient.getAccessToken().getTokenValue();
            List<Object> moderatedChannels = fetchModeratedChannels(twitchID, token);
            userInfo.put("moderatedChannels", moderatedChannels);

            System.out.println("User info: " + userInfo); // log the user info for debugging

            return userInfo;
        }

        return principal.getAttributes();
    }

    private List<Object> fetchModeratedChannels(String userID, String token) {

        // headers for Twitch API request
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        headers.set("Client-ID", clientID);
        HttpEntity<String> entity = new HttpEntity<>(headers);

        String URL = "https://api.twitch.tv/helix/moderation/channels?user_id=" + userID;

        try {
            // make the API request to Twitch
            ResponseEntity<Map> response = restTemplate.exchange(URL, HttpMethod.GET, entity, Map.class);
            System.out.println("Twitch API response: " + response.getBody()); // log the Twitch API response for debugging
            return (List<Object>) response.getBody().get("data");
        } catch (Exception e) {
            System.out.println("Error fetching moderated channels: " + e.getMessage());
            return Collections.emptyList();
        }
    }

    private boolean checkUserAuthorization(String twitchID) {
        // logic here

        return true;
    }
}