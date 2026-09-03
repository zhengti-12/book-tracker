import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { db } from "./firebase";

export class BookService {
  static booksRef = collection(db, "books");

  static addBook(userId, { title, genre, date }) {
    return addDoc(BookService.booksRef, { userId, title, genre, date });
  }

  static deleteBook(bookId) {
    return deleteDoc(doc(db, "books", bookId));
  }

  // callback fires with the live list of this user's books, updating in real time
  static subscribeToBooks(userId, callback) {
    const q = query(BookService.booksRef, where("userId", "==", userId));
    return onSnapshot(q, (snapshot) => {
      const books = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      callback(books);
    });
  }
}