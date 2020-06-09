Sugar = require('sugar-and-spice')
Sugar.extend()
fs = require("fs-extra")

class ExtractorGoogleAnalyticsV3

  json_path: null


  success_callback: null
  error_callback: null
  finally_callback: null

  dataset: []


  options:
    auth: null
    ids: null,
    'start-date': null
    'end-date': null
    dimensions: null
    metrics: null
    "include-empty-rows": true
    "max-results": 1000
    "start-index": 1


  constructor: (config)->
    @json_path = config.json_path
    @options.ids = config.view_id
    @options["start-date"] = config.start_date
    @options["end-date"] = config.end_date
    @options.dimensions = config.dimensions
    @options.metrics = config.metrics

  execute: ( successCallback, errorCallback, finallyCallback)->

    that = @

    @success_callback = successCallback
    @error_callback = errorCallback
    @finally_callback = finallyCallback

    jsonFileExists = fs.existsSync that.json_path
    console.log "checking #{that.json_path}"
    if jsonFileExists
      that.fetch()
    else
      that.error_callback "The Google API JSON File expected at: #{that.json_path} does not exist."




  fetch: (that)->
    unless that?
      that = @


    try

      google = require('googleapis').google
      # load json file for service which was created from the api developer console
      key = fs.readJsonSync(that.json_path)
      #console.log "KEY"
      #console.log key
      scopes = 'https://www.googleapis.com/auth/analytics.readonly'
      # only two pieces from the json file are used, client_email and private_key
      jwt = new google.auth.JWT(key.client_email, null, key.private_key, scopes)
      that.options.auth = jwt

      jwt.authorize (err, response) ->
        google.analytics('v3').data.ga.get that.options

        , (error, body) ->
          if error?
            that.error_callback error
          else
            if body?
              # console.log body
              that.dataset.append body.data

              #if that.logger_service?
              #  that.logger_service.info  "#{@dataset.length} of #{data.totalResults} records loaded.", { task:  that.task }
              # pagination
              that.options["start-index"] = that.options["start-index"] + body.data.rows.length

              if that.options["start-index"] < body.data.totalResults
                that.fetch.delay 1000, that
              else
                that.success_callback that.dataset
                that.finally_callback()
            else
              that.error_callback "google api request returned no data"
    catch e
      console.log e
      that.error_callback e





module.exports = ExtractorGoogleAnalyticsV3
