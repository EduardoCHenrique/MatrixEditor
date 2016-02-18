(function (window, document){

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

  var MatrixEditor = window.MatrixEditor = function (element, canvasSize, chunkSize) {

    this.width = element.width;
    this.element = element;
    this.context = element.getContext('2d');
    this.MY_Matrix  = new Matrix( this.width/chunkSize -1 );

    this.myColorPallet = new ColorPallet(document.getElementById("colorPicker"));

    this.chunkSize = chunkSize;
    this.matrixArea = document.getElementById('matrixArea');

// Add Color
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
    console.log(colorNum);
    if (colorNum) {
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

  MatrixEditor.prototype.render = function () {
    var that = this;
    var currentMatrix = this.MY_Matrix.get();
    currentMatrix.forEach(function( line, y ){
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

// ColorPallet ----------------------------------------------------------------------

  var ColorPallet = window.ColorPallet = function(element){
    this.element = element;
    this.colors = ['#ccc']; // <- default color
    this.currentColor = element.value;
    this.addButton = document.getElementById('addColor');
    this.selectedColor;

    element.addEventListener('change', this.setColor.bind(this));
    this.addButton.addEventListener('click', this.addColorSample.bind(this, element.value));


  }

  ColorPallet.prototype.setColor = function() {
    this.currentColor = this.element.value;
  }

  ColorPallet.prototype.getColor = function(index) {
    return this.colors[index];
  }

  ColorPallet.prototype.addColorSample = function( value, event ) {
    this.colors.push(this.currentColor);

    var container = document.getElementsByClassName('colorSwatches'),
        lastItem = this.colors.length -1 ,
        listItem = createNode( 'li', 'colorSwatches--sample', container[0], null, lastItem),
        sample = createNode( 'input', 'sample', listItem, 'color', 'teste', this.currentColor);

    listItem.addEventListener('click' , this.selectColor.bind(this));
  }

  ColorPallet.prototype.selectColor = function( e ) {
    var elementList = document.getElementsByClassName('selected');

    if ( elementList[0] )
    // if there's someone selected clear it
      elementList[0].classList.remove('selected');

    //Add to the current element
    e.target.classList.add('selected');
    // find it again
    elementList = document.getElementsByClassName('selected');

    this.selectedColor = elementList[0].attributes['data-id'].value;
    return;
  }

//Helper
  function createNode ( el, className, container, type, dataId, value ) {

    var nodeElement = document.createElement(el);
    nodeElement.type = type;
    nodeElement.className = className;
    nodeElement.value = value || false;
    nodeElement.setAttribute('data-id', dataId);
    container.appendChild(nodeElement);

    return nodeElement;
  }


})(window, document);
