const admin = require('firebase-admin');
const db = admin.firestore();
const { nanoid } = require('nanoid');

// Buat task baru
const createTask = async (req, res) => {
  const { category, dueDate, title, userId, desc } = req.body;

  const taskId = nanoid(15).toUpperCase();
  if (!category || !title || !userId) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const taskRef = await db.collection('task').add({
    userId,
    taskId,
    title,
    category,
    dueDate,
    desc,
    createdAt: new Date().toISOString(),
  });
  const taskDoc = await taskRef.get();
  res.status(201).json({ message: 'Task created successfully', ...taskDoc.data() });
};

// Ambil semua task berdasarkan userId
const getAllTask = async (req, res) => {
  const { userId } = req.params;

  const snapshot = await db.collection('task').where('userId', '==', userId).get();

  if (snapshot.empty) {
    return res.status(200).json({ tasks: [] });
  }

  const tasks = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  res.status(200).json({ tasks });
};

// Ambil task berdasarkan category
const getTaskByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    if (!category) {
      return res.status(400).json({ message: 'Category parameter is required' });
    }

    const snapshot = await db.collection('task').where('category', '==', category).get();

    if (snapshot.empty) {
      return res.status(404).json({ message: 'No tasks found for this category' });
    }

    const tasks = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json({ tasks });
  } catch (error) {
    console.error('Error getting tasks by category:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Ambil task berdasarkan taskId
const getTaskById = async (req, res) => {
  try {
    const { taskId } = req.params;

    if (!taskId) {
      return res.status(400).json({ message: 'taskId parameter is required' });
    }

    const snapshot = await db.collection('task').where('taskId', '==', taskId).get();

    if (snapshot.empty) {
      return res.status(404).json({ message: 'No tasks found for this taskId' });
    }

    const tasks = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json({ tasks });
  } catch (error) {
    console.error('Error getting tasks by taskId:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update task berdasarkan taskId
const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { category, dueDate, title, userId, desc } = req.body;

    if (!taskId) {
      return res.status(400).json({ message: 'taskId parameter is required' });
    }

    if (!category || !title || !userId) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const snapshot = await db.collection('task').where('taskId', '==', taskId).get();

    if (snapshot.empty) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Get the document reference from the first matching document
    const taskDoc = snapshot.docs[0];
    await taskDoc.ref.update({
      category,
      dueDate,
      title,
      userId,
      desc,
      updatedAt: new Date().toISOString()
    });

    res.status(200).json({ message: 'Task updated successfully', ...taskDoc.data() });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Hapus task berdasarkan taskId
const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    if (!taskId) {
      return res.status(400).json({ message: 'taskId parameter is required' });
    }

    const snapshot = await db.collection('task').where('taskId', '==', taskId).get();

    if (snapshot.empty) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Get the document reference from the first matching document
    const taskDoc = snapshot.docs[0];
    await taskDoc.ref.delete();
    
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createTask,
  getAllTask,
  getTaskById,
  getTaskByCategory,
  updateTask,
  deleteTask
};
