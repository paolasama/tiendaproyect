package com.lta.gestionempleados.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.annotation.Configuration;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.core.env.Environment;
import org.springframework.lang.NonNull;

@Configuration
public class ServerPortLogger implements ApplicationListener<ApplicationReadyEvent> {

    private static final Logger log = LoggerFactory.getLogger(ServerPortLogger.class);

    @Autowired
    private Environment env;

    @Override
    public void onApplicationEvent(@NonNull ApplicationReadyEvent event) {
        String port = env.getProperty("local.server.port");
        log.info("Application started on http://localhost:{}", port);
        log.info("Swagger UI: http://localhost:{}/swagger-ui.html", port);
    }
}
