package cz.cvut.fel.fem.services.security;

import cz.cvut.fel.fem.services.UserService;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
@Log
public class UserDetailService implements UserDetailsService {

    @Autowired
    private UserService userService;

    @Override
    public UserDetails loadUserByUsername(String userName) throws UsernameNotFoundException {
        var teacher = userService.getUserByName(userName);

//        log.info(teacher.toString());
        assert !teacher.isEmpty();

        return new User(teacher.get(0).getLogin(), teacher.get(0).getPassword(), new ArrayList<>());
    }

    public UserDetails loadUserBy(String userName) throws UsernameNotFoundException {


        return new User("foo", "foo", new ArrayList<>());
    }
}
