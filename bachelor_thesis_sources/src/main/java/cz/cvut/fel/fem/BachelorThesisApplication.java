package cz.cvut.fel.fem;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

@SpringBootApplication
public class BachelorThesisApplication extends SpringBootServletInitializer {

    private static final Integer pageVedeckaRada = 1;
    private static final Integer pageUvazky = 4;
    private static final Integer pageDoctoranti = 5;

    public static void main(String[] args) {
        SpringApplication.run(BachelorThesisApplication.class, args);
    }

}
