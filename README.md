## Changes

### Routes
Implemented handler for each provided stubbed route that handles input, delegates
business logic to underlying `Property` service, and then handles response based on
result of service call

### Validation
`yup` for validation to handle all request validation alongside the routes

### Middlewares
* One to handle all `yup` validation errors and respond in json with a 400
* One to handle all unexpected errors and respond in json with a 500

### Indexes
Other than the `id` primary key default, I only indexed `price` because that is the only
field I'm using in the `WHERE` clause where `id` isn't being used (part of `findProperties`)

### Tests
* Added multiple test groups for each REST endpoint to exercise expected use cases
* Added a `beforeEach` to reset the db between tests to prevent tests sharing persistent state

### Future Improvements
* Use GraphQL and if a REST API was needed for stakeholders generate that from a GraphQL schema rather than
maintaining a REST API manually
* Add ESLint for code quality
* Add authn and authz for endpoints that shouldn't be public (e.g read/write permissions) 
* Add OpenAPI integration to make REST API more explorable and self-documenting
* Use Elasticsearch or Algolia for search over SQL queries
* Add a model layer to decouple services from the data layer
* More tests (lacking unit tests here and focused mostly on integration tests)
* Break service and routes into multiple directories
