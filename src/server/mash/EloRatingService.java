package server.mash;

import server.domain.Player;

public class EloRatingService {

    private static final double WIN = 1.0;
    private static final double LOSS = 0.0;
//    private static final double DRAW = 0.5;

    public void updateRating(Player winner, Player loser) {

        double expectedScoreForWinner = 1.0 / (1.0 + Math.pow(10.0, (loser.getRating() - winner.getRating()) / 400));
        double expectedScoreForLoser = 1.0 / (1.0 + Math.pow(10.0, (winner.getRating() - loser.getRating()) / 400));

        int kFactorOfWinner = getKFactor(winner.getRating());
        int kFactorOfLoser = getKFactor(loser.getRating());

        winner.setRating((int) (winner.getRating() + kFactorOfWinner * (WIN - expectedScoreForWinner)));
        loser.setRating((int) (loser.getRating() + kFactorOfLoser * (LOSS - expectedScoreForLoser)));
    }

    int getKFactor(int rating) {
        if (rating < 2100) {
            return 32;

        } else if (rating < 2400) {
            return 24;

        } else {
            return 16;
        }
    }

}
