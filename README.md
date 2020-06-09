# Extractor Template

```
degit braintapper/extractor-template
#or
npx degit braintapper/extractor-template

npm install
```



config.json
```
{
  "json_path": "D:\\srv\\secrets\\google\\ga-service-account-credential-file.json",
  "view_id": "ga:123456789",
  "start_date": "30daysAgo",
  "end_date": "yesterday",
  "dimensions": "ga:date,ga:country,ga:region,ga:metro,ga:city",
  "metrics": "ga:sessions,ga:bounces,ga:bounceRate,ga:avgSessionDuration"
}
```
