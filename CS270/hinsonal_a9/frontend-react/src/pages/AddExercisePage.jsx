import '../App.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const AddExercisePage = () => {

    const [name, setName] = useState('');
    const [reps, setReps] = useState('');
    const [weight, setWeight] = useState('');
    const [unit, setUnit] = useState('');
    const [date, setDate] = useState('');

    const navigate = useNavigate();

    const addExercise = async () => {
        const newExercise = {name, reps, weight, unit, date}
        const response = await fetch(
            '/exercises', {
                method: 'POST', 
                headers: {'Content-type': 'application/json'},
                body: JSON.stringify(newExercise)
            }
        );
        if(response.status === 201){
            alert("Successfully added the exercise")
        } else {
            alert("Failed to add exercise, status code = " + response.status)
        }
        navigate('/')
    };

    return (
        <div id="addPage">
            <h1>Add Exercise</h1>
            <form 
            onSubmit={e =>{addExercise(); 
            e.preventDefault(); }}>
                <p>
                    <label>Name:</label>
                    <input
                        type="text"
                        placeholder="Name of exercise"
                        required="required"
                        value={name}
                        onChange={e => setName(e.target.value)} 
                    />
                </p>
                <p>
                    <label>Reps:</label>
                    <input
                        type="number"
                        value={reps}
                        placeholder="Reps completed"
                        required="required"
                        onChange={e => setReps(e.target.valueAsNumber)} 
                    />
                </p>
                <p>
                    <label>Weight:</label>
                    <input
                        type="number"
                        value={weight}
                        placeholder="Weight achieved"
                        required="required"
                        onChange={e => setWeight(e.target.valueAsNumber)} 
                    />
                </p>
                <p>
                    <label>Units:</label>
                    <select value={unit} required="required" onChange={e => setUnit(e.target.value)}>
                        <option valut ="">--Select a Value</option>
                        <option value="lbs">lbs</option>
                        <option value="kgs">kgs</option>
                        <option value="miles">miles</option>
                    </select>
                </p>
                <p>
                    <label>Date:</label>
                    <input
                        type="date"
                        placeholder="Date completed"
                        value={date}
                        required="required"
                        onChange={e => setDate(e.target.value)} 
                    />
                </p>
                <button type="submit">Add</button>
            </form>
        </div>
    );
}

export default AddExercisePage;