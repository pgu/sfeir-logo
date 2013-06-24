package server.mash;

import org.fest.assertions.Assertions;
import org.junit.Assert;
import org.junit.Test;
import server.domain.Player;

public class EloRatingServiceTest {

    private EloRatingService elo = new EloRatingService();

    @Test
    public void shouldGetDifferentKFactorsAccordingToRatings() {
        Assert.assertTrue(elo.getKFactor(0) == 32);
        Assert.assertTrue(elo.getKFactor(2099) == 32);
        Assert.assertTrue(elo.getKFactor(2100) == 24);
        Assert.assertTrue(elo.getKFactor(2399) == 24);
        Assert.assertTrue(elo.getKFactor(2400) == 16);
        Assert.assertTrue(elo.getKFactor(9999) == 16);
    }

    @Test
    public void shouldUpdateRating_for_rating_of_2000() {
        // give
        Player winner = new Player();
        Player loser = new Player();

        Assertions.assertThat(winner.getRating()).isEqualTo(2000);
        Assertions.assertThat(loser.getRating()).isEqualTo(2000);

        // when
        elo.updateRating(winner, loser);

        // then
        Assertions.assertThat(winner.getRating()).isEqualTo(2016);
        Assertions.assertThat(loser.getRating()).isEqualTo(1984);
    }

    @Test
    public void testUpdateRating_2100() {
        // give
        Player winner = new Player();
        Player loser = new Player();

        winner.setRating(2100);
        loser.setRating(2100);

        // when
        elo.updateRating(winner, loser);

        // then
        Assertions.assertThat(winner.getRating()).isEqualTo(2112);
        Assertions.assertThat(loser.getRating()).isEqualTo(2088);
    }

    @Test
    public void testUpdateRating_2400() {
        // give
        Player winner = new Player();
        Player loser = new Player();

        winner.setRating(2400);
        loser.setRating(2400);

        // when
        elo.updateRating(winner, loser);

        // then
        Assertions.assertThat(winner.getRating()).isEqualTo(2408);
        Assertions.assertThat(loser.getRating()).isEqualTo(2392);
    }



}
