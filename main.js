function getFetch(){
  let inputVal = document.getElementById('barcode').value

  // if(inputVal.length !== 12 || inputVal.length < 12) {
  if(inputVal.length < 12) {
    // Or with padStart(0) to complete 12
    alert(`Please ensure the barcode is more than 11 characters`)
    return;
  }
  const url = `https://world.openfoodfacts.org/api/v0/product/${inputVal}.json`

  fetch(url)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        console.log(data)
        if (data.status === 1) {
          // call additional stuff
          const item = new ProductInfo(data.product)
          item.showInfo()
          item.listIngredients()
        } else if (data.status === 0) {
          alert(`product ${inputVal} not found. Please try another.`)
        }
      })
      .catch(err => {
          console.log(`error ${err}`)
      });
}

class ProductInfo {
  constructor(productData) { //Passing in data.product here (product is the name of the object from the fetch)
    this.name = productData.product_name
    this.ingredients = productData.ingredients
    this.image = productData.image_url
  }

  showInfo() {
    document.getElementById('product-img').src = this.image
    document.getElementById('product-name').innerText = this.name
  }

  listIngredients() {
    let tableRef = document.getElementById('ingredient-table')
    
    
    for(let i = 1; i < tableRef.rows.length;) {
      // we omitted the 'i++' increment because it made the loop skip rows it was deleting as everytime it deletes row 1, the next row comes up to be the new row 1 but our loop increases to 2 and skips the new row 1. By omitting it, we remain at row 1 and keep deleting as all rows will eventually become row 1.
      tableRef.deleteRow(i);
    }
    
    if(!(this.ingredients == null)) {
      for(let key in this.ingredients) {
        let newRow = tableRef.insertRow(-1) // inserts new row at end of table
        let newICell = newRow.insertCell(0) // inserts 1 cell at index 0 of newRow
        let newVCell = newRow.insertCell(1) // inserts 1 cell at index 1 of newRow
        let newIText = document.createTextNode(
          this.ingredients[key].text // this line goes to the 'ingredient' element of the products array, then goes through each item in the 'ingredients' array and gets the object/element/ with the property of 'text' that has the name of the ingredient.
          )
          // get's text from vegetarian property. If that text is falsy then return 'unknown'. == 'null' will return falsy.
          // let vegStatus = this.ingredients[key].vegetarian == null ? "unknown" : this.ingredients[key].vegetarian

          // OR we can reverse it saying if the result isn't truthy then return unknown else return the actual value. It works the same with above code.
          let vegStatus = !(this.ingredients[key].vegetarian) ? "unknown" : this.ingredients[key].vegetarian
          let newVText = document.createTextNode(vegStatus) // store's the text in veg prop
          newICell.appendChild(newIText) // puts the ingredient text in the 1st column
          newVCell.appendChild(newVText) // puts the veg text in the 2nd column

          if(vegStatus === "no") {
            newVCell.classList.add('non-veg-item')
          } else if (vegStatus === "unknown" || vegStatus === "maybe") {
            newVCell.classList.add('unsure-item')
          }
      }
    }
  }
}

// (011110038364), (000080007920) (041196910759)