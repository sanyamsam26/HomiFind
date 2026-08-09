package com.homifind.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.UUID;

@Service
public class PropertyAiProcessingService {
    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final String functionUrl;
    private final String internalToken;

    public PropertyAiProcessingService(
            @Value("${homifind.ai.function-url:}") String functionUrl,
            @Value("${homifind.ai.internal-token:}") String internalToken) {
        this.functionUrl = functionUrl;
        this.internalToken = internalToken;
    }

    public void processAsync(UUID propertyId) {
        if (functionUrl == null || functionUrl.isBlank() || internalToken == null || internalToken.isBlank()) return;
        Thread.ofVirtual().start(() -> {
            try {
                HttpRequest request = HttpRequest.newBuilder(URI.create(functionUrl))
                        .header("Content-Type", "application/json")
                        .header("x-homifind-internal-token", internalToken)
                        .POST(HttpRequest.BodyPublishers.ofString("{\"propertyId\":\"" + propertyId + "\"}"))
                        .build();
                httpClient.send(request, HttpResponse.BodyHandlers.discarding());
            } catch (Exception ignored) {
                // Property creation must not fail because an asynchronous AI enrichment job is unavailable.
            }
        });
    }
}
