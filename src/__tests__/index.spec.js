import { expect } from 'chai';
import babelEql from './helpers/babelEql';
import babelPluginTransformRequireIgnore from '../.';

describe(__filename, () => {
  context('single use', () => {
    it('should remove require call expression by extensions', () => {
      babelEql(`
        require('./index.less');
        require('./index.sass');
        require('babel');
      `, {
        plugins: [
          [
            babelPluginTransformRequireIgnore,
            {
              extensions: ['.less', 'sass']
            }
          ]
        ]
      }).eql(`
      require('babel');
      `);
    });

    it('should remove require call expression by modules', () => {
      babelEql(`
        require('./index.less');
        require('./index.sass');
        require('babel');
        require('dogs');
      `, {
        plugins: [
          [
            babelPluginTransformRequireIgnore,
            {
              extensions: ['.less', 'sass'],
              modules: ['dogs']
            }
          ]
        ]
      }).eql(`
      require('babel');
      `);
    });

    it('should not process when remove require call expression in assignment expression', () => {
      expect(() => {
        const source = `
          var { a } = require('./index.less');
          require('babel');
        `;
        babelEql(source, {
          plugins: [
            [
              babelPluginTransformRequireIgnore,
              {
                extensions: ['.less']
              }
            ]
          ]
        });
      }).to.throw('./index.less should not be assign to variable.');
    });

    it('should not process when remove require call expression in assignment expression', () => {
      expect(() => {
        const source = `
          var { a } = require('dog');
          require('babel');
        `;
        babelEql(source, {
          plugins: [
            [
              babelPluginTransformRequireIgnore,
              {
                modules: ['dog']
              }
            ]
          ]
        });
      }).to.throw('dog should not be assign to variable.');
    });

    it('should remove require call expression in other block', () => {
      babelEql(`
        (function (){
           require('./index.sass');
           require('./index.less');
           require('babel');
        })();
      `, {
        plugins: [
          [
            babelPluginTransformRequireIgnore,
            {
              extensions: ['.less', '.sass']
            }
          ]
        ]
      }).eql(`
       (function (){
          require('babel');
        })();
      `);
    });
  });

  context('with babel-preset-es2015', () => {
    it('should remove require call expression', () => {
      babelEql(`
        require('./index.sass');
        require('babel');
      `, {
        presets: [
          'es2015'
        ],
        plugins: [
          [
            babelPluginTransformRequireIgnore,
            {
              extensions: ['.less', '.sass']
            }
          ]
        ]
      }).eql(`
        require('babel');
      `, {
        presets: [
          'es2015'
        ]
      });
    });

    it('should remove require call expression after import transformed', () => {
      babelEql(`
        import './index.less';
        import * as babel from 'babel';
      `, {
        presets: [
          'es2015'
        ],
        plugins: [
          [
            babelPluginTransformRequireIgnore,
            {
              extensions: ['.less', '.sass']
            }
          ]
        ]
      }).eql(`
        import * as babel from 'babel';
      `, {
        presets: [
          'es2015'
        ]
      });
    });

    it('should remove require call module expression after import transformed', () => {
      babelEql(`
        import './index.less';
        import * as dog from 'dog';
        import * as babel from 'babel';
      `, {
        presets: [
          'es2015'
        ],
        plugins: [
          [
            babelPluginTransformRequireIgnore,
            {
              extensions: ['.less', '.sass'],
              modules: ['dog']
            }
          ]
        ]
      }).eql(`
        import * as babel from 'babel';
      `, {
        presets: [
          'es2015'
        ]
      });
    });
  });
});
