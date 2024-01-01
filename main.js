// Import module untuk membaca dan menulis file serta membaca input dari command line
const fs = require('fs');
const readline = require('readline');

// Deklarasi array untuk menyimpan data kategori dan daftar belanjaan
let categories = [];
let shoppingList = [];

// Membuat interface untuk membaca input dari pengguna
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Fungsi untuk menyimpan data ke dalam file 'database.json'
function saveData() {
  const data = {
    categories,
    shoppingList
  };
  fs.writeFileSync('database.json', JSON.stringify(data, null, 2));
}

// Fungsi untuk memuat data dari file 'database.json' saat program dimulai
function loadData() {
  try {
    const data = fs.readFileSync('database.json');
    const parsedData = JSON.parse(data);
    // Menggunakan data yang ada atau array kosong jika data tidak ada
    categories = parsedData.categories || [];
    shoppingList = parsedData.shoppingList || [];
  } catch (error) {
    // File tidak ditemukan atau JSON tidak valid, abaikan dan mulai dengan data kosong
  }
}

// Fungsi untuk menambahkan kategori baru
function addCategory() {
  rl.question('Nama Kategori: ', (categoryName) => {
    rl.question('Satuan Kata Kunci: ', (keyword) => {
      const category = {
        name: categoryName,
        keyword: keyword
      };
      // Menambahkan kategori baru ke dalam array
      categories.push(category);
      // Menyimpan perubahan ke dalam file
      saveData();
      console.log('Kategori berhasil ditambahkan!');
      // Menampilkan menu utama setelah menambahkan kategori
      showMainMenu();
    });
  });
}

// Fungsi untuk mencari kategori berdasarkan nama
function findCategory() {
  rl.question('Masukkan nama kategori: ', (searchCategory) => {
    // Mencari kategori dalam array berdasarkan nama yang dimasukkan
    const foundCategory = categories.find(category => category.name.toLowerCase() === searchCategory.toLowerCase());
    if (foundCategory) {
      console.log('Kategori ditemukan!');
      console.log('Nama Kategori: ' + foundCategory.name);
    } else {
      console.log('Kategori tidak ditemukan.');
    }
    // Menampilkan menu utama setelah mencari kategori
    showMainMenu();
  });
}

// Fungsi untuk menghapus kategori
function removeCategory() {
  console.log('Daftar Kategori Tersedia:');
  // Menampilkan daftar kategori yang ada
  categories.forEach((category, index) => {
    console.log((index + 1) + '. ' + category.name);
  });
  rl.question('Pilih Kategori yang akan dihapus [1-' + categories.length + ']: ', (choice) => {
    // Mengambil pilihan pengguna dan menghapus kategori sesuai pilihan
    const index = parseInt(choice) - 1;
    if (index >= 0 && index < categories.length) {
      const deletedCategory = categories.splice(index, 1);
      // Menyimpan perubahan ke dalam file setelah menghapus kategori
      saveData();
      console.log('Kategori berhasil dihapus!');
    } else {
      console.log('Pilihan tidak valid.');
    }
    // Menampilkan menu utama setelah menghapus kategori
    showMainMenu();
  });
}

// Fungsi untuk menambahkan item belanjaan
function addShoppingList() {
  console.log('Daftar Kategori Tersedia:');
  // Menampilkan daftar kategori yang ada
  categories.forEach((category, index) => {
    console.log((index + 1) + '. ' + category.name);
  });
  rl.question('Tambahkan rencana daftar belanja. Tekan underscore untuk menghentikan penambahan.\n' +
    'Kategori Barang ke - 1 [1-' + categories.length + ']: ', (choice) => {
    const index = parseInt(choice) - 1;
    if (index >= 0 && index < categories.length) {
      rl.question('Nama Barang ke - 1: ', (itemName) => {
        rl.question('Masukkan jumlah barang ke - 1: ', (itemQuantity) => {
          const shoppingItem = {
            name: itemName,
            quantity: parseInt(itemQuantity),
            category: categories[index].name
          };
          // Menambahkan item belanjaan ke dalam array
          shoppingList.push(shoppingItem);
          // Menyimpan perubahan ke dalam file
          saveData();
          console.log('Daftar belanja berhasil ditambahkan!');
          // Menampilkan menu utama setelah menambahkan item belanjaan
          showMainMenu();
        });
      });
    } else {
      console.log('Pilihan tidak valid.');
      // Menampilkan menu utama jika pilihan tidak valid
      showMainMenu();
    }
  });
}

