package server.mash;

import com.google.gson.Gson;
import server.domain.Challenge;
import server.domain.Player;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class MashServlet extends HttpServlet {

    private EloRatingService eloRatingService = new EloRatingService();

    static Long challengeId = 10L;

    static Player g1 = new Player("Networking is one letter from \"Not working\"", "http://25.media.tumblr.com/f74d771d1fc640d6eb32d4f7242b4b71/tumblr_moca9xWmSv1rcufs7o1_1280.png");
    static Player g2 = new Player("Teamwork: Tackle life side by side.", "http://24.media.tumblr.com/9eed7a0ca40b301569a67fe29e3d3cc6/tumblr_mnotrbV7Hz1rcufs7o1_1280.png");
    static Player g3 = new Player("Crash: it doesn't just happen to computers.", "http://24.media.tumblr.com/a1dfdda0494a2506a3fc4bb9184540f0/tumblr_mnryxtDBMu1rcufs7o1_1280.jpg");

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        String pathInfo = req.getPathInfo();

        if ("/geek".equals(pathInfo)) {

            Long newChallengeId = challengeId++;

            // take 2 Players
            Player player1 = null;
            Player player2 = null;

            if (challengeId % 3 == 0) {
                player1 = g2;
                player2 = g3;

            } else if (challengeId % 2 == 0) {
                player1 = g1;
                player2 = g2;

            } else {
                player1 = g1;
                player2 = g3;
            }

            // create a challenge
            // save the challenge
            Challenge challenge = new Challenge(newChallengeId);

            player1.setChallengeId(challenge.getId());
            player2.setChallengeId(challenge.getId());

            challenge.setType("geek");
            challenge.putPlayers(player1, player2);
            // save this state in DB...

            // send json of the challenge + the 2 Players
            resp.setCharacterEncoding("UTF-8");
            resp.setContentType("application/json; charset=UTF-8");
            resp.getWriter().write(new Gson().toJson(challenge));

        } else {
            throw new UnsupportedOperationException("Unknown path info: " + pathInfo);
        }

    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String pathInfo = req.getPathInfo();

        // get json from data
        String json = getJsonFromData(req);

        if ("/geek".equals(pathInfo)) {
            Challenge challenge = new Gson().fromJson(json, Challenge.class);

            Player winner = challenge.getWinner();
            Player loser = challenge.getLoser();

            eloRatingService.updateRating(winner, loser);

            System.out.println("Networking: " + g1.getRating() + ", Teamwork: " + g2.getRating() + ", Crash: " + g3.getRating());
        }

    }

    private String getJsonFromData(HttpServletRequest req) {

        BufferedReader reader = null;
        try {
            reader = req.getReader();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        StringBuilder sb = new StringBuilder();
        String line = null;
        try {
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        return sb.toString();
    }
}
