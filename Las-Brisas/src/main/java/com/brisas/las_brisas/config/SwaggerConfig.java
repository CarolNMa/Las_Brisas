package com.brisas.las_brisas.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Las Brisas API")
                        .version("1.0.0")
                        .description("Documentación de la API del sistema de gestión de talento humano Las Brisas")
                        );
    }
}
