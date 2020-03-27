const circuit = require('../circuit');

const tc1 = require('./testCircuit1');
const tc2 = require('./testCircuit2');
const tc3 = require('./testCircuit3');
const tc4 = require('./testCircuit4');
const tc5 = require('./testCircuit5');
const tc6 = require('./testCircuit6');

describe('test getSubComp', () => {
    test('getSubComp tc1.component1 x1', () => {
        expect(circuit.getSubComp(tc1.component1, 'x1')).toStrictEqual({
            "name": "x1",
            "type": "static",
            "value": true
        });
    });

    test('getSubComp tc2.component1 x1', () => {
        expect(circuit.getSubComp(tc2.component1, 'x1')).toStrictEqual({
            "name": "x1",
            "type": "static",
            "value": true
        });
    });

    test('getSubComp tc3.component1 x1', () => {
        expect(circuit.getSubComp(tc3.component1, 'x1')).toStrictEqual({
            "name": "x1",
            "type": "static",
            "value": true
        });
    });

    test('getSubComp tc4.box y1', () => {
        expect(circuit.getSubComp(tc4.box, 'y1')).toStrictEqual({
            "name": "y1",
            "type": "placeholder"
        });
    });

    test('getSubComp tc4.component1 box', () => {
        expect(circuit.getSubComp(tc4.component1, 'box')).toStrictEqual({
            "name": "box",
            "type": "component",
            "inputs": ["x1", "x2"]
        });
    });

    test('getSubComp tc5.box xor', () => {
        expect(circuit.getSubComp(tc5.box, 'xor')).toStrictEqual({
            "name": "xor",
            "type": "xor",
            "inputs": ["y1", "y2"]
        });
    });
});

describe('test getSubExpr', () => {
    test('getSubExpr tc1.component1 o1', () => {
        expect(circuit.getSubExpr(tc1,  tc1.component1, circuit.getSubComp(tc1.component1, 'not1'))).toStrictEqual("not x1");
    });

    test('getSubExpr tc2.compenent1 and1', () => {
        expect(circuit.getSubExpr(tc2,  tc2.component1, circuit.getSubComp(tc2.component1, 'and1'))).toStrictEqual("( x1 and x2 )");
    });
    
    test('getSubExpr tc2.compenent1 or1', () => {
        expect(circuit.getSubExpr(tc2,  tc2.component1, circuit.getSubComp(tc2.component1, 'or1'))).toStrictEqual("( ( x1 and x2 ) or x3 )");
    });
    
    test('getSubExpr tc3.compenent1 or1', () => {
        expect(circuit.getSubExpr(tc3,  tc3.component1, circuit.getSubComp(tc3.component1, 'or1'))).toStrictEqual("( ( x3 or x1 ) or ( x1 and x2 ) )");
    });
    
    test('getSubExpr tc4.box and', () => {
        expect(circuit.getSubExpr(tc4,  tc4.box, circuit.getSubComp(tc4.box, 'and'))).toStrictEqual("( y1 and y2 )");
    });
    
    test('getSubExpr tc4.component1 box', () => {
        expect(circuit.getSubExpr(tc4,  tc4.component1, circuit.getSubComp(tc4.component1, 'box'))).toStrictEqual("( x1 and x2 )");
    });
});

describe('test generateComponentExprs', () => {
    test('generateComponentExprs tc1.component1', () => {
        expect(circuit.generateComponentExprs(tc1, tc1.component1)).toStrictEqual(['not x1']);
    });

    test('generateComponentExprs tc2.component1', () => {
        expect(circuit.generateComponentExprs(tc2, tc2.component1)).toStrictEqual(['( ( x1 and x2 ) or x3 )']);
    });

    test('generateComponentExprs tc3.component1', () => {
        expect(circuit.generateComponentExprs(tc3, tc3.component1)).toStrictEqual(['( ( x3 or x1 ) or ( x1 and x2 ) )', '( x1 and x2 )']);
    });

    test('generateComponentExprs tc4.component1', () => {
        expect(circuit.generateComponentExprs(tc4, tc4.component1)).toStrictEqual(['( x1 and x2 )']);
    });

    test('generateComponentExprs tc4.box', () => {
        expect(circuit.generateComponentExprs(tc4, tc4.box)).toStrictEqual(['( y1 and y2 )']);
    });

    test('generateComponentExprs tc5.component1', () => {
        expect(circuit.generateComponentExprs(tc5, tc5.component1)).toStrictEqual(['( ( x1 xor x2 ) and x3 )']);
    });

    test('generateComponentExprs tc5.box', () => {
        expect(circuit.generateComponentExprs(tc5, tc5.box)).toStrictEqual(['( y1 xor y2 )']);
    });
});

