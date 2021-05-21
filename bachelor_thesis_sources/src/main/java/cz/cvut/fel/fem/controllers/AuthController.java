package cz.cvut.fel.fem.controllers;

import cz.cvut.fel.fem.model.auth.Request;
import cz.cvut.fel.fem.model.auth.Response;
import cz.cvut.fel.fem.services.UserService;
import cz.cvut.fel.fem.services.security.UserDetailService;
import cz.cvut.fel.fem.utils.jwt.JwtUtil;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Date;

@RestController
@Log
@RequestMapping(produces = {"application/json; charset=UTF-8"})
public class AuthController implements Controller {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailService userDetailService;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/hello")
    public String test() {
        return "hello world";
    }

    @GetMapping("/ping")
    public String ping() {
        var date = new Date();
        return "ping " + date;
    }

    @PostMapping("/auth")
    public ResponseEntity<?> authCreateToken(@RequestBody Request request) throws Exception {
//        log.info("auth request");
        Authentication authentication;
        try {
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
        } catch (BadCredentialsException e) {
            log.severe(e.toString());
            throw new Exception(e);
        }

        final var userDetails = userDetailService.loadUserByUsername(request.getUsername());
//        SecurityContextHolder.getContext().setAuthentication(authentication);
        final var jwt = jwtUtil.generateToken(userDetails);
        final var userFromDb = userService.getUserByName(request.getUsername()).get(0);

        assert userFromDb != null;
//        log.info(userDetails.toString());
        var response = ResponseEntity.ok(new Response(jwt,
                userFromDb.getId(),
                userDetails.getUsername(),
                userFromDb.getRole(),
                userFromDb.getFirstLogin()));
//                .header("Access-Control-Allow-Origin", "*").build();;
        log.info(response.toString());
        return response;
    }
}
