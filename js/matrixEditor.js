(function (window, document){

  var MatrixEditor = window.MatrixEditor = function (element, canvasSize, chunkSize) {

    this.width = element.width;
    this.element = element;
    this.context = element.getContext('2d');
    this.MY_Matrix  = new Matrix( this.width/chunkSize -1 );

    this.myColorPallet = new ColorPallet(document.getElementById("colorPicker"), this.MY_Matrix, this);

    this.chunkSize = chunkSize;
    this.matrixArea = document.getElementById('matrixArea');

    //Add Color
    this.element.addEventListener('click', function(ev) {
      this.paintChunk( ev, this.myColorPallet.selectedColor);
    }.bind(this));

    //Remove color with right mouse button
    this.element.addEventListener('contextmenu', function(ev) {
      ev.preventDefault();
      this.paintChunk(ev, 0);
    }.bind(this));

    this.render();

    return this;
  };

  MatrixEditor.prototype.paintChunk = function (e, colorNum) {
    if (colorNum !== undefined) {
      var x = Math.floor(e.offsetX / this.chunkSize);
      var y =  Math.floor(e.offsetY / this.chunkSize);
      this.MY_Matrix.set(y, x, colorNum);
      this.render();
    } else {
      alert('please select a color');
      }
  }

  MatrixEditor.prototype.update = function (x, y, value) {
    this.MY_Matrix.set(x, y, value);
  };

  MatrixEditor.prototype.refresh = function (id) {
    console.log(this.MY_Matrix);
  }

  MatrixEditor.prototype.render = function () {
    var that = this;
    var currentMatrix = this.MY_Matrix.get();

    currentMatrix.forEach( function( line, y ){
      line.forEach( function( collumn, x ){
        that.context.fillStyle = that.myColorPallet.getColor( currentMatrix[y][x] );
        that.context.fillRect( x * that.chunkSize, y * that.chunkSize, that.chunkSize, that.chunkSize );
        that.context.strokeStyle = 'black';
        that.context.lineWidth = 1;
        that.context.strokeRect( x * that.chunkSize, y * that.chunkSize, that.chunkSize, that.chunkSize );
        that.context.stroke();
      });
    });
  };

  MatrixEditor.prototype.exportMatrix = function () {
    var outputArray = [];
    this.matrixArea.value = this.MY_Matrix._matrix.map(function(arr){
      return '[' + arr.map(function(item){
        return item;
      }).join(',') + ']';
    });
  }

})(window, document);
