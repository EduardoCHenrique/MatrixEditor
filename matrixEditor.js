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

  Matrix.prototype.clearChunksByID = function( id ) {
    var that = this;
    that._matrix.forEach( function(line, y) {
      line.forEach(function(chunk, x) {
        if ( that._matrix[y][x] === parseInt(id) ) {
          console.log(y, x);
          that._matrix[y][x] = 0;
          console.log('that._matrix', that._matrix[y][x]);
        }
      });
    });
  }

// Matrix Editor ----------------------------------------------------------------------

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
    currentMatrix.forEach(function( line, y ){
      line.forEach( function( collumn, x ){
        console.log('getColor', that.myColorPallet.getColor( currentMatrix[y][x] ));
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

  var ColorPallet = window.ColorPallet = function(element, matrix, matrixEditor){
    this.myMatrixEditor = matrixEditor;
    this.myMatrix = matrix;
    this.element = element;
    this.colors = []; // <- default color
    this.currentColor = element.value;
    this.addButton = document.getElementById('addColor');
    this.colorList = document.getElementsByClassName('colorSwatches')[0];
    this.selectedColor;

    element.addEventListener('change', this.setColor.bind(this));
    this.addButton.addEventListener('click', this.addColorSample.bind(this));

    this.addColorSample();

  }

  ColorPallet.prototype.setColor = function() {
    this.currentColor = this.element.value;
  }

  ColorPallet.prototype.getColor = function(index) {
    return this.colors[index];
  }

  ColorPallet.prototype.addColorSample = function( event, oldColor ) {
    //Add color into colors array
    this.colors.push(this.currentColor);

    //create colorswatch in listItem with its values
    var id = this.colors.length,
        listItem = this.createColorSwatch( id, this.colorList );

    //Append list Item into container
    this.colorList.appendChild(listItem);

    //Add select event to colorSwatch
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
  }

  ColorPallet.prototype.createColorSwatch = function( id, container ) {
    var dataId = id - 1;
    //Reference and hexa color inside listItem
    var colorSampleText = document.createElement('span');

    // colorSampleText.textContent = dataId + ": " + this.colors[dataId];
    colorSampleText.textContent = this.colors[dataId];

    //Color sample with background color
    var colorSample = document.createElement('span');
    colorSample.className = 'colorSample';
    colorSample.style.backgroundColor = this.colors[dataId];

    //Button to delete list item
    var deleteButton = document.createElement('i');
    deleteButton.className = 'delete';
    deleteButton.addEventListener('click', this.deleteColorSwatch.bind(this));
    //list item node
    var listItem = document.createElement('li');
    listItem.className = 'colorSwatches--sample';

    //Appending all nodes to list item
    listItem.setAttribute('data-id', dataId);
    listItem.appendChild(colorSampleText);
    listItem.appendChild(colorSample);
    listItem.appendChild(deleteButton);

    return listItem;
  }

  ColorPallet.prototype.deleteColorSwatch = function(e) {
    //Prevent click in list Item
    e.stopPropagation();

    var currentItemId = e.target.parentElement.attributes['data-id'].value,
        childElement = this.colorList;
    //Remove Dom node
    this.colorList.removeChild( this.colorList.children[currentItemId] );
    //Remove color from colors array
    this.colors.splice(currentItemId, 1);
    //Refresh data-id
    this.refreshSwatches();
    this.myMatrix.clearChunksByID(currentItemId);
    this.myMatrixEditor.render();
    console.log();
  }

  ColorPallet.prototype.refreshSwatches = function(e) {
    var that = this;
    //transform array like in array
    var interableArray = Array.from(this.colorList.children);

    interableArray.forEach(function(color, index) {
      that.colorList.children[index].setAttribute('data-id', index);
    });
  }

  ColorPallet.prototype.refreshMatrix = function(idToClear) {
    console.log('idToClear', Matrix.get());

  }



})(window, document);
