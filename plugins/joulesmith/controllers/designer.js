/*
    Copyright (C) 2015  PencilBlue, LLC

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

//dependencies
var path = require('path');

module.exports = function DesignerModule(pb) {


    function Designer(){}
    pb.util.inherits(Designer, pb.BaseController);

    Designer.prototype.render = function(cb) {
        var self = this;

         var content = {
             content_type: "text/html",
             code: 200
         };

         var options = {
             currUrl: this.req.url
         };

         pb.TopMenuService.getTopMenu(self.session, self.ls, options, function(themeSettings, navigation, accountButtons) {
             pb.TopMenuService.getBootstrapNav(navigation, accountButtons, function(navigation, accountButtons) {

                self.setPageName("Reactor Designer");

                self.ts.registerLocal('meta_title', pb.config.siteName);
                self.ts.registerLocal('meta_lang', localizationLanguage);
                self.ts.registerLocal('current_url', self.req.url);
                self.ts.registerLocal('navigation', new pb.TemplateValue(navigation, false));
                self.ts.registerLocal('account_buttons', new pb.TemplateValue(accountButtons, false));


                //to generate the rendered view the template service can be called.
                //The path specified to the template service is relative to the
                //templates directory of the plugin or active theme.  The .html
                //extension is implied and does not have to be specified. For
                //convience the "path" module has been made global by the PB core.
                //While it appears that paths with forward '/' characters are
                //interpreted correctly on windows systems it is better to be safe an
                //use the "path" module to path parts correctly.
                self.ts.load('designer', function(err, template) {
                    if (pb.util.isError(err)) {

                        //when an error occurs it is possible to hand back off to the
                        //RequestHandler to serve the error.
                        self.reqHandler.serveError(err);
                    }

                    //The callback to the RequestHandler can specify more than just the
                    //content to be streamed back to the client.  The content type can
                    //be overrided as well as the HTTP status code.  The status code
                    //defaults to 200.
                    var content = {
                        content_type: "text/html",
                        code: 200,
                        content: template
                    };

                    var angularData = pb.ClientJs.getAngularController({}, ['ngSanitize']);
                    content.content = content.content.concat(angularData);

                    cb(content);
                });


            });
        });
    };


    /**
     * Provides the routes that are to be handled by an instance of this prototype.
     * The route provides a definition of path, permissions, authentication, and
     * expected content type.
     * Method is optional
     * Path is required
     * Permissions are optional
     * Access levels are optional
     * Content type is optional
     *
     * @param cb A callback of the form: cb(error, array of objects)
     */
     Designer.getRoutes = function(cb) {
        var routes = [
            {
                method: 'get',
                path: "/designer",
                auth_required: false,
                content_type: 'text/html'
            },
        ];
        cb(null, routes);
    };

    //exports
    return Designer;
};
