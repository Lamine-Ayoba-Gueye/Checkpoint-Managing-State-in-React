import { useEffect, useState } from 'react';
import './App.css';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import { BsCheckLg } from 'react-icons/bs';

function App() {
  const [isCompleteScreen, setIsCompleteScreen] = useState(false);
  const [allTodos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescrition, setNewDescrition] = useState("");
  const [completedTodos, setCompletedTodos] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);


//ajouter un nouveau tache
  const handleAddTodo = () => {
    if (!newTitle || !newDescrition) {
      alert('Les champs titre et description sont obligatoire.');
      return;
    }
    let newTodoItem = {
      title: newTitle,
      description: newDescrition
    }
    let updateTodoArr = [...allTodos];
    updateTodoArr.push(newTodoItem);
    setTodos(updateTodoArr);
    localStorage.setItem('todolist', JSON.stringify(updateTodoArr));
    setNewTitle('');
    setNewDescrition('');
  }

  //modifier
  const handleUpdateTodo = (index) => {
    if (!newTitle || !newDescrition) {
      alert('Les champs titre et description sont obligatoire.');
      return;
    }
    let updatedTodo = {
      ...allTodos[index],
      title: newTitle,
      description: newDescrition
    };
    let updatedTodos = [...allTodos];
    updatedTodos[index] = updatedTodo;
    setTodos(updatedTodos);
    localStorage.setItem('todolist', JSON.stringify(updatedTodos));
    setNewTitle('');
    setNewDescrition('');
    setIsEditing(false);
    setEditIndex(null);
  }

//supprimer tache sur la liste lorsqu'on click sur icon delete
  const handleDeleteTodo = (index) => {
    if (window.confirm('Voulez-vous vraiment supprimer cette tâche ?')) {
      let reduceTodo = [...allTodos];
      reduceTodo.splice(index, 1);
      localStorage.setItem('todolist', JSON.stringify(reduceTodo));
      setTodos(reduceTodo);
    }
  }

//supprimer tache sur la liste si elle est terminer
  const handleDeleteTodoCompleted = (index) => {
    let reduceTodo = [...allTodos];
    reduceTodo.splice(index, 1);
    localStorage.setItem('todolist', JSON.stringify(reduceTodo));
    setTodos(reduceTodo);
  }

//supprimer tache terminer lorsqu'on click sur icon delete dans les taches termines
  const handleDeleteCompletedTodo = (index) => {
    if (window.confirm('Voulez-vous vraiment supprimer cette tâche ?')) {
      let reduceTodo = [...completedTodos];
      reduceTodo.splice(index);
      localStorage.setItem('completedTodos', JSON.stringify(reduceTodo));
      setCompletedTodos(reduceTodo);
    }
  }

  //tache terminer
  const handleComplete = (index) => {
    let now = new Date();
    let dd = now.getDate();
    let mm = now.getMonth() + 1;
    let yyyy = now.getFullYear();
    let h = now.getHours();
    let m = now.getMinutes();
    let s = now.getSeconds();
    let completedOn = dd + '-' + mm + '-' + yyyy + ' at ' + h + ':' + m + ':' + s;

    let filteredItem = {
      ...allTodos[index],
      completedOn: completedOn
    }

    let updateCompletedArr = [...completedTodos];
    updateCompletedArr.push(filteredItem);
    setCompletedTodos(updateCompletedArr);
    handleDeleteTodoCompleted(index);
    localStorage.setItem('completedTodos', JSON.stringify(updateCompletedArr));
  }

  //enregistrement des donnees dans le localStorage
  useEffect(() => {
    let savedTodo = JSON.parse(localStorage.getItem('todolist'));
    let savedCompletedTodo = JSON.parse(localStorage.getItem('completedTodos'));
    if (savedTodo) {
      setTodos(savedTodo);
    }
    if (savedCompletedTodo) {
      setCompletedTodos(savedCompletedTodo);
    }
  }, [])

  return (
    <div className="App">
      <h1>Taches</h1>

      <div className="todo-wrapper">
        <div className="todo-input">
          <div className="todo-input-item">
            <label>Titre</label>
            <input
              type="text"
              placeholder="nom du tache"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
          </div>
          <div className="todo-input-item">
            <label>Description</label>
            <input
              type="text"
              placeholder="quelle est la description?"
              value={newDescrition}
              onChange={(e) => setNewDescrition(e.target.value)}
            />
          </div>
          <div className="todo-input-item">
            <button
              type="button"
              className="primaryBtn"
              // onClick={handleAddTodo}
              onClick={isEditing ?()=> handleUpdateTodo(editIndex) : handleAddTodo}
            >
              {/* Ajouter */}
              {isEditing ? 'Mettre à jour' : 'Ajouter'}
            </button>
          </div>
        </div>

        <div className="btn-area">
          <button
            className={`secondaryBtn ${isCompleteScreen === false && 'active'}`}
            onClick={() => setIsCompleteScreen(false)}
          >
            Liste
          </button>
          <button
            className={`secondaryBtn ${isCompleteScreen === true && 'active'}`}
            onClick={() => setIsCompleteScreen(true)}
          >
            Terminer
          </button>
        </div>

        <div className="todo-list">
          {/* afiche la liste des taches */}
          {isCompleteScreen === false && allTodos.map((item, index) => {
            return (
              <div className="todo-list-item" key={index}>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>

                <div>
                  <AiOutlineDelete
                    className="icon"
                    title="Delete?"
                    onClick={() => handleDeleteTodo(index)}
                  />
                  <BsCheckLg
                    className="check-icon"
                    title="Complete?"
                    onClick={() => handleComplete(index)}
                  />
                  <AiOutlineEdit
                    className="check-icon"
                    title="Edit?"
                    onClick={() => {
                      setIsEditing(true);
                      setEditIndex(index)
                    }}
                  />
                </div>
              </div>
            );
          })}
          {/* afiche la liste des taches termines */}
          {isCompleteScreen === true && completedTodos.map((item, index) => {
            return (
              <div className="todo-list-item" key={index}>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <p> <small>Complete le:  {item.completedOn}</small></p>
                </div>

                <div>
                  <AiOutlineDelete
                    className="icon"
                    title="Delete?"
                    onClick={() => handleDeleteCompletedTodo(index)}
                  />

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}

export default App;
