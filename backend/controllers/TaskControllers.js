const TaskModel = require("../models/TaskModel")

module.exports.getTasks = async (req, res) => {
    const tasks = await TaskModel.find()
    res.send(tasks)
}   

// task 업데이트
module.exports.updateTask = async (req, res) => {
    const { id } = req.params
    const { task} = req.body
    
    TaskModel.findByIdAndUpdate(id, { task })
    .then(() => res.send("업데이트 성공"))    
    .catch((err)=>{
        console.log(err);
        res.send({error: err, msg: "업데이트 문제있다!"});
    });
};

// task 삭제  
module.exports.deleteTask = async (req, res) => {
    const { id } = req.params
    
    TaskModel.findByIdAndDelete(id)
    .then(() => res.send("삭제 성공"))    
    .catch((err)=>{
        console.log(err);
        res.send({error: err, msg: "삭제 문제있다!"});
    });
};

// task 저장
module.exports.saveTask = async (req, res) => {
    const { task} = req.body
    TaskModel.create({task})
    .then((data) => {
        console.log("저장 성공");
        res.status(201).send(data)
    }).catch((err)=>{
        console.log(err);
        res.send({error: err, msg: "문제있다!"});
    });
};