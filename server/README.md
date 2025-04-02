Hi! This is the backend side of the app. I'll explain the basic structure of this directory.

these are four folders:
 - config
 - controllers
 - routes
 - uploads (empty folder)

The config folder contains the file db.js, which connects the app to our local MySQL database.
The controllers folder holds the main API logic.
The routes folder uses the express.Router() library to manage API endpoints.

Basically, these folders serve as the building blocks of a standard Express middleware, with the purpose of making the code more intuitive.

The main server.js file integrates all the mentioned subfolders and establishes a local server.


Regards,
Carl P.
