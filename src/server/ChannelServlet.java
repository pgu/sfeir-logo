package server;

import com.google.appengine.api.channel.ChannelService;
import com.google.appengine.api.channel.ChannelServiceFactory;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class ChannelServlet extends HttpServlet {

    public static final String PUBLIC_TOKEN = "public_token";

    private final ChannelService channelService = ChannelServiceFactory.getChannelService();

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String pathInfo = request.getPathInfo();

        if ("/token".equals(pathInfo)) {

            response.setCharacterEncoding("UTF-8");
            response.setContentType("text/plain; charset=UTF-8");

            final String token = channelService.createChannel(PUBLIC_TOKEN);
            response.getWriter().print(token);

        } else {
            response.sendError(HttpServletResponse.SC_NOT_FOUND);
        }
    }
}
