package server.mash;

public class EloRatingService {

    private static class Player {
        public int rating;
    }

    private static enum K_FACTORS {
        low(0, 2100, 32), medium(2100, 2400, 24), high(2400, 9999999, 16);

        private int lowLimit;
        private int highLimit;
        private int factor;

        K_FACTORS(int lowLimit, int highLimit, int factor) {
            this.lowLimit = lowLimit;
            this.highLimit = highLimit;
            this.factor = factor;
        }

        public static int getRating(int rating) {
            for (K_FACTORS kFactor : K_FACTORS.values()) {
                if (kFactor.lowLimit <= rating && rating < kFactor.highLimit) {
                    return kFactor.factor;
                }
            }
            throw new UnsupportedOperationException("No kFactor for this rating");
        }
    }

    private static final double WIN = 1.0;
    private static final double DRAW = 0.5;
    private static final double LOSS = 0.0;

    public void elo(Player winner, Player loser) {

        double expectedScoreForWinner = 1.0 / (1.0 + Math.pow(10.0, (loser.rating - winner.rating) / 400));
        double expectedScoreForLoser = 1.0 / (1.0 + Math.pow(10.0, (winner.rating - loser.rating) / 400));

        int kFactorOfWinner = K_FACTORS.getRating(winner.rating);
        int kFactorOfLoser = K_FACTORS.getRating(loser.rating);

        winner.rating = (int) (winner.rating + kFactorOfWinner * (WIN - expectedScoreForWinner));
        loser.rating = (int) (loser.rating + kFactorOfLoser * (LOSS - expectedScoreForLoser));
    }

}
