'use strict';

var _chai = require('chai');

var _babelEql = require('./helpers/babelEql');

var _babelEql2 = _interopRequireDefault(_babelEql);

var _ = require('../.');

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe(__filename, function () {
  context('single use', function () {
    it('should remove require call expression by extensions', function () {
      (0, _babelEql2.default)('\n        require(\'./index.less\');\n        require(\'./index.sass\');\n        require(\'babel\');\n      ', {
        plugins: [[_2.default, {
          extensions: ['.less', 'sass']
        }]]
      }).eql('\n      require(\'babel\');\n      ');
    });

    it('should remove require call expression by modules', function () {
      (0, _babelEql2.default)('\n        require(\'./index.less\');\n        require(\'./index.sass\');\n        require(\'babel\');\n        require(\'dogs\');\n      ', {
        plugins: [[_2.default, {
          extensions: ['.less', 'sass'],
          modules: ['dogs']
        }]]
      }).eql('\n      require(\'babel\');\n      ');
    });

    it('should not process when remove require call expression in assignment expression', function () {
      (0, _chai.expect)(function () {
        var source = '\n          var { a } = require(\'./index.less\');\n          require(\'babel\');\n        ';
        (0, _babelEql2.default)(source, {
          plugins: [[_2.default, {
            extensions: ['.less']
          }]]
        });
      }).to.throw('./index.less should not be assign to variable.');
    });

    it('should not process when remove require call expression in assignment expression', function () {
      (0, _chai.expect)(function () {
        var source = '\n          var { a } = require(\'dog\');\n          require(\'babel\');\n        ';
        (0, _babelEql2.default)(source, {
          plugins: [[_2.default, {
            modules: ['dog']
          }]]
        });
      }).to.throw('dog should not be assign to variable.');
    });

    it('should remove require call expression in other block', function () {
      (0, _babelEql2.default)('\n        (function (){\n           require(\'./index.sass\');\n           require(\'./index.less\');\n           require(\'babel\');\n        })();\n      ', {
        plugins: [[_2.default, {
          extensions: ['.less', '.sass']
        }]]
      }).eql('\n       (function (){\n          require(\'babel\');\n        })();\n      ');
    });
  });

  context('with babel-preset-es2015', function () {
    it('should remove require call expression', function () {
      (0, _babelEql2.default)('\n        require(\'./index.sass\');\n        require(\'babel\');\n      ', {
        presets: ['es2015'],
        plugins: [[_2.default, {
          extensions: ['.less', '.sass']
        }]]
      }).eql('\n        require(\'babel\');\n      ', {
        presets: ['es2015']
      });
    });

    it('should remove require call expression after import transformed', function () {
      (0, _babelEql2.default)('\n        import \'./index.less\';\n        import * as babel from \'babel\';\n      ', {
        presets: ['es2015'],
        plugins: [[_2.default, {
          extensions: ['.less', '.sass']
        }]]
      }).eql('\n        import * as babel from \'babel\';\n      ', {
        presets: ['es2015']
      });
    });

    it('should remove require call module expression after import transformed', function () {
      (0, _babelEql2.default)('\n        import \'./index.less\';\n        import * as dog from \'dog\';\n        import * as babel from \'babel\';\n      ', {
        presets: ['es2015'],
        plugins: [[_2.default, {
          extensions: ['.less', '.sass'],
          modules: ['dog']
        }]]
      }).eql('\n        import * as babel from \'babel\';\n      ', {
        presets: ['es2015']
      });
    });
  });
});