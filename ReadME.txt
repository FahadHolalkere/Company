1) Tech Stack:
    ->Backend: Node.js with Express framework for building RESTful APIs.
    ->Database: MongoDB for storing event data.
    ->Dependencies: Mongoose for MongoDB object modeling, csvtojson for parsing CSV data, axios for making HTTP requests.

2) Design Decisions:
    ->Chose Express for its simplicity and robustness in building web applications and APIs.
    ->Used MongoDB due to its flexibility, scalability, and compatibility with Node.js.
    ->Implemented pagination logic to efficiently handle large datasets and improve performance.
    ->Used async/await for asynchronous operations to write cleaner and more readable code.

3) Challenges Addressed:
    ->Parsing and inserting CSV data into MongoDB.
    ->Integrating with external APIs to fetch weather data and calculate distances.
    ->Implementing pagination and organizing event data into pages.
    ->Handling errors gracefully and providing informative error messages.


Instructions to Run Code:

    => Install Node.js and MongoDB if not already installed.
    => Clone the project repository.
    => Install dependencies by running 'npm install'.
    => Set up environment variables by creating a .env file with the following variables:
        PORT: Port number for the server
        MongoAPI: MongoDB connection string (If you don't have the MongoDB account email me, I will send you my server details)
        WeatherAPI: add the code string part from API from k to ==
        DistanceAPI: add the code string part from API from I to ==
    => Start the server by running npm start.
    => Access the API endpoints using appropriate HTTP requests.
    => If your using your own MongoDB account then first go to localhost:PortNumber/events/add for adding the csv file.
    => Then go to localhost:PortNumber/ to search 


API Documentation

1) Endpoint: /events/add
    => Method: POST
    => Request Format:
    => Body: Form data containing the input file (CSV format) with key inputfile
    => Response Format:
    => Success: HTTP 200 OK with message "Data Inserted Successfully"
    => Failure: HTTP 500 Internal Server Error with message "Error Occurred in Insertion"

2) Endpoint: /events/find
    => Method: GET
    => Query Parameters:
    => latitude: Latitude of the location (required)
    => longitude: Longitude of the location (required)
    => startdate: Start date in the format "YYYY-MM-DD" (required)
    => Response Format:
    => Success: HTTP 200 OK with JSON object containing event details and pagination info
    => events: Array of events with details
    => page: Current page number
    => pageSize: Number of events in the current page
    => totalEvents: Total number of events
    => totalPages: Total number of pages
    => Failure: HTTP 500 Internal Server Error with message "Internal server error"