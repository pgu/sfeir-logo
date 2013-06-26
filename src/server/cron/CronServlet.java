package server.cron;

import com.googlecode.objectify.Key;
import server.access.DAO;
import server.domain.Challenge;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

public class CronServlet extends HttpServlet {

    private DAO dao = new DAO();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        String pathInfo = request.getPathInfo();

        if ("/challenges/clean".equals(pathInfo)) {

            List<Key<Challenge>> challengeKeys = dao.ofy().query(Challenge.class).listKeys();
            dao.ofy().delete(challengeKeys);

        } else {
            response.sendError(HttpServletResponse.SC_NOT_FOUND);
        }

    }

}
