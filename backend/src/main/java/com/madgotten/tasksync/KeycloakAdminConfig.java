package com.madgotten.tasksync;

import org.keycloak.OAuth2Constants;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.keycloak.admin.client.resource.RealmResource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;

@Configuration
public class KeycloakAdminConfig {
    @Value("${keycloak.server-url}")    String serverUrl;
    @Value("${keycloak.realm}")         String realm;
    @Value("${keycloak.clientId}")      String clientId;
    @Value("${keycloak.clientSecret}")  String clientSecret;

    @Bean
    public Keycloak keycloak() {
        return KeycloakBuilder.builder()
                .serverUrl(serverUrl)
                .realm(realm)
                .grantType(OAuth2Constants.CLIENT_CREDENTIALS)
                .clientId(clientId)
                .clientSecret(clientSecret)
                .build();
    }

    @Bean
    public RealmResource keycloakRealm(Keycloak kc) {
        return kc.realm(realm);
    }
}
