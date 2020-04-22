# Upsurge 
A logic circuit simulator. This platform is designed to parse and evaluate boolean expressions and logic circuits.

## Platform Design
Upsurge is built on a MERN stack (MongoDB, ExpressJS, ReactJS, and NodeJS). As of now, it's more of an ERN stack. The backend for Upsurge is built on ExpressJS hosting a REST API, with endpoints available to test major features.  The frontend for Upsurge is built on ReactJS, hosting a dynamically interactive user interface (in the future).

The codebase for Upsurge is stored in the `upsurge` directory, and the frontend and backend platforms are separated into their own respective `frontend` and `backend` directories as well. Each service is built on NodeJS, so it uses the standard `npm` commands to run - you can find more documentation for this in the respective directories. The documentation for each of these services can be found both here, and in their respective directories in `upsurge/backend` and `upsurge/frontend`.

## Upsurge Backend
In here lies the code for the backend framework for Upsurge. This component contains the REST API architecture for the backend services, such as boolean parsing, truth tables, and expression evaluation. 

### Running
Before running this program, ensure that all necessary modules are installed by running `npm i` or `npm install`. Then, run the backend with `npm start` or `npm run start`. By default, this platform will run on port 3001. There is no browser interface for the backend, so navigating to `localhost:3001` will not show anything other than the generic ExpressJS landing page. However, you will be able to interface with the backend using HTTP requests through such services as `curl` or Postman. We have created a simple Python wrapper for this as well, described later.

### Usage
Currently, the backend suports POST calls to two different endpoints `/exp` and `/circuit`. 

