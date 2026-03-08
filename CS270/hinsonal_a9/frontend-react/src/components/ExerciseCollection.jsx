import '../App.css';
import ExerciseItem from './ExerciseItem';

function ExerciseCollection({ exercises, onDelete, onEdit}) {
    return (
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Reps</th>
                    <th>Weight</th>
                    <th>Unit</th>
                    <th>Date</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
            {exercises.map((exercise, i) => <ExerciseItem exercise={exercise} 
                    onDelete={onDelete} onEdit={onEdit} key={i} />)}
            </tbody>
        </table>

    );
}

export default ExerciseCollection;