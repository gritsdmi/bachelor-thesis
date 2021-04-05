package cz.cvut.fel.fem.to;

import cz.cvut.fel.fem.model.User;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import static org.junit.Assert.assertEquals;

@RunWith(SpringRunner.class)
@SpringBootTest
public class UserToMappingTest {

    @Autowired
    private ModelMapper modelMapper;

    @Test
    public void whenConvertPostEntityToPostDto_thenCorrect() {
        User user = new User();
        user.setId(1L);
        user.setName("testusername");

        UserTO userTO = modelMapper.map(user, UserTO.class);
        assertEquals(user.getId(), userTO.getId());
        assertEquals(user.getName(), userTO.getName());
    }

    @Test
    public void whenConvertPostDtoToPostEntity_thenCorrect() {
        UserTO userTO = new UserTO();
        userTO.setId(1L);
        userTO.setName("testusername");

        User user = modelMapper.map(userTO, User.class);
        assertEquals(userTO.getId(), user.getId());
        assertEquals(userTO.getName(), user.getName());
    }
}