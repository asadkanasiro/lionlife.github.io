const products = [];

function generateProductCard(product, index) {
    return `
        <div class="product-card" data-category="${product.category}" onclick="openEditModal(${index})">
            <img src="${product.image}" alt="${product.name}" width="300" height="300">
            <h3>${product.name}</h3>
            <p class="price">${product.price.toFixed(2)} MAD</p>
            <p class="category">Category: ${product.category}</p>
            <button onclick="addToCart('${product.name}', ${product.price}, '${product.image}')">Add to Cart</button>
        </div>
    `;
}

function addToCart(name, price, image) {
    console.log(`Added ${name} to the cart!`);
}

function updateProductContainer() {
    const productContainer = document.getElementById('product-container');
    productContainer.innerHTML = '';
    products.forEach((product, index) => {
        const productCard = generateProductCard(product, index);
        productContainer.innerHTML += productCard;
    });
}

function toggleAddProductForm() {
    togglePopup('addProductFormPopup');
}

function addNewProduct(event) {
    event.preventDefault();
    const productName = document.getElementById('productName').value;
    const productImageInput = document.getElementById('productImage');
    const productPrice = parseFloat(document.getElementById('productPrice').value);
    const productCategory = document.getElementById('productCategory').value;

    const productImage = productImageInput.files[0];

    if (!productName || !productImage || isNaN(productPrice) || !productCategory) {
        showErrorMessage('Please fill in all fields.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const imageDataURL = e.target.result;

        const newProduct = {
            name: productName,
            image: imageDataURL,
            price: productPrice,
            category: productCategory,
        };

        products.push(newProduct);
        updateProductContainer();
        toggleAddProductForm();
        saveData();
    };

    reader.readAsDataURL(productImage);
}

function openEditModal(index) {
    const product = products[index];
    document.getElementById('editProductIndex').value = index;
    document.getElementById('editProductName').value = product.name;

    const editProductImageInput = document.getElementById('editProductImage');
    editProductImageInput.value = ''; // Clear the input value

    document.getElementById('editProductPrice').value = product.price;
    document.getElementById('editProductCategory').value = product.category;

    togglePopup('editProductModalPopup');
}

function editProduct(event) {
    event.preventDefault();
    const index = parseInt(document.getElementById('editProductIndex').value);
    const productName = document.getElementById('editProductName').value;
    const editProductImageInput = document.getElementById('editProductImage');
    const productPrice = parseFloat(document.getElementById('editProductPrice').value);
    const productCategory = document.getElementById('editProductCategory').value;

    const editProductImage = editProductImageInput.files[0];

    if (isNaN(index) || !productName || isNaN(productPrice) || !productCategory) {
        showErrorMessage('Please fill in all fields.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const imageDataURL = e.target.result;

        products[index].name = productName;
        products[index].image = imageDataURL;
        products[index].price = productPrice;
        products[index].category = productCategory;

        updateProductContainer();
        closeEditModal();
        saveData();
    };

    reader.readAsDataURL(editProductImage);
}

function deleteProduct() {
    const index = parseInt(document.getElementById('editProductIndex').value);

    if (!isNaN(index) && confirm('Are you sure you want to delete this product?')) {
        products.splice(index, 1);
        updateProductContainer();
        closeEditModal();
        saveData();
    }
}

function closeEditModal() {
    closePopup('editProductModalPopup');
}

function closeAddProductFormPopup() {
    closePopup('addProductFormPopup');
}

function closeEditProductModalPopup() {
    closePopup('editProductModalPopup');
}

function closePopup(popupId) {
    const popup = document.getElementById(popupId);
    popup.style.display = 'none';
}

function togglePopup(popupId) {
    const popup = document.getElementById(popupId);
    popup.style.display = popup.style.display === 'none' ? 'block' : 'none';
}

function showErrorMessage(message) {
    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: message,
    });
}

function showSuccessMessage(message) {
    Swal.fire({
        icon: 'success',
        title: 'Success',
        text: message,
    });
}

function saveData() {
    localStorage.setItem('savedProducts', JSON.stringify(products));
    console.log('Products saved.');
    storeData();
}

function loadData() {
    const savedProducts = localStorage.getItem('savedProducts');
    if (savedProducts) {
        products.length = 0;
        const parsedProducts = JSON.parse(savedProducts);
        products.push(...parsedProducts);
        updateProductContainer();
        console.log('Products loaded.');
        retrieveData();
    } else {
        console.log('No saved products found.');
    }
}

async function storeData() {
    const username = 'asadkanasiro';
    const repo = 'lionslife.github.io';
    const path = 'products1.json';
    const token = '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';

    try {
        const existingDataResponse = await fetchDataFromGitHub(username, repo, path, token);
        const existingData = await existingDataResponse.json();

        const response = await fetch(`https://api.github.com/repos/${username}/${repo}/contents/${path}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                message: 'Store products data',
                content: btoa(JSON.stringify(products)),
                sha: existingData.sha,
            }),
        });

        const data = await response.json();
        console.log('Data stored:', data);
        showSuccessMessage('Data stored successfully!');
    } catch (error) {
        console.error('Error storing data:', error);
        showErrorMessage('Error storing data. Please try again.');
    }
}

async function retrieveData() {
    const username = 'asadkanasiro';
    const repo = 'lionslife.github.io';
    const path = 'products.json';
    const token = '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';

    try {
        const response = await fetchDataFromGitHub(username, repo, path, token);
        const data = await response.json();
        const decodedContent = atob(data.content);
        const parsedData = JSON.parse(decodedContent);
        console.log('Retrieved data:', parsedData);
        showSuccessMessage('Data retrieved successfully!');
        products.length = 0;
        products.push(...parsedData);
        updateProductContainer();
    } catch (error) {
        console.error('Error retrieving data:', error);
        showErrorMessage('Error retrieving data. Please try again.');
    }
}

async function fetchDataFromGitHub(username, repo, path, token) {
    return await fetch(`https://api.github.com/repos/${username}/${repo}/contents/${path}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

// Initial display of products and auto-load
loadData();
