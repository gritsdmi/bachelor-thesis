package cz.cvut.fel.fem.services.security;

import cz.cvut.fel.fem.model.security.UserDetailsImpl;
import cz.cvut.fel.fem.repository.UserRepository;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@Log
public class UserDetailService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String login) throws UsernameNotFoundException {
        var user = userRepository.findByLoginAndActiveTrue(login)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + login));

        return UserDetailsImpl.build(user);
    }
}
