// src/utils/firebaseUtils.js
import { db } from "../firebase";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  setDoc,
  query,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

export const createPost = async (postData) => {
  console.log("Tentando criar post no Firestore...");
  const auth = getAuth();
  console.log("Usuário atual no createPost:", auth.currentUser);
  try {
    const docRef = await addDoc(collection(db, "posts"), {
      ...postData,
      createdAt: new Date(),
    });
    console.log("Post criado com sucesso. ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Erro ao criar post:", error);
    throw error;
  }
};

export const updatePost = async (id, postData) => {
  console.log("Tentando atualizar post no Firestore. ID:", id);
  const auth = getAuth();
  console.log("Usuário atual no updatePost:", auth.currentUser);
  try {
    await setDoc(doc(db, "posts", id), postData, { merge: true });
    console.log("Post atualizado com sucesso.");
  } catch (error) {
    console.error("Erro ao atualizar post:", error);
    throw error;
  }
};

export const getPostById = async (id) => {
  console.log("Buscando post por ID:", id);
  try {
    const docSnap = await getDoc(doc(db, "posts", id));
    if (docSnap.exists()) {
      console.log("Post encontrado:", docSnap.data());
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.log("Post não encontrado.");
      return null;
    }
  } catch (error) {
    console.error("Erro ao buscar post:", error);
    throw error;
  }
};

export const getPosts = async () => {
  console.log("Buscando todos os posts...");
  try {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const posts = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("Posts encontrados:", posts);
    return posts;
  } catch (error) {
    console.error("Erro ao buscar posts:", error);
    throw error;
  }
};