import 'dotenv/config';
import express from 'express';
import asyncHandler from 'express-async-handler';
import * as exercises from './exercise_model.mjs';

const app = express();
app.use(express.json())

const PORT = process.env.PORT;

function isValid(name, reps, weight, units, date) {
    const parsed = Date.parse(date.toString())
    if ((name.length > 0) && (reps > 0) && (weight >= 0) && (units)) {
        if (date) {
            if((Number.isNaN(parsed))) {return false;}
            else { return true;}
        }
        return true;
    } else {
        return false;
    }
}

app.post('/exercises', asyncHandler(async (req, res) => {
    const { name, reps, weight, unit, date } = req.body
    const validating = isValid(name, reps, weight, unit, date);
    if(!validating) {
        res.status(400).type('application/json').send({"Error": "Invalid request"})
    }
    else {
        const exercise = await exercises.createExercise(name, reps, weight, unit, date)
        res.status(201).type('application/json').send(exercise)
    }
}))

app.get('/exercises', asyncHandler(async (req, res) => {
    const allexercises = await exercises.findExercises()
    res.status(200).type('application/json').send(allexercises)
}))


app.get('/exercises/:id', asyncHandler(async (req, res) => {
    const searchID = req.params.id
    const retSearch = await exercises.searchExerciseId(searchID)
    if (retSearch) {
        res.status(200).type('application/json').send(retSearch)
    } else {
        res.status(404).type('application/json').send({"Error": "Not found"})
    }
}))


app.put('/exercises/:id', asyncHandler(async (req, res) => {
    const searchID = req.params.id
    const { name, reps, weight, unit, date } = req.body
    const validating = isValid(name, reps, weight, unit, date);
    if(validating) {
        const match = await exercises.updateExercise(searchID, req.body)
        if (match === 1) {
            const updated = await exercises.searchExerciseId(searchID)
            res.status(200).type('application/json').send(updated)
        } else {
            res.status(404).type('application/json').send({"Error": "Not found"})
        }
    }
    else {
        res.status(400).type('application/json').send({"Error": "Invalid request"})
    }
}))

app.delete('/exercises/:id', asyncHandler(async (req, res) => {
    const deleteCount = await exercises.deleteById(req.params.id)
    if (deleteCount === 0) {
        res.status(404).type('application/json').send({"Error": "Not found"})
    } else {
        res.status(204).type('application/json').send()
    }
}))

app.listen(PORT, async () => {
    await exercises.connect(true)
    console.log(`Server listening on port ${PORT}...`);
});