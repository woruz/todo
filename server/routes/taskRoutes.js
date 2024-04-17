const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { excelUpload, pdfUpload } = require('../middleware/upload');

router.get('/', taskController.getAllTasks);
router.get('/:id', taskController.getTaskById);
router.post('/',pdfUpload.single('file'), taskController.createTask);
router.put('/:id', taskController.updateTask);
router.post('/:id', taskController.deleteTask);
router.post('/excel/upload', excelUpload.single('file'), taskController.uploadTasksFromExcel);

module.exports = router;