let books = [];

function addBook(event) {
  event.preventDefault();
  const title = document.querySelector("#inputBookTitle").value;
  const author = document.querySelector("#inputBookAuthor").value;
  const year = document.querySelector("#inputBookYear").value;
  const isComplete = document.querySelector("#inputBookIsComplete").checked;
  const book = {
    id: +new Date(),
    title: String(title),
    author: String(author),
    year: Number(year), // data yang diubah
    isComplete: isComplete,
  };
  books.push(book);
  document.dispatchEvent(new Event("bookChanged"));
}

function searchBook(event) {
  event.preventDefault();
  const query = document.querySelector("#searchBookTitle").value.toLowerCase();
  const filteredBooks = books.filter(function (book) {
    return book.title.toLowerCase().includes(query);
  });
  displayBooks(filteredBooks);
}

function markAsComplete(event) {
  const id = Number(event.target.id);
  const index = books.findIndex(function (book) {
    return book.id === id;
  });
  if (index !== -1) {
    books[index].isComplete = true;
    document.dispatchEvent(new Event("bookChanged"));
  }
}

function markAsIncomplete(event) {
  const id = Number(event.target.id);
  const index = books.findIndex(function (book) {
    return book.id === id;
  });
  if (index !== -1) {
    books[index].isComplete = false;
    document.dispatchEvent(new Event("bookChanged"));
  }
}

function deleteBook(event) {
  const id = Number(event.target.id);
  const index = books.findIndex(function (book) {
    return book.id === id;
  });
  if (index !== -1) {
    books.splice(index, 1);
    document.dispatchEvent(new Event("bookChanged"));
  }
}

function displayBooks(books) {
  const incompleteBookshelfList = document.querySelector("#incompleteBookshelfList");
  const completeBookshelfList = document.querySelector("#completeBookshelfList");
  incompleteBookshelfList.innerHTML = "";
  completeBookshelfList.innerHTML = "";
  for (const book of books) {
    const bookItem = document.createElement("article");
    bookItem.classList.add("book_item");
    const title = document.createElement("h2");
    title.innerText = book.title;
    const author = document.createElement("p");
    author.innerText = "Penulis: " + book.author;
    const year = document.createElement("p");
    year.innerText = "Tahun: " + book.year;
    bookItem.appendChild(title);
    bookItem.appendChild(author);
    bookItem.appendChild(year);
    const action = document.createElement("div");
    action.classList.add("action");
    const deleteButton = document.createElement("button");
    deleteButton.id = book.id;
    deleteButton.innerText = "Hapus buku";
    deleteButton.classList.add("red");
    deleteButton.addEventListener("click", deleteBook);
    action.appendChild(deleteButton);
    if (book.isComplete) {
      const incompleteButton = document.createElement("button");
      incompleteButton.id = book.id;
      incompleteButton.innerText = "Belum selesai dibaca";
      incompleteButton.classList.add("green");
      incompleteButton.addEventListener("click", markAsIncomplete);
      action.appendChild(incompleteButton);
      completeBookshelfList.appendChild(bookItem);
    } else {
      const completeButton = document.createElement("button");
      completeButton.id = book.id;
      completeButton.innerText = "Selesai dibaca";
      completeButton.classList.add("green");
      completeButton.addEventListener("click", markAsComplete);
      action.appendChild(completeButton);
      incompleteBookshelfList.appendChild(bookItem);
    }
    bookItem.appendChild(action);
  }
}

function saveBooksToLocalStorage(books) {
  localStorage.setItem("books", JSON.stringify(books));
}

function loadBooksFromLocalStorage() {
  const storedBooks = JSON.parse(localStorage.getItem("books"));
  if (storedBooks) {
    books = storedBooks;
    displayBooks(books);
  }
}

window.addEventListener("load", function () {
  loadBooksFromLocalStorage();
  const inputBookForm = document.querySelector("#inputBook");
  const searchBookForm = document.querySelector("#searchBook");
  inputBookForm.addEventListener("submit", addBook);
  searchBookForm.addEventListener("submit", searchBook);
  document.addEventListener("bookChanged", function () {
    saveBooksToLocalStorage(books);
    displayBooks(books);
  });
});