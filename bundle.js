(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.BEMJSON = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var _NL_ = '\n\n';
var _SP_ = ' ';

function BEMJSON (options) {
    options = options || {};
    options.compileTo = options.compileTo || 'scss';
    options.compact = options.compact || false;
    options.modificatorSeparator = options.modificatorSeparator || '--';

    this._options = options;
}

BEMJSON.prototype.concatinateArray = function concatinateArray(array, ctxBlock) {
    var res = '';
    for (var i = 0; i < array.length; i++) {
        if (array[i] !== undefined && array[i] !== false && array[i] !== null) {
            res += this.toCSS(array[i], ctxBlock);
        }
    }
    return res;
};

BEMJSON.prototype.toCSS = function toCSS(bemjson, ctxBlock) {

    if ( !bemjson ) { return ''; }

    if (typeof bemjson === 'string') {
        bemjson = eval('(' + bemjson + ')');
    }

    if (bemjson.block) {
        ctxBlock = bemjson.block;
    }

    if (Array.isArray(bemjson)) {
        return this.concatinateArray(bemjson, ctxBlock);
    }

    if (bemjson.tag === false) {
        return this.toCSS(bemjson.content || '', ctxBlock);
    }

    var NL = this._options.compact ? '' : _NL_;
    var SP = this._options.compact ? '' : _SP_;

    if (ctxBlock) {
        var className;

        if ( this._options.compileTo === 'css' ) {
            className = ctxBlock + (bemjson.elem ? '__' + bemjson.elem : '');
            if (className) {
                var res = `.${className}${SP}{${NL}}${NL}`;
                if (bemjson.mods) {
                    for (var key in bemjson.mods) {
                        if (bemjson.mods.hasOwnProperty(key)) {
                            if (bemjson.mods[key] == true ) {
                                res += `.${className}${this._options.modificatorSeparator}${key}${SP}{${NL}}${NL}`;
                            }
                        }
                    }
                }
                return res + this.toCSS(bemjson.content, ctxBlock);
            }
        } else {
            className =  bemjson.elem ? '&__' + bemjson.elem : '.' + ctxBlock;
            var space = bemjson.elem ? `${SP}${SP}` : ``;
            var modSpace = space + `${SP}${SP}`;

            if (className) {

                var mods = '';
                if (bemjson.mods) {
                    for (var key in bemjson.mods) {
                        if (bemjson.mods.hasOwnProperty(key)) {
                            if (bemjson.mods[key] == true ) {
                                mods += `${modSpace}&${this._options.modificatorSeparator}${key}${SP}{${NL}${modSpace}}${NL}`;
                            }
                        }
                    }
                }

                var contentCSS = this.toCSS(bemjson.content, ctxBlock);

                var res = bemjson.elem ? `${space}${className}${SP}{${NL}${mods}${space}}${NL}${contentCSS}` : `${className}${SP}{${NL}${mods}${contentCSS}`;

                return res;
            }
        }
    }

    return '';

};


module.exports = BEMJSON;

},{}]},{},[1])(1)
});