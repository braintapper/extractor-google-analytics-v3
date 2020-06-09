var ExtractorGoogleAnalyticsV3, Sugar, fs;

Sugar = require('sugar-and-spice');

Sugar.extend();

fs = require("fs-extra");

ExtractorGoogleAnalyticsV3 = (function() {
  class ExtractorGoogleAnalyticsV3 {
    constructor(config) {
      this.json_path = config.json_path;
      this.options.ids = config.view_id;
      this.options["start-date"] = config.start_date;
      this.options["end-date"] = config.end_date;
      this.options.dimensions = config.dimensions;
      this.options.metrics = config.metrics;
    }

    execute(successCallback, errorCallback, finallyCallback) {
      var jsonFileExists, that;
      that = this;
      this.success_callback = successCallback;
      this.error_callback = errorCallback;
      this.finally_callback = finallyCallback;
      jsonFileExists = fs.existsSync(that.json_path);
      console.log(`checking ${that.json_path}`);
      if (jsonFileExists) {
        return that.fetch();
      } else {
        return that.error_callback(`The Google API JSON File expected at: ${that.json_path} does not exist.`);
      }
    }

    fetch(that) {
      var e, google, jwt, key, scopes;
      if (that == null) {
        that = this;
      }
      try {
        google = require('googleapis').google;
        // load json file for service which was created from the api developer console
        key = fs.readJsonSync(that.json_path);
        //console.log "KEY"
        //console.log key
        scopes = 'https://www.googleapis.com/auth/analytics.readonly';
        // only two pieces from the json file are used, client_email and private_key
        jwt = new google.auth.JWT(key.client_email, null, key.private_key, scopes);
        that.options.auth = jwt;
        return jwt.authorize(function(err, response) {
          return google.analytics('v3').data.ga.get(that.options, function(error, body) {
            if (error != null) {
              return that.error_callback(error);
            } else {
              if (body != null) {
                // console.log body
                that.dataset.append(body.data);
                //if that.logger_service?
                //  that.logger_service.info  "#{@dataset.length} of #{data.totalResults} records loaded.", { task:  that.task }
                // pagination
                that.options["start-index"] = that.options["start-index"] + body.data.rows.length;
                if (that.options["start-index"] < body.data.totalResults) {
                  return that.fetch.delay(1000, that);
                } else {
                  that.success_callback(that.dataset);
                  return that.finally_callback();
                }
              } else {
                return that.error_callback("google api request returned no data");
              }
            }
          });
        });
      } catch (error1) {
        e = error1;
        console.log(e);
        return that.error_callback(e);
      }
    }

  };

  ExtractorGoogleAnalyticsV3.prototype.json_path = null;

  ExtractorGoogleAnalyticsV3.prototype.success_callback = null;

  ExtractorGoogleAnalyticsV3.prototype.error_callback = null;

  ExtractorGoogleAnalyticsV3.prototype.finally_callback = null;

  ExtractorGoogleAnalyticsV3.prototype.dataset = [];

  ExtractorGoogleAnalyticsV3.prototype.options = {
    auth: null,
    ids: null,
    'start-date': null,
    'end-date': null,
    dimensions: null,
    metrics: null,
    "include-empty-rows": true,
    "max-results": 1000,
    "start-index": 1
  };

  return ExtractorGoogleAnalyticsV3;

}).call(this);

module.exports = ExtractorGoogleAnalyticsV3;
