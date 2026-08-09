package com.homifind.controller;

import com.homifind.service.BrokerDirectoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/brokers")
@RequiredArgsConstructor
public class BrokerDirectoryController {
    private final BrokerDirectoryService brokerDirectoryService;

    @GetMapping
    public List<Map<String, Object>> search(
        JwtAuthenticationToken authentication,
        @RequestParam(defaultValue = "") String search
    ) {
        return brokerDirectoryService.search(search);
    }
}
