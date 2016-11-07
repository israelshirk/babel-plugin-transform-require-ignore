import path from 'path';

export default function () {
  function extFix(ext) {
    return ext.charAt(0) === '.' ? ext : ('.' + ext);
  }

  return {
    visitor: {
      CallExpression: {
        enter(nodePath, { opts }) {
          let moduleName;

          const extensionsInput = [].concat(opts.extensions || []);
          const modulesInput = [].concat(opts.modules || []);
          if (extensionsInput.length === 0 && modulesInput.length === 0) {
            return;
          }
          const extensions = extensionsInput.map(extFix);
          const callee = nodePath.get('callee');

          if (callee.isIdentifier() && callee.equals('name', 'require')) {
            const arg = nodePath.get('arguments')[0];
            if (arg && arg.isStringLiteral() && extensions.indexOf(path.extname(arg.node.value)) > -1) {
              if (nodePath.parentPath.isVariableDeclarator()) {
                throw new Error(`${arg.node.value} should not be assign to variable.`);
              } else {
                nodePath.remove();
              }
            }

            if (arg && arg.isStringLiteral()) {
              for (moduleName of modulesInput) {
                if (arg.node.value === moduleName || arg.node.value.indexOf(moduleName + '/') === 0) {
                  if (nodePath.parentPath.isVariableDeclarator() && nodePath.parentPath.node.id && nodePath.parentPath.node.id.type === 'ObjectPattern') {
                    throw new Error(`${arg.node.value} should not be assign to variable.`);
                  }
                  nodePath.remove();
                }
              }
            }
          }
        }
      }
    }
  };
}
