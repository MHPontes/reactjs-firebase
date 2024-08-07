import { useState } from "react";
import { db } from "./firebaseConnection"; // Importando o db para inserir dados no Firestore
import { addDoc, collection, doc, getDoc, setDoc } from "firebase/firestore"; // Importando o setDoc para inserir dados no Firestore
import "./App.css";

function App() {
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");

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
    const postRef = doc(db, "posts", "12345"); // Buscando os dados no Firestore, doc para buscar um documento, passando o db, a coleção e o id do documento

    await getDoc(postRef)  // Buscando o documento no Firestore recebendo o postRef
      .then((snapshot) => {
        setAutor(snapshot.data().autor); // Setando o valor do autor com o valor do autor do documento
        setTitulo(snapshot.data().titulo); // Setando o valor do titulo com o valor do titulo do documento
      })
      .catch((error) => {
        console.log("Erro ao buscar os dados: ", error);
      });
  }

  return (
    <div className="App">
      <h1>ReactJS + Firebase</h1>

      <div className="container">
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
      </div>
    </div>
  );
}

export default App;
