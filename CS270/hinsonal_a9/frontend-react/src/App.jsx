import './App.css';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AddExercisePage from './pages/AddExercisePage';
import EditExercisePage from './pages/EditExercisePage';

function App() {

  const [exerciseToEdit, setExerciseToEdit] = useState();

  return (
    <div className="app">
      <header>
        <h1>List of Exercises</h1>
        <p>Here's a log of all saved exercises. Add, Edit, or Delete them!</p>
      </header>
        <Router>
          <nav id="app-nav">
              <Link to="/">Home</Link>
              <Link to="/add-exercise">Add</Link>
          </nav>
          <Routes>
            <Route path="/" element={<HomePage setExerciseToEdit={setExerciseToEdit} />}></Route>
            <Route path="/add-exercise" element={ <AddExercisePage />}></Route>
            <Route path="/edit-exercise" element={ <EditExercisePage exerciseToEdit={exerciseToEdit} />}></Route>
          </Routes>
        </Router>
      <footer>
        <p>&copy; Alex Hinson; 2025</p>
      </footer>
    </div>
  );
}

export default App;