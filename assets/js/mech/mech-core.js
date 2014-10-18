// mech-core.js
// version: 0.1.15
// author: Eric Hosick <erichosick@gmail.com> (http://www.erichosick.com/)
// license: MIT
(function() {
"use strict";

var root = this; // window (browser) or exports (server)
var m = root.m || {}; // merge with previous or new module
m._ = m._ || {}; // merge with pervious or new sub-module
m._["version-core"] = '0.1.15'; // version set through gulp build

// export module for node or the browser
if(typeof module !== 'undefined' && module.exports) {
  module.exports = m;
} else {
  root.m = m;
}

// A number primitive that can not contain a primitive
function NumF(){};
function num(d) {
   var f = Object.create(NumF.prototype);
   f.v = (arguments.length == 0) ? 0 : d; // for same behavior as Number() == 0 and Number(undefined) == NaN
   return f;
};
NumF.prototype = Object.create(Object.prototype, {
   v: { enumerable: false,
      get: function() { return this.goNum; },
      set: function(d) {
         if ((null === d) || (undefined === d)) {
            this._v = (undefined === d) ? NaN : 0;
         } else {
            this._v = Number(d);
            if ( isNaN(this._v)) {
               if ("NaN" != d.toString()) { // retain original bad value but NOT when NaN
                  this._vb = d;
               }
            }
         }
      }
   },
   unit: { enumerable: false, get: function() { return ""; } },   
   go: { enumerable: false, get: function() { return this.goNum; } },
   goNum: { enumerable: false, get: function() { return this._v; } },
   goStr: { enumerable: false, get: function() { return this._vb ? this._vb.toString() : this._v.toString(); } },
   goArr: { enumerable: false, get: function() { return [this.goNum]; } },
   goBool: { enumerable: false, get: function() { return (this.goNum > 0); } }
});
NumF.prototype.isMech = true;
NumF.prototype.isNull = false;
NumF.prototype.isPrim = true;
m.num = num;
m._.NumF = NumF;
// A number primitive that can contain a primitive.
function NumMF(){}; 
function numM(d) {
   var f = Object.create(NumMF.prototype);
   f.v = (arguments.length == 0) ? 0 : d;
   return f;
};
NumMF.prototype = Object.create(NumF.prototype, {
   v: { enumerable: false,
      get: function() { return this.goNum; },
      set: function(d) {
         if ((null === d) || (undefined === d)) {
            this._v = (undefined === d) ? NaN : 0;
         } else {
            this._v = d.isMech ? d : Number(d);
            if ( isNaN(this._v)) {
               if ("NaN" != d.toString()) { // retain original bad value but NOT when NaN
                  this._vb = d;
               }
            }
         }
      }
   },
   goNum: { enumerable: false, get: function() { return this._v.isMech ? this._v.goNum : this._v; } },
   goStr: { enumerable: false, get: function() { return this._v.isMech ? this._v.goStr : this._vb ? this._vb.toString() : this._v.toString(); } },
});
m.numM = numM;
m._.NumMF = NumMF;
function StrF(){};
function str(d){
   var f = Object.create(StrF.prototype);
   f.v = (arguments.length == 0) ? "" : d;
   return f;
}
StrF.prototype = Object.create(Object.prototype, {
   v: { enumerable: false,
      get: function() { return this.goStr; },
      set: function(d) { this._v = String(d); }},
   go: { enumerable: false, get: function() { return this.goStr; } },
   goNum: { enumerable: false, get: function() {
      var v = this.goStr;
      switch(v) {
         case "false":
            return 0;
            break;
         case "true":
            return 1;
            break;
         default:
            return Number(v);
      }
   }},
   goStr: { enumerable: false, get: function() { return this._v; }},
   goArr: { enumerable: false, get: function() { return [this.goStr]; } },
   goBool: { enumerable: false, get: function() { return (this.goNum > 0); } }
});
StrF.prototype.isMech = true;
StrF.prototype.isNull = false;
StrF.prototype.isPrim = true;
m.str = str;
m._.StrF = StrF;
function StrMF(){};
function strM(d){
   var f = Object.create(StrMF.prototype);
   f.v = (arguments.length == 0) ? "" : d;
   return f;
}
StrMF.prototype = Object.create(StrF.prototype, {
   v: { enumerable: false,
      get: function() { return this.goStr; },
      set: function(d) {
         if ((!((null === d) || (undefined === d))) && (d.isMech)){
            this._v = d;
         } else {
            this._v = String(d);
         }
   }},
   goStr: { enumerable: false, get: function() {
      return this._v.isMech ? this._v.goStr : this._v;
   }},
});
m.strM = strM;
m._.StrMF = StrMF;
function PropGetF(){};
function propGet(prop, item, itemGo) {
   var f = Object.create(PropGetF.prototype);
   f.prop = prop;
   f.item = item;
   f.itemGo = itemGo;
   return f;
};
PropGetF.prototype = Object.create(Object.prototype, {
   prop: { enumerable: false,
      get: function() {  return this._prop.isMech ? this._prop.goStr : this._prop; },
      set: function(d) { this._prop = ((null === d) || (undefined === d)) ? "" : d; }
   },
   item: { enumerable: false,
      get: function() { return ((null === this._item) || (undefined === this._item)) ? null : (this._itemGo ? this._item.go : this._item); },
      set: function(d) { this._item = ((null === d) || (undefined === d)) ? null : d; }
   },
   itemGo: { enumerable: false,
      get: function() { return this._itemGo; },
      set: function(d) { this._itemGo = ((null === d) || (undefined === d)) ? true : d; }
   },
   go: { enumerable: false, get: function() {
      var i = this.item;
      return ((null === i) || (undefined === i)) ? null : i[this.prop];
   }},
   goNum: { enumerable: false, get: function() {
      var i = this.go;
      return (null === i) ? NaN : Number(this.go);
   }},
   goStr: { enumerable: false, get: function() {
      var i = this.go;
      return (null == i) ? "" : String(this.go);
   }},
   goArr: { enumerable: false, get: function() { return [this.go]; } },
   goBool: { enumerable: false, get: function() { return Boolean(this.go); }}
});
PropGetF.prototype.isMech = true;
PropGetF.prototype.isNull = false;
PropGetF.prototype.isPrim = false;
m.propGet = propGet;
m.p$ = propGet;
m._.PropGetF = PropGetF;
function PropSetF(){};
function propSet(prop, dest, src, itemGo) {
   var f = Object.create(PropSetF.prototype);
      f.prop = prop;
      f.dest = dest;
      f.src = src;
      f.itemGo = itemGo;
   return f;
};
PropSetF.prototype = Object.create(Object.prototype, {
   prop: { enumerable: false,
      get: function() {  return this._prop.isMech ? this._prop.goStr : this._prop; },
      set: function(d) { this._prop = ((null === d) || (undefined === d)) ? "" : d; }
   },
   src: { enumerable: false,
      get: function() { return null === this._src ? null : (this._src.isMech ? this._src.go : this._src); },
      set: function(d) { this._src = ((null === d) || (undefined === d)) ? null : d; }
   },
   dest: { enumerable: false,
      get: function() { return this._itemGo ? (null === this._dest ? null : this._dest.go) : this._dest; },
      set: function(d) { this._dest = ((null === d) || (undefined === d)) ? null : d; }
   },
   itemGo: { enumerable: false,
      get: function() { return this._itemGo; },
      set: function(d) { this._itemGo = ((null === d) || (undefined === d)) ? true: d; }
   },
   go: { enumerable: false, get: function() {
      var s = this.src;
      var d = this.dest;
      if (!((null === d) || (undefined === d))) {
         d[this.prop] = s;
      }
      return s;
   }}
});
PropSetF.prototype.isMech = true;
PropSetF.prototype.isNull = false;
PropSetF.prototype.isPrim = false;
m.propSet = propSet;
m.p$s = propSet;
m._.PropSetF = PropSetF;
function WriteLnF(){};
function writeLn(text) {
   var f = Object.create(WriteLnF.prototype);
   f.text = text;
   return f;
}
WriteLnF.prototype = Object.create(Object.prototype, {
   text: { enumerable: false,
      get: function() {  return this._t.isMech ? this._t.goStr : this._t; },
      set: function(d) { this._t = ((null === d) || (undefined === d)) ? "" : d; }
   },
   go: { enumerable: false, get: function() {
      return this.goStr;
   }},
   goStr: { enumerable: false, get: function() {
      var i = this._t.isMech ? this._t.goStr : this._t;
      console.log(i);
      return i;
   }},
   goNum: { enumerable: false, get: function() {
      var i = this._t.isMech ? this._t.goNum : this._t;
      i = Number(i);
      console.log(i.toString());
      return i;
   }}
});
WriteLnF.prototype.isMech = true;
WriteLnF.prototype.isNull = false;
WriteLnF.prototype.isPrim = false;
m.writeLn = writeLn;
m._.WriteLnF = WriteLnF;

}.call(this));