package server.domain;

public class Player {

    private String text;
    private String pictureUrl;
    private Long challengeId;
    private int rating = 2000;

    public Player() {
    }

    public Player(String text, String pictureUrl) {
        this.text = text;
        this.pictureUrl = pictureUrl;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Player Player = (Player) o;

        if (text != null ? !text.equals(Player.text) : Player.text != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        return text != null ? text.hashCode() : 0;
    }

    @Override
    public String toString() {
        return "Player{" +
                "text='" + text + '\'' +
                ", pictureUrl='" + pictureUrl + '\'' +
                ", challengeId=" + challengeId +
                '}';
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getPictureUrl() {
        return pictureUrl;
    }

    public void setPictureUrl(String pictureUrl) {
        this.pictureUrl = pictureUrl;
    }

    public void setChallengeId(Long challengeId) {
        this.challengeId = challengeId;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public Long getChallengeId() {
        return challengeId;
    }
}
