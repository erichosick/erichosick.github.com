var module = module || { exports: {} }; // Node.js OR On Web
var M = M || require ("./mCore.js") || module.exports; // Node.JS or on web

var document = document || null;
if ( document ) { // Check if ran in browser. Don't do anything if not ran in a browser

   function GetElemById() {};
   GetElemById.prototype = Object.create ( MechF.prototype, {
      id: { enumerable: false,
         get: function() { return this._id },
         set: function(d) {
            this._id = isDef(d) ? (d.hasOwnProperty("id") ? d.id : d)  : d; // primitive or valid {id:val} object
         }
      },
      go: { enumerable: false, get: function() {
           return isDef(this._id) ? ( this._id.isMechanism ? document.getElementById(this._id.go) : document.getElementById(this._id)) : null;
         }
      }
   });
   function getElemById(id) {
      var f = Object.create(GetElemById.prototype);
      f.id = id;
      return f;
   };
   module.exports.getElemById = getElemById;
   module.exports.e$ = getElemById;
}
