package filter;

import io.vertx.ext.web.Router;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;

@ApplicationScoped
public class SpaFallbackFilter {

    void init(@Observes Router router) {
        router.getWithRegex("^/(?!api/)(?!.*\\..*$).*$").handler(ctx -> {
            ctx.reroute("/index.html");
        });
    }
}
