import { databases, account } from "../appwrite/config";
import { ID, Query, Permission, Role } from "appwrite";

// 🔴 CHANGE THESE WITH YOUR REAL IDs
const DATABASE_ID = "6970bd68000a9d6af201";
const COLLECTION_ID = "notes";

console.log("DATABASE_ID 👉", DATABASE_ID);
console.log("COLLECTION_ID 👉", COLLECTION_ID);
/**
 * Create a new note
 */
export async function createNote({ title, content }) {
  try {
    // get current logged-in user
    const user = await account.get();

    const note = await databases.createDocument(
      DATABASE_ID,
      COLLECTION_ID,
      ID.unique(),
      {
        title,
        content,
        userId: user.$id,
        status : "todo",
        createdAt: new Date().toISOString(),
      },
      [
        Permission.read(Role.user(user.$id)),
        Permission.update(Role.user(user.$id)),
        Permission.delete(Role.user(user.$id)),
      ]
    );

    return note;
  } catch (err) {
    console.error("Create note error:", err);
    throw err;
  }
}

/**
 * Get all notes of current user
 */
export async function getNotes() {
  try {
    const user = await account.get();

    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      [Query.equal("userId", user.$id)]
    );

    return response.documents;
  } catch (err) {
    console.error("Get notes error:", err);
    throw err;
  }
}

/**
 * Update a note
 */
export async function updateNote(noteId, data) {
  try {
    return await databases.updateDocument(
      DATABASE_ID,
      COLLECTION_ID,
      noteId,
      data
    );
  } catch (err) {
    console.error("Update note error:", err);
    throw err;
  }
}


/**
 * Delete a note
 */
export async function deleteNote(noteId) {
  try {
    await databases.deleteDocument(
      DATABASE_ID,
      COLLECTION_ID,
      noteId
    );
  } catch (err) {
    console.error("Delete note error:", err);
    throw err;
  }
}
