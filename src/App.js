import { useState } from "react";
import { db } from "./firebaseConnection";    // Importando o db para inserir dados no Firestore
import { doc, setDoc } from "firebase/firestore";     // Importando o setDoc para inserir dados no Firestore
import  "./App.css";


function App() {
const [titulo, setTitulo] = useState("");
const [autor, setAutor] = useState("");


  async function handleAdd() {       // Função para adicionar os dados no Firestore, async para aguardar a execução do setDoc e não travar a aplicação 
    await setDoc(doc(db, "posts", "123456997712"), {     
      titulo: titulo,
      autor: autor
    })
    .then(() => {
      console.log("Dados cadastrados com sucesso!");
    })
    .catch((error) => {
      console.log("Erro ao cadastrar os dados: ", error);
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
        onChange={(e) => setTitulo(e.target.value)}  />    {/* onChange e disparado toda vez que um valor é salvo e.target pega o valor do input */} 

        <label>Descrição:</label>
        <input 
        type="text" 
        placeholder="Autor do post" 
        value={autor}
        onChange={(e) => setAutor(e.target.value)}  />

        <button onClick={handleAdd}>Cadastrar</button>
      </div>
    </div>
  );
}


export default App;