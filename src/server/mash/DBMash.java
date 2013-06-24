package server.mash;

import server.domain.Challenge;
import server.domain.Player;

public interface DBMash {

    Player[] getPlayers();

    void saveChallenge(Challenge challenge);

    Challenge getChallenge(long uiChallengeId);

    Player getPlayer(long playerId);

    void savePlayer(Player playerDB);

}
