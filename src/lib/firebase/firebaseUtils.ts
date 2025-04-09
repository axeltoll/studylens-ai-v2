import { auth, db, storage } from "./firebase";
import {
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit as firebaseLimit,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Auth functions
export const logoutUser = () => signOut(auth);

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

// Firestore functions
export const addDocument = (collectionName: string, data: any) =>
  addDoc(collection(db, collectionName), data);

export const getDocuments = async (collectionName: string) => {
  const querySnapshot = await getDocs(collection(db, collectionName));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export const updateDocument = (collectionName: string, id: string, data: any) =>
  updateDoc(doc(db, collectionName, id), data);

export const deleteDocument = (collectionName: string, id: string) =>
  deleteDoc(doc(db, collectionName, id));

// Storage functions
export const uploadFile = async (file: File, path: string) => {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};

// Chat history functions
export const saveChat = async (userId: string, chatData: any) => {
  return addDoc(collection(db, "chats"), {
    userId,
    ...chatData,
    timestamp: serverTimestamp(),
  });
};

export const getUserChats = async (userId: string, limitCount = 20) => {
  const chatsQuery = query(
    collection(db, "chats"),
    where("userId", "==", userId),
    orderBy("timestamp", "desc"),
    firebaseLimit(limitCount)
  );
  
  const querySnapshot = await getDocs(chatsQuery);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

// Library functions
export const saveToLibrary = async (userId: string, itemData: any) => {
  return addDoc(collection(db, "library"), {
    userId,
    ...itemData,
    timestamp: serverTimestamp(),
  });
};

export const getUserLibraryItems = async (userId: string, itemType?: string) => {
  let libraryQuery;
  
  if (itemType) {
    libraryQuery = query(
      collection(db, "library"),
      where("userId", "==", userId),
      where("type", "==", itemType),
      orderBy("timestamp", "desc")
    );
  } else {
    libraryQuery = query(
      collection(db, "library"),
      where("userId", "==", userId),
      orderBy("timestamp", "desc")
    );
  }
  
  const querySnapshot = await getDocs(libraryQuery);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

// Quiz & Flashcard functions
export const saveQuiz = async (userId: string, quizData: any) => {
  return addDoc(collection(db, "quizzes"), {
    userId,
    ...quizData,
    timestamp: serverTimestamp(),
  });
};

export const getUserQuizzes = async (userId: string) => {
  const quizzesQuery = query(
    collection(db, "quizzes"),
    where("userId", "==", userId),
    orderBy("timestamp", "desc")
  );
  
  const querySnapshot = await getDocs(quizzesQuery);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export const saveFlashcardSet = async (userId: string, flashcardData: any) => {
  return addDoc(collection(db, "flashcards"), {
    userId,
    ...flashcardData,
    timestamp: serverTimestamp(),
  });
};

export const getUserFlashcardSets = async (userId: string) => {
  const flashcardsQuery = query(
    collection(db, "flashcards"),
    where("userId", "==", userId),
    orderBy("timestamp", "desc")
  );
  
  const querySnapshot = await getDocs(flashcardsQuery);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

// User activity and history functions
export const updateUserActivity = async (userId: string, activityData: any) => {
  // Get user document or create if it doesn't exist
  const userDocRef = doc(db, "users", userId);
  const userDoc = await getDoc(userDocRef);
  
  if (userDoc.exists()) {
    // Update existing user document
    return updateDoc(userDocRef, {
      lastActive: serverTimestamp(),
      ...activityData
    });
  } else {
    // Create new user document
    return addDoc(collection(db, "users"), {
      userId,
      createdAt: serverTimestamp(),
      lastActive: serverTimestamp(),
      ...activityData
    });
  }
};

export const getUserActivity = async (userId: string) => {
  const userDocRef = doc(db, "users", userId);
  const userDoc = await getDoc(userDocRef);
  
  if (userDoc.exists()) {
    return {
      id: userDoc.id,
      ...userDoc.data()
    };
  }
  
  return null;
};
