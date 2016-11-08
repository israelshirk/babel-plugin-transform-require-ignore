'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  function extFix(ext) {
    return ext.charAt(0) === '.' ? ext : '.' + ext;
  }

  return {
    visitor: {
      CallExpression: {
        enter: function enter(nodePath, _ref) {
          var opts = _ref.opts;

          var moduleName = void 0;

          var extensionsInput = [].concat(opts.extensions || []);
          var modulesInput = [].concat(opts.modules || []);
          if (extensionsInput.length === 0 && modulesInput.length === 0) {
            return;
          }
          var extensions = extensionsInput.map(extFix);
          var callee = nodePath.get('callee');

          if (callee.isIdentifier() && callee.equals('name', 'require')) {
            var arg = nodePath.get('arguments')[0];
            if (arg && arg.isStringLiteral() && extensions.indexOf(_path2.default.extname(arg.node.value)) > -1) {
              if (nodePath.parentPath.isVariableDeclarator()) {
                throw new Error(arg.node.value + ' should not be assign to variable.');
              } else {
                nodePath.remove();
              }
            }

            if (arg && arg.isStringLiteral()) {
              var _iteratorNormalCompletion = true;
              var _didIteratorError = false;
              var _iteratorError = undefined;

              try {
                for (var _iterator = modulesInput[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                  moduleName = _step.value;

                  if (arg.node.value === moduleName || arg.node.value.indexOf(moduleName + '/') === 0) {
                    if (nodePath.parentPath.isVariableDeclarator() && nodePath.parentPath.node.id && nodePath.parentPath.node.id.type === 'ObjectPattern') {
                      throw new Error(arg.node.value + ' should not be assign to variable.');
                    }
                    nodePath.remove();
                  }
                }
              } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                  }
                } finally {
                  if (_didIteratorError) {
                    throw _iteratorError;
                  }
                }
              }
            }
          }
        }
      }
    }
  };
};

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }