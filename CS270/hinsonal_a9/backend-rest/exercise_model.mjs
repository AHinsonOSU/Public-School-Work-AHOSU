import mongoose from 'mongoose';
import 'dotenv/config';

const EXERCISE_DB_NAME = 'exercise_db';
const EXERCISE_COLLECTION = 'exercises';
const EXERCISE_CLASS = 'Exercise';

let connection = undefined;
let Exercise = undefined;

async function connect(dropCollection){
    try{
        connection = await createConnection();
        console.log("Successfully connected to MongoDB using Mongoose!");
        if(dropCollection){
            await connection.db.dropCollection(EXERCISE_COLLECTION);
        }
        Exercise = createModel();
        
    } catch(err){
        console.log(err);
        throw Error(`Could not connect to MongoDB ${err.message}`)
    }
}

async function createConnection(){
    await mongoose.connect(process.env.MONGODB_CONNECT_STRING, 
                {dbName: EXERCISE_DB_NAME});
    return mongoose.connection;
}

function createModel() {

    const exerciseSchema = mongoose.Schema({
        name: {type: String, require: true},
        reps: {type: Number, required: true},
        weight: {type: Number, required: true},
        unit: {type: String, required: true},
        date: {type: Date, required: true, default: Date.now()}
    });

    return mongoose.model(EXERCISE_CLASS, exerciseSchema);
}


async function createExercise(name, reps, weight, unit, date){
    const exercise = new Exercise({name: name, reps: reps, weight: weight, unit: unit, date: date});
    return exercise.save();
}


async function findExercises(filter){
    const query = Exercise.find(filter);
    return query.exec();
}

async function searchExerciseId(id) {
    const query = Exercise.findById(id);
    return query.exec();
}

async function updateExercise(_id, update) {
    const result = await Exercise.updateOne({_id: _id}, update);
    return result.matchedCount;
}

async function deleteById(_id){
    const result = await Exercise.deleteOne({_id: _id});
    return result.deletedCount;
}
export { connect, createExercise, findExercises, searchExerciseId, updateExercise, deleteById};