#### Boolean Expressions and Evaluations
The `/exp` endpoint accepts POST requests to evaluate boolean expressions passed as a string. Here is an example of an expected JSON body:
```
{
    "expression": "x1 & (x2 | x3)"
}
```
The API expects that any binary connective takes exactly two statements, left and right, without any ambiguity (`x1 and x2 and x3` is invalid, as there is no way to determine which `and` is evaluated first). In fact, it follows a specific grammar for a "well-formed formula". More information can be found [here](https://en.wikipedia.org/wiki/Well-formed_formula). Here is the expected grammar:

```
variable     := any variable name that is not a binary/unary operation
expression   := variable | NOT variable | (variable AND variable) | (variable OR variable) | (variable XOR varialble)
```

There are many ways to represent different connectives:
```
Binary AND: 'AND', 'and', '&', '∧', '·'
Binary OR:  'OR',  'or',  '|', '∨', '+'
Binary XOR: 'XOR', 'xor', '^', '⊕'
Binary NOT: 'NOT', 'not', '~', '!'
```
So the statement `x1 AND (x2 XOR x3)` is equivalent to `x1 & (x2 ⊕ x3)`. Feel free to use any of these symbols in the expression logic you want to evaluate. This endpoint will evaluate an expression by parsing the variables out of the expression and assigning all possible truth value combinations to the variables and matching them against the expression parse tree. The response is a JSON body, with variables and the expressions as the keys, and their truth assignments as the values.

Here is an example. Suppose we POST the following JSON body to the `/exp` endpoint:
```
{
    "expression": "not (x1 & not not x2)"
}
```
Then we would expect to receive the following response:
```
{
    "x1": [
        false,
        false,
        true,
        true
    ],
    "x2": [
        false,
        true,
        false,
        true
    ],
    "not (x1 & not not x2)": [
        true,
        true,
        true,
        false
    ]
}
```

Feel free to make more complicated expression - remember that they must follow the grammar specified above!

#### Circuits
The `/circuit` endpoint accepts JSON body representations of a circuit (imagine a DOT file representation, like those for graphs). The test description of the circuit follows a specified format:
```
{
    "componentName": {
        "inputs": [
            {
                "name": "x1",
                "type": "static",
                "value": true
            }, 
            {
                "name": "x2",
                "type": "static",
                "value": false
            }, 
            {
                "name": "bob",
                "type": "placeholder"
            }, ...
        ],
        "gates": [
            {
                "name": "blackBox",
                "type": "component",
                "inputs": ["x1", "x2"]
            },
            {
                "name": "and1",
                "type": "and",
                "inputs": ["blackBox", "x3", "bob"]
            }, ...
        ],
        "outputs": [
            {
                "name": "o1",
                "type": "static",
                "inputs": ["and1"]
            }, ...
        ]
    },
    .
    .
    .
}
```

Posting to the `/circuit` will return a JSON body with evaluations for every component, evaluating based on default static values and generated TF values for placeholder variables.

For example, suppose we POST the following circuit JSON to the `/circuit` endpoint:
```
{
    "component": {
        "inputs": [
            {
                "name": "x",
                "type": "static",
                "value": true
            },
            {
                "name": "y",
                "type": "placeholder"
            }
        ], 
        "gates": [
            {
                "name": "and",
                "type": "and",
                "inputs": ["x", "y"]
            }

        ],
        "outputs": [
            {
                "name": "o1",
                "type": "static",
                "inputs": ["and"]
            }
        ]
    }
}
```
We fix the `x` variable to be true, but `y` is a placeholder variable, so we will check all possible truth-value assignments for `y`. We would expect to receive the following response:
```
[
    {
        "x": [
            true,
            true
        ],
        "y": [
            false,
            true
        ],
        "( x and y )": [
            false,
            true
        ]
    }
]
```
Like before, feel free to make more complicated circuits. Refer to the examples in the `test/` directory for more complicated examples of JSON circuitry.

### Testing
To test the backend, run `npm test` - this will run the test suites located in the `test/` directory. This runs the suite of (currently) 75 test cases testing all the functionality in the `parse.js`, `assignment.js`, and `circuit.js` files. 

To test this manually, first make sure that the backend is running in a separate tab or window, then use curl commands to send JSON bodies to the specified endpoints (For Linux and Mac, or Invoke-RestMethod for Windows). For example, you can use:
```
curl -X POST -H "Content-Type: application/json" -d '{"expression": "(a and b)"}' localhost:3001/exp
curl -X POST -H "Content-Type: application/json" -D @path/to/file.json localhost:3001/circuit
```
On Windows, curl is an alias for Invoke-WebRequest, so the command line arguments don't translate directly. Instead, this is an example command for manual testing on Windows:
```
Invoke-RestMethod -Uri http://localhost:3001/exp -ContentType 'application/json' -Method POST -Body '{"expression": "(a and b)"}'

```

Included in this directory is a Python wrapper for these curl commands. Here is the syntax for running the Python script:
```
python3 wrapper.py <local|remote> <circuit|expression> <path to JSON file>
```
Specify `local` if testing against the backend server running locally (ignore the `remote` option, we use that for testing on our virtual machine). Specify `expression` to evaluate expressions, and `circuit` to evaluate circuits. Finally, provide the path to a valid JSON body as the final argument. This script relies on the `sys`, `json`, and `requests` libraries, and will format the JSON response appropriately to the console.

## Upsurge Frontend

The frontend for Upsurge is written in JavaScript using ReactJS. The goal is to have an interactive user interface which gracefully interacts with the backend server as well. The frontend is still in heavy development, so there will be more features in the `development` branch. 

### Usage

To use the frontend, use `npm i` to install the necessary packages, then use `npm start` to run the frontend server. The frontent listens on port 3000, so navigate to `localhost:3000` in your browser to see the frontend itself. 

There are features in development that demonstrate the connection between the frontend and the backend, though they aren't readily apparent to the user. Contact us to learn about these connections.

### Features

The main feature in the frontend at the moment is the canvas page. This page is where the user will be able to interact with the interface and create a circuit. As of now, we are still working on adding features such as gate, input, and output icons, and adding drag and drop functionality. However, you will see features in the `development` branch such as drawing to the canvas. 

The logic page is still under development, but it has features which allow it to both receive circuitry from the canvas page and communicate with the backend.

As of right now, there is no formal testing framework for the frontend.
