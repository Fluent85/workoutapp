const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const path = require("path");
const workouts = require("./models/workout.js")

const PORT = process.env.PORT || 3000;

const db = require("./models");

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));


mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", { useNewUrlParser: true });

//API Routes:

app.get("/api/workouts", (req, res)=> {
    db.Workout.find({})
        .then(dbWorkout => {
            res.json(dbWorkout);
        })
        .catch(err => {
            res.json(err);
        });
});

app.get("/api/workouts/range", (req, res)=> {
    db.Workout.find({})
        .then(dbWorkout => {
            res.json(dbWorkout);
        })
        .catch(err => {
            res.json(err);
        });
});

app.put("/api/workouts/:id/", (req, res)=> {
    var condition = "id = " + req.params.id;
    console.log(req.body)
    //{id: req.params.id}

    db.Workout.updateOne({_id: req.params.id}, { $push: { exercises: req.body} })
    .then(function(result){
        console.log(result);
        if (result.nModified == 0) {
            // If no rows were changed, then the ID must not exist, so 404
            return res.json(false)
        } else {
            res.json(true)
            //res.status(200).end();
        }
    })
    .catch(err => {
        res.json(err);
    });
  
})  

app.post("/api/workouts/bulk", (req, res)=> {
    var condition = "id = " + req.params.id;
    console.log(req.body)
    //{id: req.params.id}

    db.Workout.findOne({})
    .then(function(response){
        console.log(response.excercises)
        var combinedArr = response.excercies.concat(req.body)
        return db.Workout.updateOne({}, {  exercises: combinedArr })
        
    })
    .then(function(result){

        console.log(result);
        if (result.nModified == 0) {
            // If no rows were changed, then the ID must not exist, so 404
            return res.json(false)
        } else {
            res.json(true)
            //res.status(200).end();
        }
    })
    .catch(err => {
        res.json(err);
    });
    //combineArr = the current arr plus arr from req.body

    
  
})  

app.post("/api/workouts", (req, res)=> {
    console.log("req.body", req.body)
    //create new workout
    db.Workout.create({})
    .then(dbWorkout => {
        res.json(dbWorkout);
    })
    .catch(err => {
        res.json(err);
    });
});
    //don't have to give any data
    //db.Workout
 

//HTML Routes:

app.get("/exercise", (req, res) => {
    res.sendFile(path.join(__dirname, "public/exercise.html"));
})

app.get("/stats", (req, res) => {
    res.sendFile(path.join(__dirname, "public/stats.html"));
})

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}!`);
});