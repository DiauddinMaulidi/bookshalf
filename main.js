let rakBuku = []
const RENDER_EVENT = 'render'
const LOCALBOOK = 'KEYLOCALBOOK'

document.addEventListener('DOMContentLoaded', function() {
    let submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function(e) {
        e.preventDefault()
        addBook()
    })

    let searchSubmit = document.getElementById('searchBook')
    searchSubmit.addEventListener('submit', function(e) {
        e.preventDefault()
        searchBook()
    })

    function searchBook() {
        let inputSearch = document.getElementById('searchBookTitle').value
        let bookStorage = localStorage.getItem(LOCALBOOK)
        let resultBooks = JSON.parse(bookStorage)

        let newListBook = document.getElementById('incompleteBookshelfList')
        newListBook.innerHTML = ''
        let listComplete = document.getElementById('completeBookshelfList')
        listComplete.innerHTML = ''

        const result = resultBooks.filter(item => item.judul.toLowerCase().includes(inputSearch.toLowerCase()))
        result.map(itemBook => {
            const newBook = makeBook(itemBook)
            if( itemBook.isComplete ) {
                listComplete.append(newBook)
            } else {
                newListBook.append(newBook)
            }
        })
    }

    
    function isStorageExist() {
        if( typeof Storage == 'undefined' ) {
            return false
        }
        return true
    }

    function saveData() {
        if( isStorageExist ) {
            const parsed = JSON.stringify(rakBuku)
            localStorage.setItem(LOCALBOOK, parsed)
        }
    }

    function addBook() {
        const judul = document.getElementById('inputBookTitle').value
        const penulis = document.getElementById('inputBookAuthor').value
        const tahun = document.getElementById('inputBookYear').value
        const checkBox = document.getElementById('inputBookIsComplete')

        const newObject = addNewObjectBuku(idBuku(), judul, penulis, tahun, false)
        if( checkBox.checked ) {
            newObject.isComplete = true
        }
        rakBuku.push(newObject)
        
        document.getElementById('inputBookTitle').value = ''
        document.getElementById('inputBookAuthor').value = ''
        document.getElementById('inputBookYear').value = ''
        document.getElementById('inputBookIsComplete').checked = false
        
        document.dispatchEvent(new Event(RENDER_EVENT))
        saveData()
    }

    function idBuku() {
        return +new Date()
    }

    function addNewObjectBuku(id, judul, penulis, tahun, isComplete) {
        return {
            id, judul, penulis, tahun, isComplete
        }
    }

    function makeBook(theBook) {
        const bookTitle = document.createElement('h3')
        bookTitle.innerText = theBook.judul
    
        const bookPenulis = document.createElement('p')
        bookPenulis.innerText = theBook.penulis
    
        const bookTahun = document.createElement('p')
        bookTahun.innerText = theBook.tahun
        
        const textContainer = document.createElement('div')
        textContainer.classList.add('action')

        if( !theBook.isComplete ) {
            const buttonSelesai = document.createElement('button')
            buttonSelesai.classList.add('green')
            buttonSelesai.innerText = 'Selesai dibaca'

            buttonSelesai.addEventListener('click', function() {
                addButtonComplete(theBook.id)
            })

            textContainer.append(buttonSelesai)
        } else {
            const buttonBlmSelesai = document.createElement('button')
            buttonBlmSelesai.classList.add('green')
            buttonBlmSelesai.innerText = 'Belum selesai dibaca'

            buttonBlmSelesai.addEventListener('click', function() {
                undoButtonComplete(theBook.id)
            })
            
            textContainer.append(buttonBlmSelesai)
        }

        const buttonHapus = document.createElement('button')
        buttonHapus.classList.add('red')
        buttonHapus.innerText = 'Hapus buku'

        buttonHapus.addEventListener('click', function() {
            deleteBookItem(theBook.id)
        })
        textContainer.append(buttonHapus)

        let articlePembungkus = document.createElement('article')
        articlePembungkus.classList.add('book_item')
        articlePembungkus.setAttribute('id', theBook.id)
        articlePembungkus.append(bookTitle, bookPenulis, bookTahun, textContainer)

        return articlePembungkus
    }
    
    function addButtonComplete(idBook) {
        const findBook = findId(idBook)
        
        if( findBook === null ) return;

        findBook.isComplete = true
        document.dispatchEvent(new Event(RENDER_EVENT))
        saveData()
    }

    function undoButtonComplete(idBook) {
        const findBook = findId(idBook)

        if( findBook == null ) return;
        findBook.isComplete = false
        document.dispatchEvent(new Event(RENDER_EVENT))
        saveData()
    }

    function deleteBookItem(idBook) {
        const findBook = findId(idBook)

        const pengumuman = confirm('yakin ingin menghapus buku?')
        if( pengumuman ) {
            rakBuku.splice(findBook, 1)
        }
        document.dispatchEvent(new Event(RENDER_EVENT))
        saveData()
    }
    
    function findId(id) {
        for (const books of rakBuku) {
            if(books.id === id) {
                return books
            }
        }
        return null
    }

    function loadDataFromStorage() {
        let rowBook = localStorage.getItem(LOCALBOOK)
        let resultBook = JSON.parse(rowBook)

        if( resultBook !== null ) {
            for (const result of resultBook) {
                rakBuku.push(result)
            }
        }
        document.dispatchEvent(new Event(RENDER_EVENT))
    }

    document.addEventListener(RENDER_EVENT, function() {
        let newListBook = document.getElementById('incompleteBookshelfList')
        newListBook.innerHTML = ''
        let listComplete = document.getElementById('completeBookshelfList')
        listComplete.innerHTML = ''

        for (const book of rakBuku) {
            const newBook = makeBook(book)
            if( !book.isComplete ) {
                newListBook.append(newBook)
            } else {
                listComplete.append(newBook)
            }
        }

    })

    if( isStorageExist ) {
        loadDataFromStorage()
    }

})
