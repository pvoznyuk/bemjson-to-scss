/* global describe, it, beforeEach */

require('should');

describe('serialize', function() {
    var bemjson = new (require('..'))({
      compact: true,
      compileTo: 'css'
    });

    describe('css/content', function() {
        it('should return empty content #1', function() {
            bemjson.toCSS([
                false,
                null,
                undefined,
                [],
                '',
                { content: false }, // `div` is here
                { tag: false }
            ]).should.equal('');
        });
    });

    describe('css/elem', function() {
        var bemjson = new (require('..'))({
          compact: true,
          compileTo: 'css'
        });

        it('should set class to elem inside content', function() {
            bemjson.toCSS({
                block: 'button',
                content: [
                    { elem: 'control',
                      content: [{
                        elem: 'default'
                      }]}
                ]
            }).should.equal(
                '.button{}.button__control{}.button__default{}'
            );
        });
    })

    describe('scss/elem', function() {
        var bemjson = new (require('..'))({
          compact: true
        });

        it('should serialize to SCSS', function() {
            bemjson.toCSS({
              block: 'button',
              content: [
                  { elem: 'control',
                    content: [{
                      elem: 'default',
                      mods: {
                        active: true,
                        selected: true
                      }
                    }]}
              ]
          }).should.equal(
                '.button{&__control{}&__default{&--active{}&--selected{}}'
            );
        });
    })

    describe('css/mods', function() {
        var bemjson = new (require('..'))({
          compact: true,
          compileTo: 'css'
        });

        it('should set correct modification classes to elements', function() {
            bemjson.toCSS({
                block: 'button',
                mods: {
                  main: true,
                  hidden: false,
                },
                content: [
                    { elem: 'control',
                      content: [{
                        elem: 'default',
                        mods: {
                          active: true,
                          selected: true
                        }
                      }]}
                ]
            }).should.equal(
                '.button{}.button--main{}.button__control{}.button__default{}.button__default--active{}.button__default--selected{}'
            );
        });
    })
});
