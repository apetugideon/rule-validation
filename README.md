# Rule-validation API

This API was created using nodejs v12.18.3 with no framework, with the endpoints for validating set of input rules.

The API base url is located [here](https://app-rule-validation.herokuapp.com/) and the git repo is [here](https://github.com/apetugideon/rule-validation.git).


# Using the API endpoints

1. Mage GET request to https://app-rule-validation.herokuapp.com/, this will display my informations.

2. Make POST request to https://app-rule-validation.herokuapp.com/validate-rule. Example payload:
   
```javascript
{
  "rule": {
    "field": "missions.count",
    "condition": "gte",
    "condition_value": 30
  },
  "data": {
    "name": "James Holden",
    "crew": "Rocinante",
    "age": 34,
    "position": "Captain",
    "missions": {
      "count": 45,
      "successful": 44,
      "failed": 1
    }
  }
}
```

Rule-validation returns the following status codes in its API:

| Status Code | Description |
| :--- | :--- |
| 200 | `OK` |
| 400 | `BAD REQUEST` |
| 404 | `NOT FOUND` |
