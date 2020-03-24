# Upsurge Backend
In here lies the code for the backend framework for Upsurge. This component contains the REST API architecture for the backend services, such as boolean parsing, truth tables, and expression evaluation. 

## Running
Before running this program, ensure that all necessary modules are installed by running `npm i` or `npm install`. Then, run the backend with `npm start` or `npm run start`. By default, this platform will run on port 3001.

## Usage
Currently, the backend suports POST calls to several different endpoints. 

### Boolean Expressions and Evaluations
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
So the statement `x1 AND (x2 XOR x3)` is equivalent to `x1 & (x2 ⊕ x3)`.

This endpoint will evaluate an expression by parsing the variables out of the expression and assigning all possible truth value combinations to the variables and matching them against the expression parse tree.

### Circuits
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

## Testing
To test the backend, run `npm test` - this will run the test suites located in the `test/` directory. This runs the suite of (currently) 75 test cases testing all the functionality in the `parse.js`, `assignment.js`, and `circuit.js` files. 

To test this manually, use curl commands to send JSON bodies to the specified endpoints. For example, you can use:
```
curl -X POST -H "Content-Type: application/json" -d {"expression": "(a and b)"} localhost:3001/exp
curl -X POST -H "Content-Type: application/json" -D @path/to/file.json localhost:3001/circuit
```