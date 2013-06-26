package server.mash;

import com.google.gson.Gson;
import org.fest.assertions.Assertions;
import org.junit.Before;
import org.junit.Test;
import org.mockito.*;
import org.mockito.invocation.InvocationOnMock;
import org.mockito.stubbing.Answer;
import server.domain.Challenge;
import server.domain.Player;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.util.HashMap;

import static org.mockito.Matchers.*;
import static org.mockito.Mockito.*;

public class MashServletTest {

    private MashServlet servlet = new MashServlet();

    @Mock
    private DBMock dbMock;
    @Mock
    private EloRatingService eloRatingService;
    @Mock
    private HttpServletRequest req;
    @Mock
    private HttpServletResponse resp;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        servlet.dbMash = dbMock;
        servlet.eloRatingService = eloRatingService;
    }

    @Test
    public void shouldGiveNewChallengeForGET() throws ServletException, IOException {
        // given request
        BDDMockito.given(req.getPathInfo()).willReturn("/challenge");
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
                "{'player1':{'id':1,'text':'p1','pictureUrl':'picture1','rating':2000,'won':0,'lost':0}," + //
                "'player2':{'id':2,'text':'p2','pictureUrl':'picture2','rating':2000,'won':0,'lost':0}," + //
                "'challengeId':10}") //
                .replace("'", "\""));
    }

    @Test
    public void shouldSaveChallengeForPOST() throws ServletException, IOException {
        // given request
        BDDMockito.given(req.getPathInfo()).willReturn("/challenge");
        // given input json
        String json = ("" + //
                "{'player1':{'id':1,'text':'p1','pictureUrl':'picture1','rating':2000,'won':0,'lost':0}," + //
                "'player2':{'id':2,'text':'p2','pictureUrl':'picture2','rating':2000,'won':0,'lost':0}," + //
                "'challengeId':10,'winnerId':2}") //
                .replace("'", "\"");

        BufferedReader reader = new BufferedReader(new StringReader(json));
        BDDMockito.given(req.getReader()).willReturn(reader);

        // given db challenge
        Challenge dbChallenge = new Challenge();
        dbChallenge.setId(10L);
        dbChallenge.setPlayer1Id(1L);
        dbChallenge.setPlayer2Id(2L);
        BDDMockito.given(dbMock.getChallenge(anyLong())).willReturn(dbChallenge);

        // given elo rating diff
        EloRatingService.Result eloResult = new EloRatingService.Result();
        eloResult.winnerRatingDiff = 5;
        eloResult.loserRatingDiff = -10;
        BDDMockito.given(eloRatingService.updateRating(any(Player.class), any(Player.class))).willReturn(eloResult);

        // given players from DB
        Player p1 = new Player(1L, "p1", "picture1");
        BDDMockito.given(dbMock.getPlayer(1L)).willReturn(p1);

        Player p2 = new Player(2L, "p2", "picture2");
        BDDMockito.given(dbMock.getPlayer(2L)).willReturn(p2);

        //
        // when
        //
        servlet.doPost(req, resp);

        //
        // then
        //
        verify(dbMock, times(2)).savePlayer(argThat(new ArgumentMatcher<Player>() {
            @Override
            public boolean matches(Object argument) {
                Player player = (Player) argument;

                if (player.getId() == 1) { // loser
                    Assertions.assertThat(player.getRating()).isEqualTo(1990);
                    Assertions.assertThat(player.getWon()).isEqualTo(0);
                    Assertions.assertThat(player.getLost()).isEqualTo(1);

                } else if (player.getId() == 2) { // winner
                    Assertions.assertThat(player.getRating()).isEqualTo(2005);
                    Assertions.assertThat(player.getWon()).isEqualTo(1);
                    Assertions.assertThat(player.getLost()).isEqualTo(0);

                } else {
                    return false;
                }

                return true;
            }
        }));

    }

    @Test
    public void shouldParseJson() {
        String json = "{\"player1\":{\"id\":1,\"text\":\"Networking is one letter from Not working\",\"pictureUrl\":\"http://25.media.tumblr.com/f74d771d1fc640d6eb32d4f7242b4b71/tumblr_moca9xWmSv1rcufs7o1_1280.png\",\"rating\":2000},\"player2\":{\"id\":2,\"text\":\"Teamwork: Tackle life side by side.\",\"pictureUrl\":\"http://24.media.tumblr.com/9eed7a0ca40b301569a67fe29e3d3cc6/tumblr_mnotrbV7Hz1rcufs7o1_1280.png\",\"rating\":2000},\"challengeId\":10,\"winnerId\":1}";

        HashMap<String, Object> result = new Gson().fromJson(json, HashMap.class);

        Assertions.assertThat(result.keySet()).contains(MashServlet.CHALLENGE_ID);
        Assertions.assertThat(result.keySet()).contains(MashServlet.PLAYER_1);
        Assertions.assertThat(result.keySet()).contains(MashServlet.PLAYER_2);
        Assertions.assertThat(result.keySet()).contains(MashServlet.WINNER_ID);
    }


}
