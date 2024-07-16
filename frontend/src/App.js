import './App.css';
import { useEffect, useState } from 'react';
import List from './components/List';
import axios from "axios";
import { BASE_URL } from './utils/constant';


function App() {

  const [input, setInput] = useState("")
  const [tasks, setTasks] = useState([])
  const [updateUI, setUpdateUI] = useState(false);
  const [updateId, setUpdateId] = useState(null);

  useEffect(()=>{
    axios.get(`${BASE_URL}/get`)
    .then((res) => {
      console.log(res.data);
      setTasks(res.data);
    })
  }, [updateUI])

  // 몽고 db 추가 함수
  const addTask = () => {
    axios.post(`${BASE_URL}/save`, {task: input}).then((res) => {
      console.log(res.data);
      setInput('');
      setUpdateUI((prevState) => !prevState)
    });
  };

  // 수정
  const updateMode = (id, text) => {
    console.log(id);
    setInput(text);
    setUpdateId(id);
  }
  const updateTask = () => {
    axios.put(`${BASE_URL}/update/${updateId}`, {task: input}).then((res)=>{
      console.log(res.data);
      setUpdateUI((prevState)=> !prevState);
      setUpdateId(null);
      setInput('');
    })
  }


  return (
    <main className='main'>
      <h1 className='title'>CRUD BOARD</h1>

      <div className='input_holder'>
        <input type='text' value={input} onChange={(e) => setInput(e.target.value)}/>
        
        <button type='submit' onClick={updateId ? updateTask : addTask}>{updateId ? "Update Task" : "Add Task"}</button>
      </div>
      <ul>
        {tasks.map((task)=>(
          <List key={task.id} id={task._id} task={task.task} setUpdateUI={setUpdateUI} updateMode={updateMode}></List>
        ))}
      </ul>
    </main>
  );
}

export default App;
