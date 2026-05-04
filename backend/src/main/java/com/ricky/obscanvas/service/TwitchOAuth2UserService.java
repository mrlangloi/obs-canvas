package com.ricky.obscanvas.service;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.RequestEntity;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequestEntityConverter;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
public class TwitchOAuth2UserService extends DefaultOAuth2UserService {

    @Value("${spring.security.oauth2.client.registration.twitch.client-id}")
    private String clientID;

    public TwitchOAuth2UserService() {
        // a custom request entity converter to add the Client-ID header
        OAuth2UserRequestEntityConverter converter = new OAuth2UserRequestEntityConverter();
        
        this.setRequestEntityConverter(new OAuth2UserRequestEntityConverter() {
            @Override
            public RequestEntity<?> convert(OAuth2UserRequest userRequest) {
                RequestEntity<?> entity = converter.convert(userRequest);
                HttpHeaders headers = new HttpHeaders();
                headers.putAll(entity.getHeaders());
                
                // twitch REQUIRED header
                headers.add("Client-ID", clientID);
                
                return new RequestEntity<>(entity.getBody(), headers, entity.getMethod(), entity.getUrl());
            }
        });
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        // calls the modified converter with the Client-ID header
        OAuth2User user = super.loadUser(userRequest);
        Map<String, Object> attributes = user.getAttributes();
        
        List<Map<String, Object>> data = (List<Map<String, Object>>) attributes.get("data");

        if (data == null || data.isEmpty()) {
            throw new OAuth2AuthenticationException("Twitch API returned empty data list");
        }

        Map<String, Object> userAttributes = data.get(0);

        return new DefaultOAuth2User(
            Collections.singleton(new SimpleGrantedAuthority("ROLE_USER")),
            userAttributes,
            "id" 
        );
    }
}