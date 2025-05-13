const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { 
  createTask,
  getAllTask,
  getTaskById,
  getTaskByCategory,
  deleteTask,
  updateTask
} = require('../controllers/taskController');

const protectRoute = require('../middleware/authMiddleware');

// Buat task baru
router.post('/', protectRoute, asyncHandler(createTask)); //done

// Ambil semua task milik user
router.get('/user/:userId', protectRoute, asyncHandler(getAllTask)); //done

// Ambil task berdasarkan kategori
router.get('/category/:category', protectRoute, asyncHandler(getTaskByCategory)); //done

// Ambil task berdasarkan ID
router.get('/id/:taskId', protectRoute, asyncHandler(getTaskById)); //done

// Perbarui task
router.put('/id/:taskId', protectRoute, asyncHandler(updateTask));

// Hapus task
router.delete('/id/:taskId', protectRoute, asyncHandler(deleteTask)); //done

module.exports = router;
