class Book{
    constructor(title, author, isbn){
        this.title  = title;
        this.author = author;
        this.isbn   = isbn;
    }
}

class UI{
    

    //add book to book list
    addBookToList(book){
        const bookList = document.querySelector("#bookList");
        //create table row
        const tableRow = document.createElement("tr");

        //insert columns
        tableRow.innerHTML = `<td> ${book.title} </td>
                            <td> ${book.author} </td>
                            <td> ${book.isbn} </td>
                            <td> <a href="#" class="delete"> &times; </a> </td>`;

        bookList.appendChild(tableRow);
    }

    //clear fields after submission
    clearFields(title, author, isbn){
        title.value  = '';
        author.value = '';
        isbn.value   = '';
    }


    showAlert(message, type, where){
        const div = document.createElement("div");
        div.className = `alert alert-${type}`;
        div.appendChild(document.createTextNode(message));

        let status, elem;

        if(where == 1){
            status = document.querySelector(".modal-body");
            elem = document.querySelector("#addBookForm");
        } else if (where == 2){
            status = document.querySelector(".card");
            elem = document.querySelector(".table");
        }

        status.insertBefore(div, elem);

        //set time out
        setTimeout(function(){
            document.querySelector(".alert").remove();
        }, 2000);
    }

    deleteBook(target){
        if(target.classList.contains("delete")){
            target.parentElement.parentElement.remove();
        }
    }



}


class LS{


    static StoreInLS(book){
        const books = LS.fetchFromLS();
        books.push(book);
        localStorage.setItem("books", JSON.stringify(books));
    }

    static fetchFromLS(){
        let books;
        if(localStorage.getItem("books") === null){
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem("books"));
        }

        return books;
    }

    static deleteFromLS(isbn){
        const books = LS.fetchFromLS();

        books.forEach(function(book, index){
            if(parseInt(isbn) === parseInt(book.isbn)){
                books.splice(index, 1);
            }
        });

        localStorage.setItem("books", JSON.stringify(books));
    }

    static displayBooks(){
        const books = LS.fetchFromLS();
        books.forEach(function(book){
            const ui = new UI();
            ui.addBookToList(book);
        });

    }


}



//add event listener to DOM

document.addEventListener("DOMContentLoaded", LS.displayBooks);



//add event listener to add book form
document.querySelector("#addBookForm").addEventListener("submit", function(e){
    e.preventDefault();

    
    const title  = document.querySelector("#bookTitle"),
        author = document.querySelector("#bookAuthor"),
        isbn   = document.querySelector("#bookIsbn");

        const book = new Book(title.value, author.value, isbn.value);


        //instantiate ui class
        const ui  = new UI();

        //validate fields

        
        //check if form values are empty
        if(title.value == '' || author.value == '' || isbn.value == ''){
            //show error message
            ui.showAlert('Please fill in the fields to continue', "danger", 1);
        } else {
            //Add book to ui
            ui.addBookToList(book);

            //persist to local storage
            LS.StoreInLS(book);

            //show success message
            ui.showAlert('Book Added', 'success', 1);

            //clear form fields
            ui.clearFields(title, author, isbn);

            //close modal
            new bootstrap.Modal(document.getElementById("addBookModal")).hide();
        }                      

});



//event listener for delete
document.querySelector("#bookList").addEventListener("click", function(e){

    //instantiate ui
    const ui = new UI();

    //delete from ui
    ui.deleteBook(e.target);

    //remove from local storage
    LS.deleteFromLS(e.target.parentElement.previousElementSibling.textContent);

    //show success message
    ui.showAlert("Book Deleted", "success", 2);


});