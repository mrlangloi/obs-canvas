package com.ricky.obscanvas.config;

import java.util.Arrays;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity // Enables Spring Security's web support
public class SecurityConfig {

    @Value("${app.frontend.url}")
    private String frontendURL;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(withDefaults()) // uses the corsConfigurationSource bean below
            .csrf(csrf -> csrf.disable()) // disabled for easier local development with React
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/user").permitAll() // allows checking login status
                .anyRequest().authenticated()
            )
            .oauth2Login(oauth2 -> oauth2
                // redirects back to frontend (port 5173) after Twitch login
                .defaultSuccessUrl(frontendURL, true)
            );
        
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(frontendURL));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With"));
        configuration.setAllowCredentials(true); 

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}