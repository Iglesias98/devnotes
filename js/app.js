const noteForm = document.getElementById('note-form');
const notesList = document.getElementById('notes-list');

// Chave utilizada para gravar no LocalStorage do navegador
const STORAGE_KEY = 'devnotes_data';

// 1. Buscar notas do LocalStorage
function getNotes() {
  const notes = localStorage.getItem(STORAGE_KEY);
  return notes ? JSON.parse(notes) : [];
}

// 2. Salvar array de notas no LocalStorage
function saveNotesToStorage(notes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

// 3. Renderizar as notas na tela
function renderNotes() {
  const notes = getNotes();

  if (notes.length === 0) {
    notesList.innerHTML = `<p style="color: #94a3b8;">Nenhuma nota encontrada. Crie a primeira acima!</p>`;
    return;
  }

  notesList.innerHTML = notes.map(note => `
    <div class="note-card">
      <div>
        <div class="note-header">
          <span class="note-title">${escapeHTML(note.title)}</span>
          <span class="note-category">${escapeHTML(note.category)}</span>
        </div>
        <p class="note-body">${escapeHTML(note.content)}</p>
      </div>
      <button class="delete-btn" onclick="deleteNote(${note.id})">Excluir</button>
    </div>
  `).join('');
}

// 4. Manipular a criação de uma nova nota
noteForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const title = document.getElementById('title').value;
  const category = document.getElementById('category').value;
  const content = document.getElementById('content').value;

  const newNote = {
    id: Date.now(), // Gera um ID único usando o timestamp
    title,
    category,
    content
  };

  const notes = getNotes();
  notes.unshift(newNote); // Adiciona no início da lista

  saveNotesToStorage(notes);
  noteForm.reset();
  renderNotes();
});

// 5. Excluir uma nota pelo ID
function deleteNote(id) {
  if (!confirm('Deseja realmente excluir esta nota?')) return;

  let notes = getNotes();
  notes = notes.filter(note => note.id !== id);

  saveNotesToStorage(notes);
  renderNotes();
}

// Auxiliar para segurança contra XSS ao renderizar HTML
function escapeHTML(str) {
  return str ? str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  ) : '';
}

// Carrega as notas salvas assim que a página abre
document.addEventListener('DOMContentLoaded', renderNotes);