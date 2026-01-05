package com.quickswap.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import java.awt.*;
import java.io.IOException;
import java.net.URI;

@Component
public class SwaggerUiLauncher implements ApplicationListener<ApplicationReadyEvent> {

    @Value("${server.port:8080}")
    private int port;

    @Value("${springdoc.swagger-ui.path:/swagger-ui/index.html}")
    private String swaggerPath;

    // Set to false to disable auto-opening (useful in CI)
    @Value("${app.open-swagger:true}")
    private boolean openSwagger;

    @Override
    public void onApplicationEvent(ApplicationReadyEvent event) {
        if (!openSwagger)
            return;
        String url = "http://localhost:" + port + swaggerPath;
        try {
            if (Desktop.isDesktopSupported() && Desktop.getDesktop().isSupported(Desktop.Action.BROWSE)) {
                Desktop.getDesktop().browse(new URI(url));
                return;
            }
        } catch (Exception ignored) {
        }

        // fallback to OS-specific commands
        String os = System.getProperty("os.name").toLowerCase();
        try {
            if (os.contains("win")) {
                new ProcessBuilder("cmd", "/c", "start", url).start();
            } else if (os.contains("mac")) {
                new ProcessBuilder("open", url).start();
            } else {
                new ProcessBuilder("xdg-open", url).start();
            }
        } catch (IOException ignored) {
        }
    }
}
