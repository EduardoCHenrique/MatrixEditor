(function( window, document ) {

  var Matrix = window.Matrix = function(size) {
    this._matrix = new Array(size);
    for (var i = 0; i <= size; i++) {
      this._matrix[i] = new Int8Array(size);
    }
    return this;
  };

  Matrix.prototype.get = function () {
    return this._matrix;
  };

  Matrix.prototype.set = function (firstIndex, secondIndex, newValue) {
    this._matrix[firstIndex][secondIndex] = newValue;
  };

  Matrix.prototype.clearChunksByID = function( id ) {
    var that = this;
    that._matrix.forEach( function(line, y) {
      line.forEach(function(chunk, x) {
        if ( that._matrix[y][x] === parseInt(id) ) {
          that._matrix[y][x] = 0;
        } else if ( that._matrix[y][x] > parseInt(id) ) {
          that._matrix[y][x] -= 1;
        }
      });
    });
  }

})( window, document );
