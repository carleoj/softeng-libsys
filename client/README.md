Hi! This is the frontend side of the app.
I'll explain the basic structure of this directory.

Inside the 'src' folder contains subfolders:
 - assets
 - pages
 - components
 - protected_routes

'assets' holds all the necessary images used in the application.
'pages' and 'components' contains most of the app's building blocks for the website.
 - each folder have 'styles' subfolders which contains the CSS files.
'protected_routes' just carry a single file to solve the routing problem.

the main file 'App.jsx' takes the highest hierachy among the components.
files in the 'pages' folder are mostly imported here.

this app utilizes the BrowserRouter type of 'React Router' to help manage the navigation and
user interface state of the application, this is imported from the installed library 'react-router-dom'


Regards,
Carl P.
