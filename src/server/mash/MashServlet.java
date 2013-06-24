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

    EloRatingService eloRatingService = new EloRatingService();
    DBMock dbMock = new DBMock();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        Player[] players = dbMock.getPlayers();
        Player player1 = players[0];
        Player player2 = players[1];

        Challenge challenge = new Challenge();
        challenge.setPlayer1Id(player1.getId());
        challenge.setPlayer2Id(player2.getId());
        dbMock.saveChallenge(challenge);

        HashMap<String, Object> payload = new HashMap<String, Object>();
        payload.put("challengeId", challenge.getId());
        payload.put("player1", player1);
        payload.put("player2", player2);

        resp.setCharacterEncoding("UTF-8");
        resp.setContentType("application/json; charset=UTF-8");
        resp.getWriter().write(new Gson().toJson(payload));
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        String json = getJsonFromData(req);

        HashMap<String, Object> result = new Gson().fromJson(json, HashMap.class);
        Long uiChallengeId = (Long) result.get("challengeId");

        Player uiPlayer1 = (Player) result.get("player1");
        Player uiPlayer2 = (Player) result.get("player2");

        // check integrity's data
        Challenge dbChallenge = dbMock.getChallenge(uiChallengeId);
        if (dbChallenge == null
                || !dbChallenge.getPlayer1Id().equals(uiPlayer1.getId())
                || !dbChallenge.getPlayer2Id().equals(uiPlayer2.getId())) {
            return; // non integre
        }

        // get diff ratings
        Long winnerId = (Long) result.get("winnerId");

        Player uiWinner, uiLoser;
        if (uiPlayer1.getId().equals(winnerId)) {
            uiWinner = uiPlayer1;
            uiLoser = uiPlayer2;

        } else if (uiPlayer2.getId().equals(winnerId)) {
            uiWinner = uiPlayer2;
            uiLoser = uiPlayer1;

        } else {
            throw new UnsupportedOperationException("winner id is not integre");
        }

        EloRatingService.Result eloResult = eloRatingService.updateRating(uiWinner, uiLoser);

        // update players
        savePlayerRating(uiWinner.getId(), eloResult.winnerRatingDiff);
        savePlayerRating(uiLoser.getId(), eloResult.loserRatingDiff);
    }

    void savePlayerRating(Long playerId, double ratingDiff) {
        Player playerDB = dbMock.getPlayer(playerId);
        playerDB.setRating((int) (playerDB.getRating() + ratingDiff));
        dbMock.savePlayer(playerDB);
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
