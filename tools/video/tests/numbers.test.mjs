import test from 'node:test';
import assert from 'node:assert/strict';
import {formatCounter} from '../../../studio/src/production/numbers.mjs';
test('decimals, negative numbers and grouping survive final display',()=>{assert.equal(formatCounter('1.35',1),'1.35');assert.equal(formatCounter('-4.2',1),'-4.2');assert.equal(formatCounter('1,350',1),'1,350');});
test('scores and mixed units are not collapsed into misleading numbers',()=>{assert.equal(formatCounter('4–2',.5),'4–2');assert.equal(formatCounter('€1.35bn',1),'€1.35bn');});
test('animation progress is bounded and precision retained',()=>{assert.equal(formatCounter('1.35',0),'0.00');assert.equal(formatCounter('+10',2),'+10');});
