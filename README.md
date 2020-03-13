# Upsurge Backend
In here lies the code for the backend framework for Upsurge. This component contains the REST API architecture for the backend services, such as boolean parsing, truth tables, and expression evaluation. 

## Running
Before running this program, ensure that all necessary modules are installed by running `npm i` or `npm install`. Then, run the backend with `npm start` or `npm run start`.

## Usage
Currently, the backend suports POST calls to the `/exp` endpoint to evaluate boolean expressions passed as a string. Here is an example of an expected body:
```
{
    "expression": "x1 & (x2 | x3)"
}
```
The API expects that any binary connective takes exactly two statements, left and right, without any ambiguity (`x1 and x2 and x3` is invalid, as there is no way to determine which `and` is evaluated first). 

There are many ways to represent different connectives:
```
Binary AND: 'AND', 'and', '&', '∧', '·'
Binary OR:  'OR',  'or',  '|', '∨', '+'
Binary XOR: 'XOR', 'xor', '^', '⊕'
Binary NOT: 'NOT', 'not', '~', '!'
```
So the statement `x1 AND (x2 XOR x3)` is equivalent to `x1 & (x2 ⊕ x3)`.
