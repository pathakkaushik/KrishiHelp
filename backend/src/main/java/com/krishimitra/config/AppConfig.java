package com.krishimitra.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.Components;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.client.RestTemplate;

import java.util.Optional;

@Configuration
public class AppConfig {

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    @Bean
    public AuditorAware<String> auditorAware() {
        return () -> {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getName())) {
                return Optional.of(auth.getName());
            }
            return Optional.of("SYSTEM");
        };
    }

    @Bean
    public OpenAPI krishiMitraOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("KrishiMitra AI API")
                        .description("AI-Powered Smart Farmer Assistance & Grievance Management Platform REST API")
                        .version("v1.0.0")
                        .contact(new Contact()
                                .name("KrishiMitra Team")
                                .email("api@krishimitra.in")
                                .url("https://krishimitra.in"))
                        .license(new License().name("Proprietary").url("https://krishimitra.in/terms")))
                .addSecurityItem(new SecurityRequirement().addList("Bearer Authentication"))
                .components(new Components()
                        .addSecuritySchemes("Bearer Authentication",
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("Enter JWT token obtained from /auth/login")));
    }
}
