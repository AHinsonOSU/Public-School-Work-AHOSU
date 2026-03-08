import '../App.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const EditExercisePage = ({exerciseToEdit}) => {

    const [name, setName] = useState(exerciseToEdit.name);
    const [reps, setReps] = useState(exerciseToEdit.reps);
    const [weight, setWeight] = useState(exerciseToEdit.weight);
    const [unit, setUnit] = useState(exerciseToEdit.unit);
    const [date, setDate] = useState(exerciseToEdit.date?.split('T')[0]);

    const navigate = useNavigate();

    const editExercise = async () => {
        const editedExercise = {name, reps, weight, unit, date}
        const response = await fetch(
            `/exercises/${exerciseToEdit._id}`, {
                method: 'PUT', 
                headers: {'Content-type': 'application/json'},
                body: JSON.stringify(editedExercise)
            }
        );
        if(response.status === 200){
            alert("Successfully edited the exercise")
        } else {
            alert("Failed to edit exercise, status code = " + response.status)
        }
        
        navigate("/")
    };

    return (
        <div id="editPage">
            <h1>Edit Exercise</h1>
            <form onSubmit={e =>{editExercise(); 
            e.preventDefault(); }}>
                <p>
                    <label>Name:</label>
                    <input
                        type="text"
                        value={name}
                        required="required"
                        onChange={e => setName(e.target.value)} 
                    />
                </p>
                <p>
                    <label>Reps:</label>
                    <input
                        type="number"
                        value={reps}
                        required="required"
                        onChange={e => setReps(e.target.valueAsNumber)} 
                    />
                </p>
                <p>
                    <label>Weight:</label>
                    <input
                        type="number"
                        value={weight}
                        required="required"
                        onChange={e => setWeight(e.target.valueAsNumber)} 
                    />
                </p>
                <p>
                    <label>Units:</label>
                    <select required="required" onChange={e => setUnit(e.target.value)}>
                        <option value="lbs">lbs</option>
                        <option value="kgs">kgs</option>
                        <option value="miles">miles</option>
                    </select>
                </p>
                <p>
                    <label>Date:</label>
                    <input
                        type="date"
                        value={date}
                        required="required"
                        onChange={e => setDate(e.target.value)} 
                    />
                </p>
                <button type="submit">Update</button>
            </form>
        </div>
    );
}

export default EditExercisePage;