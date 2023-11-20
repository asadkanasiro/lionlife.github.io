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
    const addProductForm = document.getElementById('addProductForm');
    addProductForm.style.display = addProductForm.style.display === 'none' ? 'block' : 'none';
}

function addNewProduct(event) {
    event.preventDefault();
    const productName = document.getElementById('productName').value;
    const productImageUrl = document.getElementById('productImageUrl').value;
    const productPrice = parseFloat(document.getElementById('productPrice').value);
    const productCategory = document.getElementById('productCategory').value;

    const newProduct = {
        name: productName,
        image: productImageUrl,
        price: productPrice,
        category: productCategory,
    };

    products.push(newProduct);
    updateProductContainer();
    toggleAddProductForm();
    saveData();
}

function openEditModal(index) {
    const product = products[index];
    document.getElementById('editProductIndex').value = index;
    document.getElementById('editProductName').value = product.name;
    document.getElementById('editProductImageUrl').value = product.image;
    document.getElementById('editProductPrice').value = product.price;
    document.getElementById('editProductCategory').value = product.category;

    const editProductModal = document.getElementById('editProductModal');
    editProductModal.style.display = 'block';
}

function editProduct(event) {
    event.preventDefault();
    const index = parseInt(document.getElementById('editProductIndex').value);
    const productName = document.getElementById('editProductName').value;
    const productImageUrl = document.getElementById('editProductImageUrl').value;
    const productPrice = parseFloat(document.getElementById('editProductPrice').value);
    const productCategory = document.getElementById('editProductCategory').value;

    if (!isNaN(index)) {
        products[index].name = productName;
        products[index].image = productImageUrl;
        products[index].price = productPrice;
        products[index].category = productCategory;

        updateProductContainer();
        closeEditModal();
        saveData();
    }
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
    const editProductModal = document.getElementById('editProductModal');
    editProductModal.style.display = 'none';
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
    const path = 'products.json';
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

function showSuccessMessage(message) {
    Swal.fire({
        icon: 'success',
        title: 'Success',
        text: message,
    });
}

function showErrorMessage(message) {
    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: message,
    });
}

// Initial display of products and auto-load
loadData();




// ... (Your existing JavaScript code)

function toggleAddProductForm() {
    togglePopup('addProductFormPopup');
}

function openEditModal(index) {
    const product = products[index];
    document.getElementById('editProductIndex').value = index;
    document.getElementById('editProductName').value = product.name;
    document.getElementById('editProductImageUrl').value = product.image;
    document.getElementById('editProductPrice').value = product.price;
    document.getElementById('editProductCategory').value = product.category;

    togglePopup('editProductModalPopup');
}

function closeEditModal() {
    closePopup('editProductModalPopup');
}

function togglePopup(popupId) {
    const popup = document.getElementById(popupId);
    popup.style.display = popup.style.display === 'none' ? 'block' : 'none';
}

function closePopup(popupId) {
    const popup = document.getElementById(popupId);
    popup.style.display = 'none';
}
