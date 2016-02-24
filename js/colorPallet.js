
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
    colorSample.className = 'colorPallet--sample-item--color';
    colorSample.style.backgroundColor = this.colors[dataId];

    //Button to delete list item
    var deleteButton = document.createElement('i');
    deleteButton.className = 'delete';
    deleteButton.addEventListener('click', this.deleteColorSwatch.bind(this));
    //list item node
    var listItem = document.createElement('li');
    listItem.className = 'colorPallet--sample-item';

    //Appending all nodes to list item
    listItem.setAttribute('data-id', dataId);
    listItem.appendChild(deleteButton);
    listItem.appendChild(colorSampleText);
    listItem.appendChild(colorSample);

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
