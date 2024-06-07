var productTitleInput = document.getElementById("productTitle");
var productPriceInput = document.getElementById("productPrice");
var productCategoryInput = document.getElementById("productCategory");
var productImageInput = document.getElementById("productImage");
var productDescInput = document.getElementById("productDesc");
var productSearchInput = document.getElementById("productSearch");
var addBtn = document.getElementById("addBtn");
var updateBtn = document.getElementById("updateBtn");
var inputFields = document.querySelectorAll(".form-control");
var productLocalKey = "allProducts";
var productList = [];

if (JSON.parse(localStorage.getItem(productLocalKey))) {
    productList = JSON.parse(localStorage.getItem(productLocalKey));
    displayProducts(productList);
}

function addProduct() {
    if (validateFormInputs(productTitleInput) &&
        validateFormInputs(productPriceInput) &&
        validateFormInputs(productCategoryInput) &&
        validateFormInputs(productImageInput) &&
        validateFormInputs(productDescInput)) {
        var product = {
            title: productTitleInput.value,
            price: productPriceInput.value,
            category: productCategoryInput.value,
            image: `images/${productImageInput.files[0]?.name}`,
            description: productDescInput.value
        }

        productList.push(product);
        addToLocalStorage();
        fillFormValues();
        displayProducts(productList);
    }


}

function addToLocalStorage() {
    localStorage.setItem(productLocalKey, JSON.stringify(productList));
}

function fillFormValues(product) {
    productTitleInput.value = product ? product.title : '';
    productPriceInput.value = product ? product.price : '';
    productCategoryInput.value = product ? product.category : '';
    if (product && product.image) {
        var imageName = product.image.split('/').pop(); 
        document.getElementById("imageFileName").textContent = imageName; 
    } else {
        document.getElementById("imageFileName").textContent = ''; 
    }
  
    productImageInput.value = '';

    productDescInput.value = product ? product.description : '';
}

function displayProducts(arr, keyword = '') {
    var bBox = '';

    for (var i = 0; i < arr.length; i++) {
        var highlightedTitle = highlightText(arr[i].title, keyword);

        bBox += `<div class="col-lg-4 col-md-3 col-sm-6">
        <div class="product bg-light p-3 rounded-3">
            <img src="${arr[i].image}" class="img-fluid mb-3" />
            <h3>${highlightedTitle}</h3>
            <div class="d-flex justify-content-between">
                <span>${arr[i].category}</span>
                <span>${arr[i].price}</span>
            </div>

            <p>${arr[i].description}</p>
            <div class="d-flex justify-content-between">
                <button class="btn btn-outline-danger" onClick="deleteProduct('${arr[i].title}')">Delete</button>
                <button class="btn btn-outline-success" onClick="editProduct('${arr[i].title}')">Edit</button>
            </div>
        </div>
    </div>`;
    }

    document.getElementById("productsRow").innerHTML = bBox;
}

function highlightText(text, keyword) {
    if (!keyword) return text;
    var regex = new RegExp(`(${keyword})`, 'gi');
    return text.replace(regex, '<span style="color: red;">$1</span>');
}

function searchProduct() {
    var keyword = productSearchInput.value.toLowerCase();
    var filteredProducts = productList.filter(product => product.title.toLowerCase().includes(keyword));
    displayProducts(filteredProducts, keyword);
}

function deleteProduct(title) {
    var actualIndex = productList.findIndex(product => product.title === title);
    if (actualIndex > -1) {
        productList.splice(actualIndex, 1);
        addToLocalStorage();
        displayProducts(productList);
    }
}

var updatedIndex;
function editProduct(title) {
    console.log(title);
    updatedIndex = productList.findIndex(product => product.title === title);
    console.log(updatedIndex);

    if (updatedIndex > -1) {
        addBtn.classList.add("d-none");
        updateBtn.classList.remove("d-none");
        var productImage = productList[updatedIndex].image.split('/').pop();

        fillFormValues(productList[updatedIndex]);
    }
}

function updateProduct() {
    addBtn.classList.remove("d-none");
    updateBtn.classList.add("d-none");

    productList[updatedIndex].title = productTitleInput.value;
    productList[updatedIndex].price = productPriceInput.value;
    productList[updatedIndex].category = productCategoryInput.value;
    productList[updatedIndex].description = productDescInput.value;

    addToLocalStorage();
    displayProducts(productList);
    fillFormValues();
}

function validateFormInputs(element) {
    var regex = {
        productTitle: /^[a-zA-Z0-9\s\-_']{3,50}$/,
        productPrice: /^((6000|[6-9][0-9]{3})|([1-5][0-9]{4})|60000)$/,
        productCategory: /^(TV|Mobile|Screens|Laptops|Watches|Electronics)$/,
        productImage: /.*\.(jpg|jpeg|png|gif|bmp)$/i,
        productDesc: /^[A-Za-z]+[A-Za-z ]{0,249}$/
    }

    var isValid = regex[element.id].test(element.value);

    if (isValid) {
        console.log("matched");
        if (element.classList.contains("is-invalid")) {
            element.classList.replace("is-invalid", "is-valid")
        } else {
            element.classList.add("is-valid");
        }
        element.nextElementSibling.classList.replace("d-block", "d-none");
    } else {
        console.log("not matched");
        if (element.classList.contains("is-valid")) {
            element.classList.replace("is-valid", "is-invalid")
        } else {
            element.classList.add("is-invalid");
        }
        element.nextElementSibling.classList.replace("d-none", "d-block");
    }
    return isValid;
}



