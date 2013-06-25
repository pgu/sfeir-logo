package server.domain;

import com.google.appengine.api.datastore.QueryResultIterable;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;
import com.googlecode.objectify.util.DAOBase;
import server.mash.DBMash;

import java.util.ArrayList;
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
}
