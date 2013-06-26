package server.mash;

import com.google.appengine.api.channel.ChannelMessage;
import com.google.appengine.api.channel.ChannelService;
import com.google.appengine.api.channel.ChannelServiceFactory;
import com.google.gson.Gson;
import server.ChannelServlet;
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
import java.util.List;

public class MashServlet extends HttpServlet {

    public static final String CHALLENGE_ID = "challengeId";
    public static final String PLAYER_1 = "player1";
    public static final String PLAYER_2 = "player2";
    public static final String WINNER_ID = "winnerId";

    EloRatingService eloRatingService = new EloRatingService();
    DBMash dbMash = new DAO();
    ChannelService channelService = ChannelServiceFactory.getChannelService();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setCharacterEncoding("UTF-8");
        resp.setContentType("application/json; charset=UTF-8");

        String pathInfo = req.getPathInfo();
        if ("/challenge".equals(pathInfo)) {

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

            resp.getWriter().write(new Gson().toJson(payload));

        } else if ("/ranking".equals(pathInfo)) {

            String json = getJsonOfHighestAndLowestPlayers();
            resp.getWriter().write(json);

        } else if ("/all_ranks".equals(pathInfo)) {

            List<Player> players = dbMash.getAllPlayersFromHighestToLowestScore();
            resp.getWriter().write(new Gson().toJson(players));

        } else {
            resp.sendError(HttpServletResponse.SC_NOT_FOUND);
        }
    }

    private String getJsonOfHighestAndLowestPlayers() {
        List<Player> highests = dbMash.getHighestPlayers(3);
        List<Player> lowests = dbMash.getLowestPlayers(3);

        HashMap<String, Object> payload = new HashMap<String, Object>();
        payload.put("highests", highests);
        payload.put("lowests", lowests);

        return new Gson().toJson(payload);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        String pathInfo = req.getPathInfo();
        if ("/challenge".equals(pathInfo)) {

            String json = getJsonFromPost(req);
            HashMap<String, Object> dataFromJson = new Gson().fromJson(json, HashMap.class);

            if (!isDataFromJsonCorrect(dataFromJson)) {
                return;
            }

            long uiChallengeId = ((Double) dataFromJson.get(CHALLENGE_ID)).longValue();

            Player uiPlayer1 = new Gson().fromJson(new Gson().toJson(dataFromJson.get(PLAYER_1)), Player.class);
            Player uiPlayer2 = new Gson().fromJson(new Gson().toJson(dataFromJson.get(PLAYER_2)), Player.class);

            Challenge dbChallenge = dbMash.getChallenge(uiChallengeId);

            if (!isDataFromChallengeCorrect(uiPlayer1, uiPlayer2, dbChallenge)) {
                return;
            }

            // get diff ratings
            long winnerId = ((Double) dataFromJson.get(WINNER_ID)).longValue();

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
            savePlayerRating(uiWinner.getId(), eloResult.winnerRatingDiff, true /* is winner */);
            savePlayerRating(uiLoser.getId(), eloResult.loserRatingDiff, false);

            // clean this challenge
            dbMash.deleteChallenge(uiChallengeId);

            // send update of the ranking
            String channelMessage = getJsonOfHighestAndLowestPlayers();
            channelService.sendMessage(new ChannelMessage(ChannelServlet.PUBLIC_TOKEN, channelMessage));

        } else {
            resp.sendError(HttpServletResponse.SC_NOT_FOUND);
        }

    }

    private boolean isDataFromChallengeCorrect(Player uiPlayer1, Player uiPlayer2, Challenge dbChallenge) {
        return dbChallenge != null //
                && dbChallenge.getPlayer1Id().equals(uiPlayer1.getId()) //
                && dbChallenge.getPlayer2Id().equals(uiPlayer2.getId());
    }

    private boolean isDataFromJsonCorrect(HashMap<String, Object> data) {
        return data.containsKey(CHALLENGE_ID) //
                && data.containsKey(PLAYER_1) //
                && data.containsKey(PLAYER_2) //
                && data.containsKey(WINNER_ID);
    }

    void savePlayerRating(long playerId, double ratingDiff, boolean isWinner) {
        Player playerDB = dbMash.getPlayer(playerId);
        playerDB.setRating((int) (playerDB.getRating() + ratingDiff));

        if (isWinner) {
            playerDB.setWon(playerDB.getWon() + 1);
        } else {
            playerDB.setLost(playerDB.getLost() + 1);
        }

        dbMash.savePlayer(playerDB);
    }

    private String getJsonFromPost(HttpServletRequest req) {

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
