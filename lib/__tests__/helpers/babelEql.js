'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = babelEql;

var _chai = require('chai');

var _babelCore = require('babel-core');

var babel = _interopRequireWildcard(_babelCore);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function trimLines(str) {
  return str.replace(/^\n+|\n+$/, '').replace(/\n+/g, '\n');
}

function babelEql(codeString) {
  var babelOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var code = babel.transform(codeString, babelOptions).code;
  return {
    eql: function eql(expectCode) {
      var expectCodeBabelOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return (0, _chai.expect)(trimLines(code)).to.eql(trimLines(babel.transform(expectCode, expectCodeBabelOptions).code));
    }
  };
}