package com.homifind.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

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
        if (functionUrl == null || functionUrl.isBlank()) return;

        CompletableFuture.runAsync(() -> {
            try {
                HttpRequest.Builder builder = HttpRequest.newBuilder(URI.create(functionUrl))
                        .header("Content-Type", "application/json")
                        .POST(HttpRequest.BodyPublishers.ofString("{\"propertyId\":\"" + propertyId + "\"}"));

                if (internalToken != null && !internalToken.isBlank()) {
                    builder.header("x-homifind-internal-token", internalToken);
                }

                httpClient.send(builder.build(), HttpResponse.BodyHandlers.discarding());
            } catch (Exception ignored) {
                // Property creation must not fail because an asynchronous AI enrichment job is unavailable.
            }
        });
    }
}
