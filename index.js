var _NL_ = '\n\n';
var _SP_ = ' ';

function BEMJSON (options) {
    options = options || {};
    options.compileTo = options.compileTo || 'scss';
    options.compact = options.compact || false;
    options.tab = options.tab || '  ';
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

function collect(array, result) {
  array.forEach(function(el) {
    if(Array.isArray(el.content)) {
      var content = Array.from(el.content);
      el.content = null;
      el._unified = true;
      result.push(el);
      collect(content, result);
    } else {
      el.content = null;
      el._unified = true;
      result.push(el);
    }

  });
}

function toObject(entity) {
  return (typeof entity === 'object') ? entity : {};
}

function mergeEqual(array) {
  var found = {};

  array.forEach(function(item, index) {
    if (found[item.elem]) {
      found[item.elem].mods = Object.assign({}, toObject(found[item.elem].mods), toObject(item.mods));
      array[index] = null;
    } else {
      found[item.elem] = item;
    }
  });

  while (array.indexOf(null) >= 0) {
    array.splice(array.indexOf(null), 1);
  }

  return array;
}

BEMJSON.prototype.unifyJSON = function prototype(bemjson) {
    if (Array.isArray(bemjson.content)) {
      var collected = [];
      collect(bemjson.content, collected);
      bemjson.content = mergeEqual(collected);
    }

    return bemjson;
};

BEMJSON.prototype.toCSS = function toCSS(bemjson, ctxBlock) {

    if ( !bemjson ) { return ''; }

    if (typeof bemjson === 'string') {
        try {
          bemjson = eval('(' + bemjson + ')');
        } catch (err) {
          return '';
        }
    }

    if (bemjson.block) {
        ctxBlock = bemjson.block;
    }

    if (!bemjson._unified) {
      bemjson = this.unifyJSON(bemjson);
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
                            res += `.${className}${this._options.modificatorSeparator}${key}${SP}{${NL}}${NL}`;
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
                            mods += `${modSpace}&${this._options.modificatorSeparator}${key}${SP}{${NL}${modSpace}}${NL}`;
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
