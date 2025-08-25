package com.lta.gestionempleados.config;

import com.fasterxml.jackson.databind.Module;
import com.fasterxml.jackson.datatype.hibernate6.Hibernate6Module;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JacksonConfig {

    @Bean
    public Module hibernateModule() {
        Hibernate6Module module = new Hibernate6Module();
        // Do not force initialization of lazy-loaded associations
        module.disable(Hibernate6Module.Feature.FORCE_LAZY_LOADING);
        return module;
    }
}
