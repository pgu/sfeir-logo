package server.mash;

import org.fest.assertions.Assertions;
import org.junit.Before;
import org.junit.Test;
import org.mockito.BDDMockito;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.invocation.InvocationOnMock;
import org.mockito.stubbing.Answer;
import server.domain.Challenge;
import server.domain.Player;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;

import static org.mockito.Matchers.any;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.verify;

public class MashServletTest {

    private MashServlet servlet = new MashServlet();

    @Mock
    private DBMock dbMock;
    @Mock
    private HttpServletRequest req;
    @Mock
    private HttpServletResponse resp;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        servlet.dbMock = dbMock;
    }

    @Test
    public void shouldGiveNewChallengeForGET() throws ServletException, IOException {
        // given writer
        StringWriter writer = new StringWriter();
        PrintWriter printWriter = new PrintWriter(writer);
        BDDMockito.given(resp.getWriter()).willReturn(printWriter);

        // given players
        Player p1 = new Player(1L, "p1", "picture1");
        Player p2 = new Player(2L, "p2", "picture2");

        Player[] players = new Player[]{p1, p2};
        BDDMockito.given(dbMock.getPlayers()).willReturn(players);

        // given challenge
        doAnswer(new Answer() {

            @Override
            public Object answer(InvocationOnMock invocation) throws Throwable {
                Object[] args = invocation.getArguments();
                Challenge challenge = (Challenge) args[0];
                challenge.setId(10L);
                return challenge;
            }

        }).when(dbMock).saveChallenge(any(Challenge.class));

        //
        // when
        //
        servlet.doGet(req, resp);

        //
        // then
        //
        verify(resp).setCharacterEncoding("UTF-8");
        verify(resp).setContentType("application/json; charset=UTF-8");

        Assertions.assertThat(writer.getBuffer().toString()).isEqualTo(("" + //
                "{'player1':{'id':1,'text':'p1','pictureUrl':'picture1','rating':2000}," + //
                "'player2':{'id':2,'text':'p2','pictureUrl':'picture2','rating':2000}," + //
                "'challengeId':10}") //
                .replace("'", "\""));
    }

}
