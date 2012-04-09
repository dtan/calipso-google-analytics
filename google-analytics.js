/**
 * Base module to insert google analytics tracking code
 */

var rootpath = process.cwd() + '/',
  path = require('path'),
  calipso = require(path.join(rootpath, 'lib/calipso'));

exports = module.exports = {
  init: init,
  route: route,
  config: {
    "key": {
        "default": "",
        "label": "Key",
        "description": "The google analytics API Key for the current site."              
    },
    "anonymize-ip": {
        "default": true,
        "label": "Anonymise IP",
        "description": "Anonymize IP addresses going to Google Analytics."              
    },
    "track-pagespeed": {
        "default": true,
        "label": "Track Page Speed",
        "description": "Enable page speed tracking in Google Analytics."              
    }
  }
};

/**
 *Router
 */
function route(req, res, module, app, next) {

  // Router
  module.router.route(req, res, next);

};

/**
 *Init
 */
function init(module, app, next) {

  // Any pre-route config
  calipso.lib.step(

  function defineRoutes() {

    // Tracking code is added to every page
    module.router.addRoute(/.*/, ga, {
      end: false,
      template: 'ga',
      block: 'scripts.ga'
    }, this.parallel());

  }, function done() {

    // No initialisation?
    next();

  });

};

/**
 * Render the ga code, extracting the key from app config
 */
function ga(req, res, template, block, next) {

  var key = calipso.config.getModuleConfig('google-analytics','key');
  var anonymizeIP = calipso.config.getModuleConfig('google-analytics','anonymize-ip');
  var trackPageSpeed = calipso.config.getModuleConfig('google-analytics','track-pagespeed');
  calipso.theme.renderItem(req, res, template, block, {
    key: key,
    anonymizeIP: anonymizeIP,
    trackPageSpeed: trackPageSpeed
  }, next);
}