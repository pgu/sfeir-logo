package server.mash;

import server.domain.Geek;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class MashServlet extends HttpServlet {

    private static List<Geek> geeks = new ArrayList<Geek>();

    static {
        Geek g1 = new Geek("Networking is one letter from \"Not working\"", "http://25.media.tumblr.com/f74d771d1fc640d6eb32d4f7242b4b71/tumblr_moca9xWmSv1rcufs7o1_1280.png");
        Geek g2 = new Geek("Teamwork: Tackle life side by side.", "http://24.media.tumblr.com/9eed7a0ca40b301569a67fe29e3d3cc6/tumblr_mnotrbV7Hz1rcufs7o1_1280.png");
        geeks.add(g1);
        geeks.add(g2);
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        String pathInfo = req.getPathInfo();

        System.out.println("##############");
        System.out.println(pathInfo);

        if ("/geek".equals(pathInfo)) {

            // take 2 geeks
            // create a challenge
            // save the challenge
            // send json of the challenge + the 2 geeks
            resp.getWriter().write("{\"name\":\"toto\"}");

        } else {
            throw new UnsupportedOperationException("Unknown path info: " + pathInfo);
        }

    }

}
