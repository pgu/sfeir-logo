package server.access;

import com.googlecode.objectify.ObjectifyService;
import com.googlecode.objectify.util.DAOBase;
import server.domain.Challenge;
import server.domain.Player;

import java.util.Collections;
import java.util.List;
import java.util.Random;

public class DAO extends DAOBase implements DBMash {

    static {
        ObjectifyService.register(Player.class);
        ObjectifyService.register(Challenge.class);
    }

    @Override
    public Player[] getPlayers() {
        List<Player> players = ofy().query(Player.class).list();

        Random rand = new Random();
        int idx = rand.nextInt(players.size());
        Player player1 = players.remove(idx);

        rand = new Random();
        idx = rand.nextInt(players.size());
        Player player2 = players.remove(idx);

        return new Player[] {player1, player2};
    }

    @Override
    public void saveChallenge(Challenge challenge) {
        ofy().put(challenge);
    }

    @Override
    public Challenge getChallenge(long uiChallengeId) {
        return ofy().get(Challenge.class, uiChallengeId);
    }

    @Override
    public Player getPlayer(long playerId) {
        return ofy().get(Player.class, playerId);
    }

    @Override
    public void savePlayer(Player playerDB) {
        ofy().put(playerDB);
    }

    @Override
    public void deleteChallenge(long challengeId) {
        ofy().async().delete(Challenge.class, challengeId);
    }

    @Override
    public List<Player> getHighestPlayers(int nb) {
        return ofy().query(Player.class).order("-rating").limit(nb).list();
    }

    @Override
    public List<Player> getLowestPlayers(int nb) {
        List<Player> players = ofy().query(Player.class).order("rating").limit(nb).list();
        Collections.reverse(players);
        return players;
    }

    @Override
    public List<Player> getAllPlayersFromHighestToLowestScore() {
        return ofy().query(Player.class).order("-rating").list();
    }

}
