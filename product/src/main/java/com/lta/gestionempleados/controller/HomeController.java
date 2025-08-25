package com.lta.gestionempleados.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    // Redirect root URL to Swagger UI for easy API exploration
    @GetMapping("/")
    public String index() {
        return "redirect:/swagger-ui.html";
    }
}
