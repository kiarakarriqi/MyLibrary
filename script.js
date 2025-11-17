// Base function 
function getBooks() {
  const books = localStorage.getItem('books');
  return books ? JSON.parse(books) : [];
}

function saveBooks(books) {
  localStorage.setItem('books', JSON.stringify(books));
}

// Dashboard updated 
function updateDashboard() {
  const books = getBooks();
  const total = books.length;
  const read = books.filter(b => b.status === 'Finished').length;
  const progress = total ? Math.round((read / total) * 100) : 0;

  const totalEl = document.getElementById('total-books');
  const readEl = document.getElementById('books-read');
  const progressEl = document.getElementById('progress');
  const barEl = document.getElementById('progress-bar');

  if(totalEl) totalEl.textContent = total;
  if(readEl) readEl.textContent = read;
  if(progressEl) progressEl.textContent = progress + '%';
  if(barEl) barEl.style.width = progress + '%';
  
    //Updated wishlist  (books with status "To Read")
  const wishlistEl = document.getElementById('wishlist-list');
  if (wishlistEl) {
    const books = getBooks();
    const wishlistBooks = books.filter(b => b.status === 'To Read');
    wishlistEl.innerHTML = '';

    if (wishlistBooks.length === 0) {
      wishlistEl.innerHTML = '<li>No books in wishlist 📭</li>';
    } else {
      wishlistBooks.forEach(book => {
        const li = document.createElement('li');
        li.textContent = `${book.title} - ${book.author}`;
        wishlistEl.appendChild(li);
      });
    }
  }
}

// update book table  – vetëm tek All Books
function updateBooksTable() {
  const tableBody = document.querySelector('#books-table tbody');
  if(!tableBody) return;

  const books = getBooks();
  const filter = document.getElementById('filter-status')?.value || 'All';

  tableBody.innerHTML = '';
  books.forEach((b,i) => {
    if(filter === 'All' || b.status === filter) {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${b.title}</td>
        <td>${b.author}</td>
        <td class="status-${b.status.replace(/\s/g,'')}">${b.status}</td>
        <td>
          <button onclick="editBook(${i})" class="edit-btn">Edit</button>
          <button onclick="deleteBook(${i})" class="delete-btn">Delete</button>
        </td>
      `;
      tableBody.appendChild(tr);
    }
  });
}

// Add Book form
const addForm = document.getElementById('add-book-form');
if(addForm) {
  addForm.addEventListener('submit', function(e){
    e.preventDefault();
    const title = document.getElementById('title').value.trim();
    const author = document.getElementById('author').value.trim();
    const status = document.getElementById('status').value;

    if(!title || !author){ alert('Please fill all fields!'); return; }

    const books = getBooks();
    const exists = books.some(b =>
      b.title.toLowerCase() === title.toLowerCase() &&
      b.author.toLowerCase() === author.toLowerCase() &&
      b.status.toLowerCase() === status.toLowerCase()
    );
    if(exists){ alert('This book already exists!'); return; }

    books.push({title, author, status});
    saveBooks(books);
    addForm.reset();
    alert('Book added!');
    updateDashboard();
  });
}

// Delete Book
function deleteBook(i){
  if(confirm('Are you sure?')){
    const books = getBooks();
    books.splice(i,1);
    saveBooks(books);
    updateBooksTable();
    updateDashboard();
  }
}

// Edit Book
function editBook(i){
  const books = getBooks();
  const b = books[i];
  const t = prompt('Edit Title:', b.title);
  if(t === null) return;
  const a = prompt('Edit Author:', b.author);
  if(a === null) return;
  const s = prompt('Edit Status (To Read/Reading/Finished):', b.status);
  if(s === null) return;

  const duplicate = books.some((book,j)=> j!==i &&
    book.title.toLowerCase() === t.toLowerCase() &&
    book.author.toLowerCase() === a.toLowerCase() &&
    book.status.toLowerCase() === s.toLowerCase()
  );
  if(duplicate){ alert('This book already exists!'); return; }

  books[i] = {title: t, author: a, status: s};
  saveBooks(books);
  updateBooksTable();
  updateDashboard();
}

// Filter at All Books
const filterSelect = document.getElementById('filter-status');
if(filterSelect){
  filterSelect.addEventListener('change', updateBooksTable);
}

// when the page is loaded 
window.addEventListener('load', function(){
  updateDashboard();       // Dashboard shfaq vetëm statistikat
  updateBooksTable();      // All Books shfaq librat menjëherë
});
