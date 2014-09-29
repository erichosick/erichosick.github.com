var module = module || { exports: {} }; // Node.js OR On Web
var M = M || module.exports; // Node.JS or on web

function isDef (d) {
   return (( 0 == d) || !!d); // Should add in logic for NaN because NaN is defined.
}
module.exports.isDef = isDef;

function MechF(){};
MechF.prototype = Object.create(Object.prototype, {
   isMechanism: { enumerable: false,
      get: function() { return true; }
   }
});

function mech(d) {
   var f = Object.create(MechF.prototype);
   return f;
};
module.exports.mech = mech;

function PropGetF(){};
PropGetF.prototype = Object.create(MechF.prototype, {
   d: { enumerable: false,
      set: function(d) {
         if (isDef(d)) {
            this.itemGo = d.itemGo;
            this.prop = d.prop;
            this.item = d.item;
         } else {
            this._itemGo = true;
            this._prop = "";
            this._item = null;
         }
      }
   },
   prop: { enumerable: false,
      get: function() {  return this._prop.isMechanism ? this._prop.goStr : this._prop; },
      set: function(d) { this._prop = isDef(d) ? d : ""; }
   },
   item: { enumerable: false,
      get: function() { return this._itemGo ? this._item.go : this._item; },
      set: function(d) { this._item = d; }
   },
   itemGo: { enumerable: false,
      get: function() { return this._itemGo; },
      set: function(d) { this._itemGo = isDef(d) ? d : true; }
   },
   go: { enumerable: false, get: function() {
      var i = this.item;
      return isDef(i) ? i[this.prop] : undefined;
   }},
   goNum: { enumerable: false, get: function() { return Number(this.go); } },
   goStr: { enumerable: false, get: function() { return String(this.go); } },
   goArr: { enumerable: false, get: function() { return [this.go]; } },
   goBool: { enumerable: false, get: function() { return Boolean(this.go); }}
});
module.exports.propGet = function(prop, item, itemGo) {
   var f = Object.create(PropGetF.prototype);
   if ( undefined !== item ) {
      f.prop = prop;
      f.item = item;
      f.itemGo = itemGo;
   } else {
      f.d = prop;
   }
   return f;
};

function PropSetF(){};
PropSetF.prototype = Object.create(MechF.prototype, {
   d: { enumerable: false,
      set: function(d) {
         if (isDef(d)) {
            this._itemGo = isDef(d.itemGo) ? d.itemGo : true;
            this._destProp = isDef(d.destProp) ? d.destProp : "";
            this._src = d.src;
            this._dest = d.dest;
         } else {
            this._itemGo = true;
            this._destProp = "";
            this._dest = null;
            this._src = null;
         }
      }
   },
   itemGo: { enumerable: false, get: function() { return this._itemGo; } },
   destProp: { enumerable: false, get: function() {  return this._destProp; } },
   src: { enumerable: false, get: function() { return this._src.go; } },
   dest: {enumerable: false, get: function() { return this.itemGo ? this._dest.go : this._dest; } },
   go: { enumerable: false, get: function() {
      var s = this.src;
      var d = this.dest;
      if (isDef(d)) {
         d[this.destProp] = s;
      }
      return s;
   }},
});
module.exports.propSet = function(d) {
   var f = Object.create(PropSetF.prototype);
   f.d = d;
   return f;
}

