# Upsurge Frontend

The frontend for Upsurge is written in JavaScript using ReactJS. The goal is to have an interactive user interface which gracefully interacts with the backend server as well. The frontend is still in heavy development, so there will be more features in the `development` branch. 

## Usage

To use the frontend, use `npm i` to install the necessary packages, then use `npm start` to run the frontend server. The frontent listens on port 3000, so navigate to `localhost:3000` in your browser to see the frontend itself. 

There are features in development that demonstrate the connection between the frontend and the backend, though they aren't readily apparent to the user. Contact us to learn about these connections.

## Features

The main feature in the frontend at the moment is the canvas page. This page is where the user will be able to interact with the interface and create a circuit. As of now, we are still working on adding features such as gate, input, and output icons, and adding drag and drop functionality. However, you will see features in the `development` branch such as drawing to the canvas. 

The logic page is still under development, but it has features which allow it to both receive circuitry from the canvas page and communicate with the backend.

As of right now, there is no formal testing framework for the frontend.
