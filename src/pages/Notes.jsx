import { useEffect, useState } from "react";
import { getNotes, createNote, updateNote, deleteNote } from "../service/notesService";
import { summarizeText } from "../service/aiService";
import { account } from "../appwrite/config";
import { useNavigate } from "react-router-dom";



function Notes() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [dragged, setDragged] = useState(null);
  const [dark, setDark] = useState(false);

const navigate = useNavigate();

const handleLogout = async () => {
  await account.deleteSession("current");
  navigate("/login");
};


  const loadNotes = async () => {
    const data = await getNotes();
    setNotes(data);
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    await createNote({ title, content });
    setTitle("");
    setContent("");
    loadNotes();
  };

  const startEdit = (note) => {
    setEditingId(note.$id);
    setTitle(note.title);
    setContent(note.content);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    await updateNote(editingId, { title, content });
    setEditingId(null);
    setTitle("");
    setContent("");
    loadNotes();
  };

  const handleDelete = async (id) => {
    await deleteNote(id);
    loadNotes();
  };

  const moveNote = async (id, newStatus) => {
    await updateNote(id, { status: newStatus });
    loadNotes();
  };

  const todo = notes.filter(n => n.status === "todo");
  const progress = notes.filter(n => n.status === "progress");
  const done = notes.filter(n => n.status === "done");

  const renderNotes = (list) =>
    list.map(note => (
      <div
  key={note.$id}
  draggable
  onDragStart={() => setDragged(note)}
 className={`${dark ? "bg-zinc-700" : "bg-white"} p-4 rounded-xl shadow-sm hover:shadow-lg transition mb-3 cursor-move`}

>

        <h3 className="font-semibold">{note.title}</h3>
        <p className="text-sm text-gray-600">{note.content}</p>

        <div className="mt-2 flex gap-2 flex-wrap">

          <button
            onClick={() => startEdit(note)}
            className="text-blue-500"
          >
            Edit
          </button>

          <button
            onClick={() => handleDelete(note.$id)}
            className="text-red-500"
          >
            Delete
          </button>
          {note.originalContent && (
  <button
    onClick={async () => {
      await updateNote(note.$id, {
        content: note.originalContent,
        originalContent: null
      });
      loadNotes();
    }}
    className="text-gray-600"
  >
    Restore Original
  </button>
)}


          {note.status === "todo" && (
            <button
              onClick={() => moveNote(note.$id, "progress")}
              className="text-yellow-600"
            >
              Move to Progress
            </button>
          )}
          <button
          onClick={async () => {
  const summary = await summarizeText(note.content);

  await updateNote(note.$id, {
    originalContent: note.content,   // save backup
    content: summary
  });

  loadNotes();
}}


            className="text-purple-600"
          >
          Summarize
          </button>

          {note.status === "progress" && (
            <button
              onClick={() => moveNote(note.$id, "done")}
              className="text-green-600"
            >
               Done
            </button>
          )}

        </div>
      </div>
    ));

  return (
    <div className={`${dark ? "bg-zinc-900 text-white" : "bg-slate-50 text-black"} p-6 min-h-screen transition`}>

      <div className="flex justify-between items-center mb-6">
  <h1 className="text-2xl font-bold">Secured Notes</h1>

  <button
    onClick={handleLogout}
    className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
  >
    Logout
  </button>
</div>

      <button
  onClick={() => setDark(!dark)}
  className="mb-4 px-4 py-1 rounded bg-gray-800 text-white hover:bg-gray-700"
>
  {dark ? "☀ Light Mode" : "🌙 Dark Mode"}
</button>


      <form
        onSubmit={editingId ? handleUpdate : handleCreate}
        className="mb-6 flex gap-2"
      >
        <input
          className="border p-2 rounded w-1/3"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          className="border p-2 rounded w-1/2"
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button className="bg-blue-500 text-white px-4 rounded">
          {editingId ? "Update" : "Add"}
        </button>
      </form>

      <div className="grid grid-cols-3 gap-6">

        <div
 className={`${dark ? "bg-zinc-800" : "bg-gray-100"} p-4 rounded-xl min-h-[300px]`}

  onDragOver={(e) => e.preventDefault()}
  onDrop={() => dragged && moveNote(dragged.$id, "todo")}
>


          <h2 className="font-bold mb-2 text-blue-600">Todo</h2>
          {renderNotes(todo)}
        </div>

        <div
className={`${dark ? "bg-zinc-800" : "bg-gray-100"} p-4 rounded-xl min-h-[300px]`}

  onDragOver={(e) => e.preventDefault()}
  onDrop={() => dragged && moveNote(dragged.$id, "progress")}
>


          <h2 className="font-bold mb-2 text-yellow-600">In Progress</h2>
          {renderNotes(progress)}
        </div>

        <div
className={`${dark ? "bg-zinc-800" : "bg-gray-100"} p-4 rounded-xl min-h-[300px]`}

  onDragOver={(e) => e.preventDefault()}
  onDrop={() => dragged && moveNote(dragged.$id, "done")}
>


          <h2 className="font-bold mb-2 text-green-600">Done</h2>
          {renderNotes(done)}
        </div>

      </div>
    </div>
  );
}

export default Notes;
