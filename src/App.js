import { useState, useEffect } from "react";
import { db, auth } from "./firebaseConnection"; // Importando o db para inserir dados no Firestore
import {
  addDoc,
  collection,
  doc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore"; // Importando o setDoc para inserir dados no Firestore
import "./App.css";
import { createUserWithEmailAndPassword } from "firebase/auth";

function App() {
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [idPost, setIdPost] = useState("");

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [posts, setPosts] = useState([]); // Criando um estado para armazenar os posts que sera uma lista de posts

  useEffect(() => {
    // useEffect e uma função que e disparada toda vez que o componente e montado, passando um array vazio para ser disparado apenas uma vez
    async function loadPosts() {
      const unsub = onSnapshot(collection(db, "posts"), (snapshot) => {
        let listaPost = []; // Criando uma lista vazia

        snapshot.forEach((doc) => {
          // Percorrendo os documentos da coleção com forEach e adicionando na lista
          listaPost.push({
            id: doc.id, // Adicionando o id do post na lista
            // ...doc.data(), // Adicionando os dados do documento na lista
            titulo: doc.data().titulo, // Adicionando o titulo do post na lista
            autor: doc.data().autor, // Adicionando o autor do post na lista
          });
        });

        setPosts(listaPost); // Setando o estado de posts na lista
      });
    }

    loadPosts(); // Chamando a função loadPosts para carregar os posts no Firestore e setar no estado de posts no useEffect
  }, []);

  async function handleAdd() {
    // Função para adicionar os dados no Firestore, async para aguardar a execução do setDoc e não travar a aplicação, setando os valores de titulo e autor
    //   await setDoc(doc(db, "posts", "123456997712"), {
    //     titulo: titulo,
    //     autor: autor
    //   })
    //   .then(() => {
    //     console.log("Dados cadastrados com sucesso!");
    //   })
    //   .catch((error) => {
    //     console.log("Erro ao cadastrar os dados: ", error);
    //   });
    // }

    await addDoc(collection(db, "posts"), {
      // Adicionando os dados no Firestore, collection para criar uma coleção e addDoc para adicionar os dados
      titulo: titulo,
      autor: autor,
    })
      .then(() => {
        console.log("Dados cadastrados com sucesso!");
        setTitulo(""); // Limpando o campo de titulo apos o cadastro
        setAutor(""); // Limpando o campo de autor apos o cadastro
      })
      .catch((error) => {
        console.log("Erro ao cadastrar os dados: ", error);
      });
  }

  async function buscarPost() {
    // const postRef = doc(db, "posts", "12345"); // Buscando os dados no Firestore, doc para buscar um documento, passando o db, a coleção e o id do documento

    // await getDoc(postRef)  // Buscando o documento no Firestore recebendo o postRef
    //   .then((snapshot) => {
    //     setAutor(snapshot.data().autor); // Setando o valor do autor com o valor do autor do documento
    //     setTitulo(snapshot.data().titulo); // Setando o valor do titulo com o valor do titulo do documento
    //   })
    //   .catch((error) => {
    //     console.log("Erro ao buscar os dados: ", error);
    //   });

    const postsRef = collection(db, "posts"); // Buscando os dados no Firestore, collection para buscar uma coleção, passando o db e o nome da coleção

    await getDocs(postsRef) // Buscando a coleção no Firestore com getDocs recebendo o postsRef
      .then((snapshot) => {
        let lista = []; // Criando uma lista vazia

        snapshot.forEach((doc) => {
          // Percorrendo os documentos da coleção com forEach e adicionando na lista
          lista.push({
            id: doc.id, // Adicionando o id do post na lista
            // ...doc.data(), // Adicionando os dados do documento na lista
            titulo: doc.data().titulo, // Adicionando o titulo do post na lista
            autor: doc.data().autor, // Adicionando o autor do post na lista
          });
        });

        setPosts(lista); // Setando o estado de posts na lista
      })
      .catch((error) => {
        console.log("Erro ao buscar os dados: ", error);
      });
  }

  async function editarPost() {
    const docRef = doc(db, "posts", idPost); // Buscando os dados no Firestore, doc para buscar um documento, passando o db, a coleção e o id do documento

    await updateDoc(docRef, {
      // Atualizando os dados no Firestore, updateDoc para atualizar os dados, passando o docRef e os dados que serão atualizados
      titulo: titulo,
      autor: autor,
    })
      .then(() => {
        console.log("Dados atualizados com sucesso!");
        setTitulo(""); // Limpando o campo de titulo apos a atualização
        setAutor(""); // Limpando o campo de autor apos a atualização
        setIdPost(""); // Limpando o campo de idPost apos a atualização
      })
      .catch((error) => {
        console.log("Erro ao atualizar os dados: ", error);
      });
  }

  async function excluirPost(id) {
    const docRef = doc(db, "posts", id); // Buscando os dados no Firestore, doc para buscar um documento, passando o db, a coleção e o id do documento

    await deleteDoc(docRef) // Deletando os dados no Firestore, deleteDoc para deletar os dados, passando o docRef
      .then(() => {
        console.log("Dados excluídos com sucesso!");
      })
      .catch((error) => {
        console.log("Erro ao excluir os dados: ", error);
      });
  }

  async function novoUsuario() {     // Função para criar um novo usuário no Firebase
    await createUserWithEmailAndPassword(auth, email, senha)    // Função para criar um novo usuário no Firebase, passando o email e a senha 

      .then(() => {
      
        console.log("Usuário cadastrado com sucesso!");  

        setEmail("");
        setSenha("");
      })
      .catch((error) => {
      
        if (error.code === "auth/email-already-in-use") {
          alert("Email já cadastrado!");

        } else if (error.code === "auth/weak-password") {
          alert("Senha muito fraca.");
        }
      });
  }

  return (
    <div className="App">
      <h1>ReactJS + Firebase</h1>

      <div className="container">
        <h2>Usuarios</h2>
        <label>Email</label>
        <input
          placeholder="Digite um email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />{" "}
        <br />
        <label>Senha</label>
        <input
          placeholder="Digite uma senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />{" "}
      </div>

      <button onClick={novoUsuario}>Cadastrar</button>

      <br />
      <br />

      <hr />

      <div className="container">
        <h2>Posts</h2>
        <label>Id do post:</label>
        <input
          type="text"
          placeholder="Digite o id do post"
          value={idPost}
          onChange={(e) => setIdPost(e.target.value)}
        />
        <label>Titulo:</label>
        <textarea
          type="text"
          placeholder="Digite o título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />{" "}
        {/* onChange e disparado toda vez que um valor é salvo e.target pega o valor do input */}
        <label>Descrição:</label>
        <input
          type="text"
          placeholder="Autor do post"
          value={autor}
          onChange={(e) => setAutor(e.target.value)}
        />
        <button onClick={handleAdd}>Cadastrar</button>
        <button onClick={buscarPost}>Buscar post</button>
        <button onClick={editarPost}>Atualizar post</button>
        <ul>
          {" "}
          {/* ul e uma lista nao ordenada */}
          {posts.map((post) => {
            // Percorrendo a lista de posts com map e retornando um li para cada post
            return (
              // Retornando o li com o titulo e autor do post apos percorrer a lista
              <li key={post.id}>
                <strong>ID do Post: {post.id}</strong> <br />
                <span>Titulo: {post.titulo} </span> <br />
                <span>Autor: {post.autor} </span> <br />
                <button onClick={() => excluirPost(post.id)}>
                  Excluir Post
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default App;