// Fungsi untuk mencari item belanjaan
function findShoppingList() {
  rl.question('Masukkan nama barang: ', (searchItem) => {
    // Mencari item belanjaan dalam array berdasarkan nama yang dimasukkan
    const foundItem = shoppingList.find(item => item.name.toLowerCase() === searchItem.toLowerCase());
    if (foundItem) {
      console.log('Belanjaan ditemukan!');
      console.log('Nama Barang: ' + foundItem.name);
      console.log('Jumlah Barang: ' + foundItem.quantity);
      console.log('Kategori Barang: ' + foundItem.category);
    } else {
      console.log('Belanjaan tidak ditemukan.');
    }
    // Menampilkan menu utama setelah mencari item belanjaan
    showMainMenu();
  });
}

// Fungsi untuk menghapus item belanjaan
function removeShoppingList() {
  console.log('Daftar Belanjaan Tersedia:');
  // Menampilkan daftar item belanjaan yang ada
  shoppingList.forEach((item, index) => {
    console.log((index + 1) + '. ' + item.name + ' - ' + item.quantity + ' ' + item.category);
  });
  rl.question('Pilih Barang yang akan dihapus [1-' + shoppingList.length + ']: ', (choice) => {
    // Mengambil pilihan pengguna dan menghapus item belanjaan sesuai pilihan
    const index = parseInt(choice) - 1;
    if (index >= 0 && index < shoppingList.length) {
      const deletedItem = shoppingList.splice(index, 1);
      // Menyimpan perubahan ke dalam file setelah menghapus item belanjaan
      saveData();
      console.log('Barang berhasil dihapus!');
    } else {
      console.log('Pilihan tidak valid.');
    }
    // Menampilkan menu utama setelah menghapus item belanjaan
    showMainMenu();
  });
}

// Fungsi untuk menghitung total harga belanjaan
function calculateTotal() {
  console.log('Berikut adalah daftar belanjaan:');
  let totalCost = 0;
  let currentIndex = 0;

  // Fungsi rekursif untuk menghitung subtotal dan total harga belanjaan
  function calculateSubtotal() {
    if (currentIndex < shoppingList.length) {
      const item = shoppingList[currentIndex];
      console.log((currentIndex + 1) + '. ' + item.name + ' - ' + item.quantity + ' ' + item.category);
      rl.question('Masukkan harga beli: ', (itemPrice) => {
        // Menghitung subtotal untuk item belanjaan
        const subtotal = item.quantity * itemPrice;
        console.log('Sub total harga belanjaan adalah Rp ' + subtotal);
        // Menambahkan subtotal ke totalCost
        totalCost += subtotal;

        currentIndex++;
        // Memanggil diri sendiri untuk item berikutnya
        calculateSubtotal();
      });
    } else {
      // Menampilkan total harga belanjaan setelah semua item dihitung
      console.log('Total harga belanjaan adalah Rp ' + totalCost);
      // Menampilkan menu utama setelah menghitung total harga belanjaan
      showMainMenu();
    }
  }

  // Memanggil fungsi rekursif pertama kali
  calculateSubtotal();
}

// Fungsi untuk menampilkan menu utama
function showMainMenu() {
  console.log('\nProgram Daftar Belanja');
  console.log('======================');
  console.log('1. Tambah Kategori');
  console.log('2. Cari Kategori');
  console.log('3. Hapus Kategori');
  console.log('4. Tambah Belanjaan');
  console.log('5. Cari Belanjaan');
  console.log('6. Hapus Belanjaan');
  console.log('7. Hitung Total Belanjaan');
  console.log('8. Keluar');

  // Membaca pilihan pengguna dan memanggil fungsi yang sesuai
  rl.question('Pilih Menu [1-8]: ', (choice) => {
    switch (choice) {
      case '1':
        addCategory();
        break;
      case '2':
        findCategory();
        break;
      case '3':
        removeCategory();
        break;
      case '4':
        addShoppingList();
        break;
      case '5':
        findShoppingList();
        break;
      case '6':
        removeShoppingList();
        break;
      case '7':
        calculateTotal();
        break;
      case '8':
        rl.close();
        break;
      default:
        console.log('Pilihan tidak valid. Silakan pilih kembali.');
        // Menampilkan menu utama kembali jika pilihan tidak valid
        showMainMenu();
        break;
    }
  });
}

// Memuat data saat program dimulai
loadData();
// Menampilkan menu utama pertama kali
showMainMenu();
