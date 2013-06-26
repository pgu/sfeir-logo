package server.mash;

import server.domain.Challenge;
import server.domain.Player;

import java.util.List;

public interface DBMash {

    Player[] getPlayers();

    void saveChallenge(Challenge challenge);

    Challenge getChallenge(long challengeId);

    Player getPlayer(long playerId);

    void savePlayer(Player player);

    void deleteChallenge(long challengeId);

    List<Player> getHighestPlayers(int nb);

    List<Player> getLowestPlayers(int nb);

    List<Player> getAllPlayersFromHighestToLowestScore();
}
