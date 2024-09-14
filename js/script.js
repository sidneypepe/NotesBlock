const notesConteiner = document.querySelector(".notes-container")
const noteInput = document.querySelector("#note-content")
const addNotes = document.querySelector(".add-note")
const searchInput = document.querySelector("#search-input")
const importCsv = document.querySelector(".export-notes")
//funçoes
const showNotes = ()=>{
    clearNotes();

    getNote().forEach((note) => {
        const noteElement = createNote(note.id, note.content, note.fixed)
        notesConteiner.appendChild(noteElement)
    });
   
}

const searchIcon = document.querySelector('.search-container #search-icon')

function focusSearchInput() {
  document.getElementById('search-input').focus()
}

searchIcon.addEventListener('click', focusSearchInput)

const clearNotes = ()=>{
    notesConteiner.replaceChildren([])
}

const addNota = ()=>{
    const notes = getNote(); //warray para local storege

    const noteObjeto={
        id: geraId(),
        content: noteInput.value,
        fixed: false,
    }
    const noteElement = createNote(noteObjeto.id, noteObjeto.content)

    notesConteiner.appendChild(noteElement)

    notes.push(noteObjeto); //ls

    saveNotes(notes); //ls
  

    noteInput.value="";
}

const geraId= ()=>{
    return Math.floor(Math.random() * 1000)
}



const createNote=(id, content, fixed)=>{
    const element = document.createElement("div")
    element.classList.add('note');

    const textArea = document.createElement("textarea")
    textArea.value = content
    textArea.placeholder = "Adicione algum texto..."
    element.appendChild(textArea)
 
    const fixedNote = document.createElement('i')
    fixedNote.classList.add (...["bi", "bi-pin"]);
    element.appendChild(fixedNote)
    if(fixed){
        element.classList.add('fixed');
    }

    const excluiNote = document.createElement("i")
    excluiNote.classList.add (...["bi", "bi-x-lg"]);
    element.appendChild(excluiNote)

    const duplicaNote = document.createElement("i")
    duplicaNote.classList.add(...["bi", "bi-file-earmark-plus"]);
    element.appendChild(duplicaNote)


    //eventos do elemento de fixar
    element.querySelector('.bi-pin').addEventListener('click', ()=>{
        toggleFixNote(id)
      
    })
    element.querySelector(".bi-x-lg").addEventListener('click', ()=>{
        deleteNotes(id, element)
    })
    element.querySelector(".bi-file-earmark-plus").addEventListener('click', ()=>{
        copyNote(id)
    })
 
    return element;

}

const toggleFixNote = (id)=>{
    const notes = getNote(); //para acessar local st.

    const targetNote = notes.filter((note)=> note.id === id)[0]
    targetNote.fixed = !targetNote.fixed;
  
    saveNotes(notes);
    showNotes();
}

function deleteNotes(id, element){
    const notes = getNote().filter((notes)=> notes.id !==id);
    saveNotes(notes);
    notesConteiner.removeChild(element)
}
function copyNote(id){
    const notes = getNote();
    const targetNote = notes.filter((note)=> note.id === id)[0];

    const newNote = {
        id: geraId(),
        content: targetNote.content,
        fixed: false,
    };
    const noteElement = createNote(
        newNote.id,
        newNote.content,
        newNote.fixed,
    )
    notesConteiner.appendChild(noteElement)
    notes.push(newNote);
    saveNotes(notes);
}
function searchNotes(search){
    
    const searchResults = getNote().filter((note)=>{
        return note.content.includes(search)
    })
    if(search !== ""){
        clearNotes();
        searchResults.forEach((note)=>{
            const noteElement = createNote(note.id, note.content)
            notesConteiner.appendChild(noteElement)
        })
        return;
    }
    clearNotes();
    showNotes();
}

function exportToCSV() {
    const notes = getNote(); // Cabeçalho da tabela
    let csvString = [["id', 'content', 'fixed\n"],
    ...notes.map((note)=> [note.id, note.content, note.fixed])
].map((e)=> e.join(",")).join("\n");

const element = document.createElement("a");
element.href = "data: text/csv;charset=utf-8," + encodeURI(csvString);

element.target ="_blank";
element.download = "notes.csv";
element.click();
}

//local storage
const getNote = ()=>{
    return JSON.parse(localStorage.getItem("notes")  || "[]");

    const orderedNotes = notes.sort((a, b)=>(a.fixed > b.fixed ? -1 : 1));
    return orderedNotes;
}

const saveNotes=(notes)=>{
    localStorage.setItem('notes', JSON.stringify(notes))
}

//eventos
addNotes.addEventListener("click", () =>{
    addNota()
})
searchInput.addEventListener("keyup", (e)=>{
    const search = e.target.value;
    searchNotes(search)
})

noteInput.addEventListener('heydown', (e)=>{
    if(e.key === "Enter"){
        addNotes();
    }
})
importCsv.addEventListener("click", ()=>{
    exportToCSV()
})

//inicialização
showNotes()