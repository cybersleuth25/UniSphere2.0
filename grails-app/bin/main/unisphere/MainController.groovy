package unisphere

/**
 * MainController - serves the main dashboard page.
 *
 * PHP origin: index.html
 */
class MainController {

    /**
     * Render the main dashboard / landing page.
     * PHP equivalent: index.html served as static file
     */
    def index() {
        println "Executing MainController.index() !!!"
        render(view: 'index')
    }
}
