// mech-web.js
// version: 0.1.5
// author: Eric Hosick <erichosick@gmail.com> (http://www.erichosick.com/)
// license: MIT
(function() {
"use strict";

var root = this; // window (browser) or exports (server)
var m = root.m || {}; // merge with previous or new module
m._ = m._ || {}; // merge with pervious or new sub-module
m._["version-web"] = '0.1.5'; // version set through gulp build

// export module for node or the browser
if(typeof module !== 'undefined' && module.exports) {
  module.exports = m;
} else {
  root.m = m;
}

function elemById(id) {
   var f = Object.create(ElemById.prototype);
   f.id = id;
   return f;
};
function ElemById() {};
ElemById.prototype = Object.create ( Object.prototype, {
   isMech: { get: function() { return true }},
   id: { enumerable: false,
      get: function() { return this._id },
      set: function(d) {
         if ((null === d) || (undefined === d)) {
            throw ("id of elemById must be defined or a non-null value.")
         } else {
            this._id = d;
         }
      }
   },
   go: { enumerable: false,
      get: function() {
         var field = this._id.isMech ? this._id.go : this._id;
         if (field !== this._cId) {
            this._cId = field;
            this._cElem = document.getElementById(this._cId);
         }
         return this._cElem;
      }
   }
});
m.elemById = elemById;
m.e$ = elemById;
m._.ElemById = ElemById;

}.call(this));