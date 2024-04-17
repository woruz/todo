const Task = require("../models/Task");
const xlsx = require("xlsx");
const cloudinary = require('../config/cloudinary');
const { unlinkSync, readdirSync, rmSync } = require('fs')

const taskController = {
  getAllTasks: async (req, res) => {
    try {
      const tasks = await Task.find();
      res.status(200).json({success: true, response: tasks});
    } catch (err) {
      res.status(500).json({success: false, response: err.message });
    }
  },


  getTaskById: async (req, res) => {
    try {
      const task = await Task.findById(req.params.id);
      res.json(task);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },


  createTask: async (req, res) => {
    try {
      let pdfUrl;
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);
        pdfUrl = result.secure_url;
        unlinkSync(req.file.path);
      }

      const taskData = {
        title: req.body.title,
        description: req.body.description,
        pdfUrl: pdfUrl,
      };
      const task = new Task(taskData);
      await task.save();
      // const dir = 'pdfuploads';

      // readdirSync(dir).forEach(f => rmSync(`${dir}/${f}`));
      res.status(201).json({ message: "Task created successfully", task });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },


  updateTask: async (req, res) => {
    try {
      const { id } = req.params;
      const task = await Task.findByIdAndUpdate(id, {completed: true}, { new: true });
      res.json({ message: "Task updated successfully", task });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },


  deleteTask: async (req, res) => {
    try {
      const { id } = req.params;
      await Task.findByIdAndUpdate(id, {isDeleted: true});
      res.json({ message: "Task deleted successfully" });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },


  uploadTasksFromExcel: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const workbook = xlsx.readFile(req.file.path);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];

      const data = xlsx.utils.sheet_to_json(worksheet);
      const tasks = data.map((task) => ({
        title: task.title,
        description: task.description,
      }));
      unlinkSync(req.file.path);
      await Task.insertMany(tasks);

      res.json({ message: "Tasks uploaded successfully" });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
};

module.exports = taskController;
