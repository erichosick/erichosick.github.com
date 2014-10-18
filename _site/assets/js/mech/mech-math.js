// mech-math.js
// version: 0.1.7
// author: Eric Hosick <erichosick@gmail.com> (http://www.erichosick.com/)
// license: MIT
(function() {
"use strict";

var root = this; // window (browser) or exports (server)
var m = root.m || {}; // merge with previous or new module
m._ = m._ || {}; // merge with pervious or new sub-module
m._["version-math"] = '0.1.7'; // version set through gulp build

// export module for node or the browser
if(typeof module !== 'undefined' && module.exports) {
  module.exports = m;
} else {
  root.m = m;
}

function DualArgF(){};
function dualArg(left,right) {
   var f = Object.create(DualArgF.prototype);
   f._l = ((null === left) || (undefined === left)) ? undefined : left;
   f._r = ((null === right) || (undefined === right)) ? undefined : right;
   return f;
};
DualArgF.prototype = Object.create(Object.prototype, {
   isMech: { get: function() { return true; }},
   l: { get: function() { return this._l; }},
   ls: { get: function() {
      if (undefined === this._l) {
         return 'undefined';
      } else {
         return this._l.isMech ? this._l.goStr : this._l.toString();
      }
   }},
   r: { get: function() { return this._r; } },
   rs: { get: function() {
      if (undefined === this._r) {
         return 'undefined';
      } else {
         return this._r.isMech ? this._r.goStr : this._r.toString();
      }
   }},
   go: { enumerable: false, get: function() { return this.goNum; } },
   goArr: { enumerable: false, get: function() { return [this.goNum]; } },
   goBool: { enumerable: false, get: function() { return (this.goNum > 0); } }
});
m.dualArg = dualArg;
m._.DualArgF = DualArgF;
function AddF(){};
function add(left,right) {
   var f = Object.create(AddF.prototype);
   f._l = ((null === left) || (undefined === left)) ? undefined : left;
   f._r = ((null === right) || (undefined === right)) ? undefined : right;
   return f;
};
AddF.prototype = Object.create(DualArgF.prototype, {
   goNum: { enumerable: false, get: function() {
      if (undefined === this._l || undefined === this._r) { return undefined; }
      var lf = this._l.isMech ? this._l.goNum : this._l;
      if (undefined === lf ) { return undefined; }
      var rf = this._r.isMech ? this._r.goNum : this._r;
      if ( undefined === rf ) { return undefined; }
      return lf + rf;
   }},
   goStr: { enumerable: false, get: function() { return "(" + this.ls + " + " + this.rs + ")"; }}
});
m.add = add;
m._.AddF = AddF;
function SubF(){};
function sub(left,right) {
   var f = Object.create(SubF.prototype);
   f._l = ((null === left) || (undefined === left)) ? undefined : left;
   f._r = ((null === right) || (undefined === right)) ? undefined : right;
   return f;
};
SubF.prototype = Object.create(DualArgF.prototype, {
   goNum: { enumerable: false, get: function() {
      if (undefined === this._l || undefined === this._r) { return undefined; }
      var lf = this._l.isMech ? this._l.goNum : this._l;
      if (undefined === lf ) { return undefined; }
      var rf = this._r.isMech ? this._r.goNum : this._r;
      if ( undefined === rf ) { return undefined; }
      return lf - rf;
   }},
   goStr: { enumerable: false, get: function() { return "(" + this.ls + " - " + this.rs + ")"; }}
});
m.sub = sub;
m._.SubF = SubF;
function MulF(){};
function mul(left,right) {
   var f = Object.create(MulF.prototype);
   f._l = ((null === left) || (undefined === left)) ? undefined : left;
   f._r = ((null === right) || (undefined === right)) ? undefined : right;
   return f;
};
MulF.prototype = Object.create(DualArgF.prototype, {
   goNum: { enumerable: false, get: function() {
      if (undefined === this._l || undefined === this._r) { return undefined; }
      var lf = this._l.isMech ? this._l.goNum : this._l;
      if (undefined === lf ) { return undefined; }
      var rf = this._r.isMech ? this._r.goNum : this._r;
      if ( undefined === rf ) { return undefined; }
      return lf * rf;
   }},
   goStr: { enumerable: false, get: function() { return "(" + this.ls + " * " + this.rs + ")"; }}
});
m.mul = mul;
m._.MulF = MulF;
function DivF(){};
function div(left,right) {
   var f = Object.create(DivF.prototype);
   f._l = ((null === left) || (undefined === left)) ? undefined : left;
   f._r = ((null === right) || (undefined === right)) ? undefined : right;
   return f;
};
DivF.prototype = Object.create(DualArgF.prototype, {
   goNum: { enumerable: false, get: function() {
      if (undefined === this._l || undefined === this._r) { return undefined; }
      var lf = this._l.isMech ? this._l.goNum : this._l;
      if (undefined === lf ) { return undefined; }
      var rf = this._r.isMech ? this._r.goNum : this._r;
      if ( undefined === rf ) { return undefined; }
      return lf / rf;
   }},
   goStr: { enumerable: false, get: function() { return "(" + this.ls + " / " + this.rs + ")"; }}
});
m.div = div;
m._.DivF = DivF;
function ModulusF(){};
function modulus(left,right) {
   var f = Object.create(ModulusF.prototype);
   f._l = ((null === left) || (undefined === left)) ? undefined : left;
   f._r = ((null === right) || (undefined === right)) ? undefined : right;
   return f;
};
ModulusF.prototype = Object.create(DualArgF.prototype, {
   goNum: { enumerable: false, get: function() {
      if (undefined === this._l || undefined === this._r) { return undefined; }
      var lf = this._l.isMech ? this._l.goNum : this._l;
      if (undefined === lf ) { return undefined; }
      var rf = this._r.isMech ? this._r.goNum : this._r;
      if ( undefined === rf ) { return undefined; }
      return lf % rf;
   }},
   goStr: { enumerable: false, get: function() { return "(" + this.ls + " % " + this.rs + ")"; }}
});
m.modulus = modulus;
m._.ModulusF = ModulusF;
function AddSF(){};
function addS(left,right) {
   var f = Object.create(AddSF.prototype);
   f._l = ((null === left) || (undefined === left)) ? undefined : left;
   f._r = ((null === right) || (undefined === right)) ? undefined : right;
   return f;
};
AddSF.prototype = Object.create(DualArgF.prototype, {
   isMech: { get: function() { return true; }},
   l: { get: function() { return this._l; } },
   r: { get: function() { return this._r; } },
   go: { enumerable: false, get: function() { return this.goStr; } },
   goStr: { enumerable: false, get: function() {
      if (undefined === this._l || undefined === this._r) { return undefined; }
      var lf = this._l.isMech ? this._l.goStr : this._l;
      if (undefined === lf ) { return undefined; }
      var rf = this._r.isMech ? this._r.goStr : this._r;
      if ( undefined === rf ) { return undefined; }
      return lf + rf;
   }},
   goArr: { enumerable: false, get: function() { return [this.goStr]; } },
   goBool: { enumerable: false, get: function() {
      var r = this.goStr;
      return (("" !== r) && (0 !== r) && (undefined !== r)); }
   }

});
m.addS = addS;
m._.AddSF = AddSF;
function MapF(){};
function map(algo,max) {
   var f = Object.create(MapF.prototype);
   f._a = algo;
   f._cache = null;
   f._max = ((null == max) || (undefined == max)) ? 1000 : max;
   return f;
};
MapF.prototype = Object.create(Object.prototype, {
   isMech: { get: function() { return true; }},
   go: { get: function() {
      if ( null === this._cache) {
         var algo = this._a;
         var isMechanism = algo.isMech;
         var max = this._max.isMech ? this._max.go : this._max;
         this._cache = [];
         var cur = isMechanism ? algo.go : algo;
         var i = 0;
         while ((undefined !== cur) && ( i < max)) {
            this._cache[i++] = cur;
            cur = isMechanism ? algo.go : algo;
         }
      }
      return this._cache;
   }},
   goNum: { get: function() { return this.go; }},
   goArr: { get: function() { return this.go; }}
});
m.map = map;
m._.MapF = MapF;
function JoinF(){};
function join(array,token) {
   var f = Object.create(JoinF.prototype);
   if (null === array || undefined === array) {
   	throw new RangeError("array must be defined.");
   }

   if (!(array instanceof Array) && !array.isMech) {
   	throw new RangeError("array must be an array type.");
   }

   f._arr = array;
   f._token = token;
   return f;
};
JoinF.prototype = Object.create(Object.prototype, {
   isMech: { get: function() { return true; }},
   go: { get: function() {
      if (this._arr.isMech) {
         var result = this._arr.go;
         if (result instanceof Array) {
            return result.join(this._token);
         } else {
   	      throw new RangeError("array must be an array type.");            
         }
      } else {
         return this._arr.join(this._token);
      }
   }},
   goArr: { get: function() { return this.go; }}
});
m.join = join;
m._.JoinF = JoinF;
function MinF(){};
function min() {
   var f = Object.create(MinF.prototype);
   f._args = arguments;
   return f;
};
MinF.prototype = Object.create(Object.prototype, {
   isMech: { get: function() { return true; }},
   go: { get: function() {
      var curMin = +Infinity;
      var args = this._args;
      for(var i=0; i < args.length; i++) {
         var temp = args[i].isMech ? args[i].go : args[i];
         if (temp < curMin) {
            curMin = temp;
         }
      }
      return curMin;
   }},
   goArr: { get: function() { return this.go; }}
});
m.min = min;
m._.MinF = MinF;
function MaxF(){};
function max() {
   var f = Object.create(MaxF.prototype);
   f._args = arguments;
   return f;
};
MaxF.prototype = Object.create(Object.prototype, {
   isMech: { get: function() { return true; }},
   go: { get: function() {
      var curMin = -Infinity;
      var args = this._args;
      for(var i=0; i < args.length; i++) {
         var temp = args[i].isMech ? args[i].go : args[i];
         if (temp > curMin) {
            curMin = temp;
         }
      }
      return curMin;
   }},
   goArr: { get: function() { return this.go; }}
});
m.max = max;
m._.MaxF = MaxF;

}.call(this));