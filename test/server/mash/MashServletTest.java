package server.mash;

import org.fest.assertions.Assertions;
import org.junit.Test;
import server.domain.Player;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.StringWriter;

public class MashServletTest {

    private MashServlet servlet = new MashServlet();

    @Test
    public void shouldGiveNewChallengeForGET() throws ServletException, IOException {
        // given
        HttpServletRequest req = null;
        HttpServletResponse resp= null;

        // when
        servlet.doGet(req, resp);

        // then
        StringWriter writer= new StringWriter();
        Assertions.assertThat(writer.toString()).isEqualTo("");
    }

}
