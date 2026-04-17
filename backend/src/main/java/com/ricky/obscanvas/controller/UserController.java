package com.ricky.obscanvas.controller;

import java.util.List;
import java.util.Map;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class UserController {

    @GetMapping("/user")
    public Map<String, Object> getUser(@AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) {
            return null; 
        }
        
        // due to user-name-attribute=data, twitch puts all the user info inside "data" list
        List<Map<String, Object>> data = (List<Map<String, Object>>) principal.getAttribute("data");
        
        if (data != null && !data.isEmpty()) {
            return data.get(0); // return the first user in the list
        }

        return principal.getAttributes();
    }
}