function NumF(){};
NumF.prototype = Object.create(MechF.prototype, {
   v: { enumerable: false,
      get: function() { return this.goNum; },
      set: function(d) {
         d = isDef(d) ? (d.hasOwnProperty("v") ? d.v : d)  : d; // primitive or valid {v:val} object
         if (isDef(d)) {
            if ( d.isMechanism ) { // val was a mechanism
               this._v = d;
            } else {
               this._v = Number(d);
               if ( isNaN(this._v)) {
                  if ("NaN" != d.toString()) { // retain original bad value but NOT when NaN
                     this._vb = d;
                  }
               }
            }
         } else {
            this._v = (null === d) ? 0 : NaN; // Number(null) is 0
         }   
      }
   },
   unit: { enumerable: false, get: function() { return ""; } },
   go: { enumerable: false, get: function() { return this.goNum; } },
   goNum: { enumerable: false, get: function() { return this._v.isMechanism ? this._v.go : this._v; } },
   goStr: { enumerable: false, get: function() { return this._v.isMechanism ? this._v.goStr : this._vb ? this._vb.toString() : this._v.toString(); } },
   goArr: { enumerable: false, get: function() { return [this.goNum]; } },
   goBool: { enumerable: false, get: function() { return (this.goNum > 0); } }
});
function num(d) {
   var f = Object.create(NumF.prototype);
   f.v = (arguments.length == 0) ? 0 : d; // for same behavior as Number() == 0 and Number(undefined) == NaN
   return f;
};
module.exports.num = num;

function StrF(){};
StrF.prototype = Object.create(MechF.prototype, {
   v: { enumerable: false,
      get: function() { return this.goStr; },
      set: function(d) {
         d = isDef(d) ? (d.hasOwnProperty("v") ? d.v : d)  : d; // primitive or valid {v:val} object
         if (isDef(d)) {
            if (d.isMechanism) {
               this._v = d;
            } else {
               this._v = String(d);
            }
         } else {
            this._v = String(d);
         }
   }},
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
   goStr: { enumerable: false, get: function() {
      return this._v.isMechanism ? this._v.goStr : this._v;
   }},
   goArr: { enumerable: false, get: function() { return [this.goStr]; } },
   goBool: { enumerable: false, get: function() { return (this.goNum > 0); } }
});
module.exports.str = function(d){
   var f = Object.create(StrF.prototype);
   f.v = (arguments.length == 0) ? "" : d; // for same behavior as String() == "" and Number(undefined) == NaN;
   return f;
}

function DualArgF(){};
DualArgF.prototype = Object.create(MechF.prototype, {
   d: { enumerable: false,
      set: function(d) {
         if (d) {
            if ((0 == d.l) || d.l ) {
               this.l=d.l;
            } else {
               this._l = num(NaN);
            }
            if ((0 == d.r) || d.r ) {
               this.r=d.r;
            } else {
               this._r = num(NaN);
            }
         } else {
            this._l = num(NaN);
            this._r = num(NaN);
         }
      }
   },
   l: { enumerable: false,
      get: function() { return this._l; },
      set: function(d) { this._l = d ? ( isNaN(d) ? d : num(d) ) : num(); }
   },
   r: { enumerable: false,
      get: function() { return this._r; },
      set: function(d) { this._r = d ? ( isNaN(d) ? d : num(d) ) : num(); }
   },
   go: { enumerable: false, get: function() { return this.goNum; } },
   goArr: { enumerable: false, get: function() { return [this.goNum]; } },
   goBool: { enumerable: false, get: function() { return (this.goNum > 0); } }
});
module.exports.dualArg = function(d) {
   var f = Object.create(DualArgF.prototype);
   f.d = d; // (arguments.length == 0) ? {l:num(0),r:num(0)} : d; // for same behavior as Number() == 0 and Number(undefined) == NaN
   return f;
};

function AddF(){};
AddF.prototype = Object.create(DualArgF.prototype, {
   goNum: { get: function() { return this._l.goNum + this._r.goNum; } },
   goStr: { get: function() { return "(" + this._l.goStr + " + " + this._r.goStr + ")"; } }
});
module.exports.add = function(left,right) {
   var f = Object.create(AddF.prototype);
   if ( undefined !== right ) {
      f.l = left;
      f.r = right;
   } else {
      f.d = left;
   }
   return f;
};

function SubF(){};
SubF.prototype = Object.create(DualArgF.prototype, {
   goNum: { get: function() { return this._l.goNum - this._r.goNum; } },
   goStr: { get: function() { return "(" + this._l.goStr + " - " + this._r.goStr + ")"; } }
});
module.exports.sub = function(left,right) {
   var f = Object.create(SubF.prototype);
   if ( undefined !== right ) {
      f.l = left;
      f.r = right;
   } else {
      f.d = left;
   }
   return f;
};

