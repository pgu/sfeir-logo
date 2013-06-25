package server.mash;

import server.domain.Challenge;
import server.domain.Player;

public interface DBMash {

    Player[] getPlayers();

    void saveChallenge(Challenge challenge);

    Challenge getChallenge(long challengeId);

    Player getPlayer(long playerId);

    void savePlayer(Player player);

    void deleteChallenge(long challengeId);
}
