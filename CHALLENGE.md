# Summary
For this code challenge a Candidate will clone and setup an existing Rails application. The rails app will contain routes, migrations, models, controllers and some mockup views but with no actual funcionality created. The candidate will show all his/her expertise building apps with the Rails framework and problem solving skills.

# Overview
Hey URL! is a service to create awesome friendly URLs to make it easier for people to remember. Our Team developed some mockup views but we don’t have our awesome functionality yet.

# REQUIREMENTS
* Implement actions to create shorter urls based on full url params
* If URL is not valid the application returns an error message to the user
* We want to give to our users a way to metric their URLs. Every time that someone clicks their URL, it should record that click and also user platform and browser using user agent request header (Browser gem).
* We want to create a metrics panel for the user to view the stats for every short url. The user should be able to see total clicks per day on the current month. What browsers and platforms.
* Implement API endpoint to get 10 latest urls
* If someone try to visit a invalid short url then it should return a custom 404 page
* Controllers, endpoints and models should be fully tested with rspec

# URL format
* Max length 5 character e.g.  NELNT
* Allows Uppercase and Lowercase characters
* Allows Number
* Any non-word character is not allowed e.g whitespaces, tab,% ,$.* etc
* URL must be unique
* Original URL format should be validated 
* `short_url` attribute should store only the generated code

# Pages
These mockup pages are already built into our site:

GET / : Contains url form and the 10 latest url list with their click counter

GET /:url: Saves URL information (click counter and referrer) and redirects to original url

GET /:url/stats: Shows metrics information about the given url

API (Bonus)
Also, we need to create a way to get the 10 latest urls from an API endpoint. it should be JSON API complaint. Here is an example of a response from the API:

```
{
  "data": [{
    "type": "urls",
    "id": "1",
    "attributes": {
      "created-at": "2018-08-15T02:48:08.642Z",
  "original-url": "www.fullstacklabs.co/angular-developers",
  "url": "https://domain/fss1",
  "clicks": 2
    },
    "relationships": {
      "metrics": {
        "data": [
          {
            "id": 1,
            "type": "metrics"
          }
        ]
      }
    }
  }],
  "included": []
}
```

Accomplishment
Completed functionality 70%
Completed test 20 %
Completed bonus 10%
