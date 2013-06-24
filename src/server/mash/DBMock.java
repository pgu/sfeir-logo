package server.mash;

import server.domain.Challenge;
import server.domain.Player;

import java.util.HashMap;

public class DBMock implements DBMash {

    static Long challengeId = 10L;

    static Player g1 = new Player(1L ,"Networking is one letter from Not working", "http://25.media.tumblr.com/f74d771d1fc640d6eb32d4f7242b4b71/tumblr_moca9xWmSv1rcufs7o1_1280.png");
    static Player g2 = new Player(2L, "Teamwork: Tackle life side by side.", "http://24.media.tumblr.com/9eed7a0ca40b301569a67fe29e3d3cc6/tumblr_mnotrbV7Hz1rcufs7o1_1280.png");
    static Player g3 = new Player(3L, "Crash: it does not just happen to computers.", "http://24.media.tumblr.com/a1dfdda0494a2506a3fc4bb9184540f0/tumblr_mnryxtDBMu1rcufs7o1_1280.jpg");

    static HashMap<Long, Challenge> challenges = new HashMap<Long, Challenge>();
    static HashMap<Long, Player> players = new HashMap<Long, Player>();

    static {
        players.put(g1.getId(), g1);
        players.put(g2.getId(), g2);
        players.put(g3.getId(), g3);
    }

    public Long newChallengeId() {
        return challengeId++;
    }

    public Player[] getPlayers() {
        Player player1, player2;

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

        return new Player[] {player1, player2};
    }

    public void saveChallenge(Challenge challenge) {

        if (challenge.getId() == null) {
            challenge.setId(challengeId++);
        }

        challenges.put(challenge.getId(), challenge);
    }

    public void savePlayer(Player player) {
        players.put(player.getId(), player);
        System.out.println("Networking: " + g1.getRating() + ", Teamwork: " + g2.getRating() + ", Crash: " + g3.getRating());
    }

    public Challenge getChallenge(long id) {
        return challenges.get(id);
    }

    public Player getPlayer(long playerId) {
        return players.get(playerId);
    }
}
