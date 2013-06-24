package server.mash;

import com.google.gson.Gson;
import server.domain.Challenge;
import server.domain.DAO;
import server.domain.Player;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.util.HashMap;

public class MashServlet extends HttpServlet {

    public static final String CHALLENGE_ID = "challengeId";
    public static final String PLAYER_1 = "player1";
    public static final String PLAYER_2 = "player2";
    public static final String WINNER_ID = "winnerId";

    EloRatingService eloRatingService = new EloRatingService();
    DBMash dbMash = new DAO();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        Player[] players = dbMash.getPlayers();
        Player player1 = players[0];
        Player player2 = players[1];

        Challenge challenge = new Challenge();
        challenge.setPlayer1Id(player1.getId());
        challenge.setPlayer2Id(player2.getId());
        dbMash.saveChallenge(challenge);

        HashMap<String, Object> payload = new HashMap<String, Object>();
        payload.put(CHALLENGE_ID, challenge.getId());
        payload.put(PLAYER_1, player1);
        payload.put(PLAYER_2, player2);

        resp.setCharacterEncoding("UTF-8");
        resp.setContentType("application/json; charset=UTF-8");
        resp.getWriter().write(new Gson().toJson(payload));
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        String json = getJsonFromData(req);
        HashMap<String, Object> result = new Gson().fromJson(json, HashMap.class);

        if (!result.containsKey(CHALLENGE_ID)
                || !result.containsKey(PLAYER_1)
                || !result.containsKey(PLAYER_2)
                || !result.containsKey(WINNER_ID)
                ) {
            return; // json not correct
        }

        long uiChallengeId = ((Double) result.get(CHALLENGE_ID)).longValue();

        Player uiPlayer1 = new Gson().fromJson(new Gson().toJson(result.get(PLAYER_1)), Player.class);
        Player uiPlayer2 = new Gson().fromJson(new Gson().toJson(result.get(PLAYER_2)), Player.class);

        Challenge dbChallenge = dbMash.getChallenge(uiChallengeId);

        if (dbChallenge == null
                || !dbChallenge.getPlayer1Id().equals(uiPlayer1.getId())
                || !dbChallenge.getPlayer2Id().equals(uiPlayer2.getId())) {
            return; // data not correct
        }

        // get diff ratings
        long winnerId = ((Double) result.get(WINNER_ID)).longValue();

        Player uiWinner, uiLoser;
        if (uiPlayer1.getId() == winnerId) {
            uiWinner = uiPlayer1;
            uiLoser = uiPlayer2;

        } else if (uiPlayer2.getId() == winnerId) {
            uiWinner = uiPlayer2;
            uiLoser = uiPlayer1;

        } else {
            throw new UnsupportedOperationException("winner id is not correct: " + winnerId);
        }

        EloRatingService.Result eloResult = eloRatingService.updateRating(uiWinner, uiLoser);

        // update players
        savePlayerRating(uiWinner.getId(), eloResult.winnerRatingDiff);
        savePlayerRating(uiLoser.getId(), eloResult.loserRatingDiff);
    }

    void savePlayerRating(long playerId, double ratingDiff) {
        Player playerDB = dbMash.getPlayer(playerId);
        playerDB.setRating((int) (playerDB.getRating() + ratingDiff));
        dbMash.savePlayer(playerDB);
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
