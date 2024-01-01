const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const DATABASE_FILE = 'database.json';

let categories = [];
let shoppingList = [];

function saveData() {
  const data = {
    categories: categories,
    shoppingList: shoppingList
  };
  const jsonData = JSON.stringify(data, null, 2);

  fs.writeFile(DATABASE_FILE, jsonData, (err) => {
    if (err) {
      console.error('Error writing to the database file:', err);
    } else {
      console.log('Data berhasil disimpan ke dalam file database.json');
    }
  });
}

function loadData() {
  try {
    const data = fs.readFileSync(DATABASE_FILE);
    const jsonData = JSON.parse(data);
    categories = jsonData.categories;
    shoppingList = jsonData.shoppingList;
  } catch (error) {
    console.log('Failed to load data. Starting with empty lists.');
  }
}

function addCategory() {
  rl.question('Nama Kategori: ', (categoryName) => {
    rl.question('Satuan Kata Kunci: ', (keyword) => {
        const category = {
            name: categoryName,
            keyword: keyword,
            };
            categories.push(category);
            console.log('Kategori berhasil ditambahkan!');
            mainMenu();
    });
  });
}

function searchCategory() {
  rl.question('Masukan nama kategori: ', (categoryName) => {
    const foundCategory = categories.find(category => category.name.toLowerCase() === categoryName.toLowerCase());
    if (foundCategory) {
      console.log('Kategori ditemukan!');
      console.log('Nama Kategori: ' + foundCategory.name);
    } else {
      console.log('Kategori tidak ditemukan.');
    }
    mainMenu();
  });
}

function deleteCategory() {
  console.log('Daftar Kategori Tersedia:');
  categories.forEach((category, index) => {
    console.log(`${index + 1}. ${category.name}`);
  });
  rl.question('Pilih Kategori yang akan dihapus [1-' + categories.length + ']: ', (input) => {
    const categoryIndex = parseInt(input) - 1;
    if (categoryIndex >= 0 && categoryIndex < categories.length) {
      const deletedCategory = categories.splice(categoryIndex, 1);
      console.log('Kategori berhasil dihapus!');
    } else {
      console.log('Input tidak valid.');
    }
    mainMenu();
  });
}

function addShoppingList() {
  console.log('Daftar Kategori Tersedia:');
  categories.forEach((category, index) => {
    console.log(`${index + 1}. ${category.name}`);
  });

  let shoppingItem = {};
  let continueAdding = true;

  function addItem() {
    rl.question('Kategori Barang ke - ' + (shoppingList.length + 1) + ' [1-' + categories.length + ']: ', (input) => {
      const categoryIndex = parseInt(input) - 1;
      if (categoryIndex >= 0 && categoryIndex < categories.length) {
        shoppingItem.category = categories[categoryIndex].name;
        rl.question('Nama Barang ke - ' + (shoppingList.length + 1) + ': ', (itemName) => {
          shoppingItem.name = itemName;
          rl.question('Masukan jumlah barang ke - ' + (shoppingList.length + 1) + ': ', (quantity) => {
            shoppingItem.quantity = parseInt(quantity);
            shoppingList.push(shoppingItem);
            shoppingItem = {}; // Reset shoppingItem for the next iteration
            rl.question('Tambah barang lagi? (yes/no): ', (answer) => {
              if (answer.toLowerCase() === 'yes') {
                addItem();
              } else {
                console.log('Daftar belanja berhasil ditambahkan!');
                mainMenu();
              }
            });
          });
        });
      } else {
        console.log('Input tidak valid. Pilih kategori yang benar.');
        addItem();
      }
    });
  }

  addItem();
}

function searchShoppingList() {
  rl.question('Masukan nama barang: ', (itemName) => {
    const foundItem = shoppingList.find(item => item.name.toLowerCase() === itemName.toLowerCase());
    if (foundItem) {
      console.log('Belanjaan ditemukan!');
      console.log('Nama Barang: ' + foundItem.name);
      console.log('Jumlah Barang: ' + foundItem.quantity);
      console.log('Kategori Barang: ' + foundItem.category);
    } else {
      console.log('Belanjaan tidak ditemukan.');
    }
    mainMenu();
  });
}

function deleteShoppingList() {
  console.log('Daftar Belanja Tersedia:');
  shoppingList.forEach((item, index) => {
    console.log(`${index + 1}. ${item.name} - ${item.quantity} ${item.category}`);
  });

  rl.question('Pilih Barang yang akan dihapus [1-' + shoppingList.length + ']: ', (input) => {
    const itemIndex = parseInt(input) - 1;
    if (itemIndex >= 0 && itemIndex < shoppingList.length) {
      const deletedItem = shoppingList.splice(itemIndex, 1);
      console.log('Barang berhasil dihapus!');
    } else {
      console.log('Input tidak valid.');
    }
    mainMenu();
  });
}

function calculateTotal() {
  console.log('Berikut adalah daftar belanjaan:');

  let total = 0;

  function processItem(index) {
    if (index < shoppingList.length) {
      const item = shoppingList[index];
      console.log(`${index + 1}. ${item.name} - ${item.quantity} ${item.category}`);
      rl.question('Masukan harga beli: ', (price) => {
        const subtotal = price * item.quantity;
        total += subtotal;
        console.log('Sub total harga belanjaan adalah Rp ' + subtotal);
        processItem(index + 1);
      });
    } else {
      console.log('Total harga belanjaan adalah Rp ' + total);
      mainMenu();
    }
  }

  processItem(0);
}

function mainMenu() {
  console.log('Program Daftar Belanja');
  console.log('======================');
  console.log('1. Tambah Kategori');
  console.log('2. Cari Kategori');
  console.log('3. Hapus Kategori');
  console.log('4. Tambah Belanjaan');
  console.log('5. Cari Belanjaan');
  console.log('6. Hapus Belanjaan');
  console.log('7. Hitung Total Belanjaan');
  console.log('8. Keluar');

  rl.question('Pilih Menu [1-8]: ', (choice) => {
    switch (choice) {
      case '1':
        addCategory();
        break;
      case '2':
        searchCategory();
        break;
      case '3':
        deleteCategory();
        break;
      case '4':
        addShoppingList();
        break;
      case '5':
        searchShoppingList();
        break;
      case '6':
        deleteShoppingList();
        break;
      case '7':
        calculateTotal();
        break;
      case '8':
        rl.close();
        break;
      default:
        console.log('Input tidak valid. Silakan pilih menu 1-8.');
        mainMenu();
    }

    saveData(); // Simpan data ke dalam file setiap kali ada perubahan
  });
}

// Load data from the file at the beginning
loadData();

// Run the main program
mainMenu();