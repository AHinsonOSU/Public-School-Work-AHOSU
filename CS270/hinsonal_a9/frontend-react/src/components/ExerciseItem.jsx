import '../App.css';
import { HiOutlinePencilAlt, HiOutlineTrash } from "react-icons/hi";


function ExerciseItem({ exercise, onDelete, onEdit}) {

    return (
        <tr>
            <td>
                <h3>{exercise.name}</h3>
            </td>
            <td>
                <h3>{exercise.reps}</h3>
            </td>
            <td>
                <h3>{exercise.weight}</h3>
            </td>
            <td>
                <h3>{exercise.unit}</h3>
            </td>
            <td>
                <h3>{exercise.date?.split('T')[0]}</h3>
            </td>
            <td className='table-icons'>
                <HiOutlinePencilAlt onClick={e => {e.preventDefault(); onEdit(exercise)}}/>
                <HiOutlineTrash onClick={e => {e.preventDefault(); onDelete(exercise._id)}}/>
            </td>
            
        </tr>
    );
}

export default ExerciseItem;