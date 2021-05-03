package cz.cvut.fel.fem.config;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {
//TODO add global variable defines environment(local or deploy)
    @Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }
}
