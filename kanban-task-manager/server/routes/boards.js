// routes/boards.js (excerpt)
const router = require('express').Router();
const auth = require('../middleware/auth');
const Board = require('../models.js/Board');
const TaskList = require('../models.js/TaskList');
const Task = require('../models.js/Task');


router.use(auth);


router.get('/', async (req,res) => {
const boards = await Board.find({ owner: req.userId }).select('title createdAt updatedAt listOrder');
res.json(boards);
});


router.post('/', async (req,res) => {
const board = await Board.create({ owner: req.userId, title: req.body.title, listOrder: [] });

// Create default task lists with sample tasks
const defaultLists = [
  { 
    title: 'To Do', 
    order: 0,
    sampleTasks: [
      { title: 'Welcome to your new board!', description: 'This is a sample task to get you started.', priority: 'medium' },
      { title: 'Add your first task', description: 'Click the + button below to create your own tasks.', priority: 'low' }
    ]
  },
  { 
    title: 'In Progress', 
    order: 1,
    sampleTasks: [
      { title: 'Sample in-progress task', description: 'This shows how tasks look when they are being worked on.', priority: 'high' }
    ]
  },
  { 
    title: 'Done', 
    order: 2,
    sampleTasks: [
      { title: 'Sample completed task', description: 'This shows how completed tasks appear.', priority: 'medium' }
    ]
  }
];

const createdLists = [];
for (const listData of defaultLists) {
  const list = await TaskList.create({ 
    board: board._id, 
    title: listData.title, 
    taskOrder: [] 
  });
  
  // Create sample tasks for this list
  const sampleTasks = [];
  for (const taskData of listData.sampleTasks) {
    const task = await Task.create({
      board: board._id,
      list: list._id,
      title: taskData.title,
      description: taskData.description,
      priority: taskData.priority,
      labels: ['sample']
    });
    sampleTasks.push(task);
    list.taskOrder.push(task._id);
  }
  
  await list.save();
  createdLists.push(list);
  board.listOrder.push(list._id);
}

await board.save();

// Return board with created lists
res.status(201).json({ board, lists: createdLists });
});


router.get('/:id', async (req,res) => {
const board = await Board.findOne({ _id: req.params.id, owner: req.userId });
if (!board) return res.status(404).json({ message: 'Not found' });
const lists = await TaskList.find({ board: board._id }).sort({ createdAt: 1 });
const tasks = await Task.find({ board: board._id });
res.json({ board, lists, tasks });
});


router.patch('/:id', async (req,res) => {
const { title, listOrder } = req.body;
const board = await Board.findOneAndUpdate(
{ _id: req.params.id, owner: req.userId },
{ ...(title !== undefined && { title }), ...(listOrder !== undefined && { listOrder }) },
{ new: true }
);
if (!board) return res.status(404).json({ message: 'Not found' });
res.json(board);
});

// DELETE /boards/:id
router.delete('/:id', async (req,res) => {
const board = await Board.findOne({ _id: req.params.id, owner: req.userId });
if (!board) return res.status(404).json({ message: 'Not found' });
await Task.deleteMany({ board: board._id });
await TaskList.deleteMany({ board: board._id });
await Board.deleteOne({ _id: board._id });
res.status(204).end();
});

// POST /boards/:id/lists
router.post('/:id/lists', async (req,res) => {
const board = await Board.findOne({ _id: req.params.id, owner: req.userId });
if (!board) return res.status(404).json({ message: 'Board not found' });
const list = await TaskList.create({ board: board._id, title: req.body.title, taskOrder: [] });
board.listOrder.push(list._id);
await board.save();
res.status(201).json(list);
});


module.exports = router;