describe('test generateCircuitExprs', () => {
    test('generateCircuitExprs tc1', () => {
        expect(circuit.generateCircuitExprs(tc1)).toStrictEqual([['not x1']]);
    });

    test('generateCircuitExprs tc2', () => {
        expect(circuit.generateCircuitExprs(tc2)).toStrictEqual([['( ( x1 and x2 ) or x3 )']]);
    });

    test('generateCircuitExprs tc3', () => {
        expect(circuit.generateCircuitExprs(tc3)).toStrictEqual([['( ( x3 or x1 ) or ( x1 and x2 ) )', '( x1 and x2 )']]);
    });

    test('generateCircuitExprs tc4', () => {
        expect(circuit.generateCircuitExprs(tc4)).toStrictEqual([['( x1 and x2 )'], ['( y1 and y2 )']]);
    });

    test('generateCircuitExprs tc5', () => {
        expect(circuit.generateCircuitExprs(tc5)).toStrictEqual([['( ( x1 xor x2 ) and x3 )'], ['( y1 xor y2 )']]);
    });
});

describe('test getCompAssignment', () => {
    test('getCompAssignment tc1.component1', () => {
        expect(circuit.getCompAssignment(tc1, tc1.component1)).toStrictEqual({
            'x1': true
        });
    });

    test('getCompAssignment tc2.component1', () => {
        expect(circuit.getCompAssignment(tc2, tc2.component1)).toStrictEqual({
            'x1': true,
            'x2': false,
            'x3': true
        });
    });

    test('getCompAssignment tc3.component1', () => {
        expect(circuit.getCompAssignment(tc3, tc3.component1)).toStrictEqual({
            'x1': true,
            'x2': false,
            'x3': false
        });
    });

    test('getCompAssignment tc4.component1', () => {
        expect(circuit.getCompAssignment(tc4, tc4.component1)).toStrictEqual({
            'x1': false,
            'x2': false,
            'x3': true
        });
    });

    test('getCompAssignment tc4.box', () => {
        expect(circuit.getCompAssignment(tc4, tc4.box)).toStrictEqual({});
    });

    test('getCompAssignment tc5.component1', () => {
        expect(circuit.getCompAssignment(tc5, tc5.component1)).toStrictEqual({
            'x1': true,
            'x2': true,
            'x3': true
        });
    });

    test('getCompAssignment tc5.box', () => {
        expect(circuit.getCompAssignment(tc5, tc5.box)).toStrictEqual({});
    });

    test('getCompAssignment tc6.component1', () => {
        expect(circuit.getCompAssignment(tc6, tc6.component1)).toStrictEqual({
            'x1': true,
            'x2': true,
            'x3': true,
            'z1': true
        });
    });
});

describe('test evaluateCircuit', () => {
    test('evaluateCircuit tc1', () => {
        expect(circuit.evaluateCircuit(tc1)).toStrictEqual([{
            'x1': [true],
            'not x1': [false]
        }])
    });
    
    test('evaluateCircuit tc2', () => {
        expect(circuit.evaluateCircuit(tc2)).toStrictEqual([{
            'x1': [true],
            'x2': [false],
            'x3': [true],
            '( ( x1 and x2 ) or x3 )': [true]
        }])
    });
    
    test('evaluateCircuit tc3', () => {
        expect(circuit.evaluateCircuit(tc3)).toStrictEqual([{
            'x1': [true],
            'x2': [false],
            'x3': [false],
            '( ( x3 or x1 ) or ( x1 and x2 ) )': [true],
            '( x1 and x2 )': [false]
        }])
    });
    
    test('evaluateCircuit tc4', () => {
        expect(circuit.evaluateCircuit(tc4)).toStrictEqual([{
            'x1': [false],
            'x2': [false],
            'x3': [true],
            '( x1 and x2 )': [false]
        }, {
            'y1': [false, false, true, true],
            'y2': [false, true, false, true],
            '( y1 and y2 )': [false, false, false, true]
        }])
    });
    
    test('evaluateCircuit tc5', () => {
        expect(circuit.evaluateCircuit(tc5)).toStrictEqual([{
            'x1': [true],
            'x2': [true],
            'x3': [true],
            '( ( x1 xor x2 ) and x3 )': [false]
        }, {
            'y1': [false, false, true, true],
            'y2': [false, true, false, true],
            '( y1 xor y2 )': [false, true, true, false]
        }])
    });
    
    test('evaluateCircuit tc6', () => {
        expect(circuit.evaluateCircuit(tc6)).toStrictEqual([{
            'x1': [true],
            'x2': [true],
            'x3': [true],
            'z1': [true],
            '( ( ( x1 and x2 ) and z1 ) and x3 )': [true]
        }, {
            'y1': [false, false, true, true],
            'y2': [false, true, false, true],
            'z1': [true, true, true, true], 
            '( ( y1 and y2 ) and z1 )': [false, false, false, true]
        }])
    });
});