function MulF(){};
MulF.prototype = Object.create(DualArgF.prototype, {
   goNum: { get: function() { return this._l.goNum * this._r.goNum; } },
   goStr: { get: function() { return "(" + this._l.goStr + " * " + this._r.goStr + ")"; } }
});
module.exports.mul = function(left,right) {
   var f = Object.create(MulF.prototype);
   if ( undefined !== right ) {
      f.l = left;
      f.r = right;
   } else {
      f.d = left;
   }
   return f;
};

function DivF(){};
DivF.prototype = Object.create(DualArgF.prototype, {
   goNum: { get: function() { return this._l.goNum / this._r.goNum; } },
   goStr: { get: function() { return "(" + this._l.goStr + " / " + this._r.goStr + ")"; } }
});
module.exports.div = function(left,right) {
   var f = Object.create(DivF.prototype);
   if ( undefined !== right ) {
      f.l = left;
      f.r = right;
   } else {
      f.d = left;
   }
   return f;
};


// Something is 0, false, null, undefined, NaN ""


// "" = 0 in javascript?






// Utils

// Console

// var WriteLnF = function() {};
// WriteLnF.prototype = {
//   get go() {
//      var r = this.d.text.goNum;
//      console.log(r);
//      return r;
//   },
//   get goNum() {
//      var r = this.d.text.goNum;
//      console.log(r);
//      return r;
//   },
//   get goArr() {
//      var r = this.d.text.goArr;
//      console.log(r);
//      return r;
//   },
//   get goStr() {
//      var r = this.d.text.goStr;
//      console.log(r);
//      return r;
//   }
// };
// function writeLn(d) { var f = new WriteLnF(); f.d = d; return f; };
// 
// module.exports.writeLn = writeLn;










// var ArrF = function() {};
// ArrF.prototype = {
//   get val() { return this.d.val; },
//   get go() { return this.d.val; },
//   get goNum() { return this.d.val[0]; },
//   get goArr() { return this.d.val; },
//   get goStr() { return "[" + this.d.val.toString() +"]"; }
// };
// 
// function arr(d) {
//    var f = new ArrF();
//    if ( !d.val ) { // num(6) used
//       f.d.val = d;
//    } else { // num ( { val : 6 } ) used
//       f.d = d;
//    }
//    return f;
// };

// var ScopeF = function() {};
// ScopeF.prototype = {
// };
// function scope(d) { var f = new ScopeF(); f.d = d; return f; };
// 
// var ScopeGetF = function() {};
// ScopeGetF.prototype = {
//    
// };
// function scopeGet(d) { var f = new ScopeGetF(); f.d = d; return f; };
// 
// var ScopeSetF = function() {};
// ScopeSetF.prototype = {
//    
// };
// function scopeSet(d) { var f = new ScopeSetF(); f.d = d; return f; };


// module.exports.num2 = num2;
// module.exports.arr = arr;
// module.exports.scope = scope;
// module.exports.scopeGet = scopeGet;
// module.exports.scopeSet = scopeSet;
 
// var MulF = function() {};
// MulF.prototype = {
//   get go() { return this.goNum; },
//   get goNum() { return this.d.left.goNum * this.d.right.goNum; },
//   get goStr() { return "(" + this.d.left.goStr + " * " + this.d.right.goStr + ")"; }
// };
// function mul(d) { var f = new MulF(); f.d = d; return f; };
// 
// var DivF = function() {};
// DivF.prototype = {
//   get go() { return this.goNum; },
//   get goNum() { return this.d.left.goNum / this.d.right.goNum; },
//   get goStr() { return "(" + this.d.left.goStr + " / " + this.d.right.goStr + ")"; }
// };
// function div(d) { var f = new DivF(); f.d = d; return f; };
// 
// 
// module.exports.add = add;
// module.exports.sub = sub;
// module.exports.mul = mul;
// module.exports.div = div;
