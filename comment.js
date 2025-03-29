// Create web server
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const mongoose = require('mongoose');
const Comment = require('./models/comment');

// Connect to MongoDB using mongoose
mongoose.connect('mongodb://localhost:27017/commentsDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB using mongoose');
}).catch((err) => {
  console.error('Error connecting to MongoDB using mongoose:', err);
});
const { MongoClient } = require('mongodb');
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const dbName = 'commentsDB';
const dbUrl = 'mongodb://localhost:27017/commentsDB';
const dbOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
// Connect to MongoDB
client.connect((err) => {
  if (err) {
    console.error('Error connecting to MongoDB:', err);
    return;
  }
  console.log('Connected to MongoDB');
});
// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Serve static files from the public directory
app.use(express.static('public'));
// Serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});
// Get all comments
app.get('/comments', async (req, res) => {
  try {
    const comments = await Comment.find();
    res.json(comments);
  } catch (err) {
    console.error('Error fetching comments:', err);
    res.status(500).send('Error fetching comments');
  }
});
// Add a comment
app.post('/comments', async (req, res) => {
  const { name, comment } = req.body;
  const newComment = new Comment({ name, comment });
  try {
    await newComment.save();
    res.status(201).json(newComment);
  } catch (err) {
    console.error('Error saving comment:', err);
    res.status(500).send('Error saving comment');
  }
});
// Delete a comment
app.delete('/comments/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Comment.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).send('Comment not found');
    }
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting comment:', err);
    res.status(500).send('Error deleting comment');
  }
});
// Update a comment
app.put('/comments/:id', async (req, res) => {
  const { id } = req.params;
  const { name, comment } = req.body;
  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      id,
      { name, comment },
      { new: true }
    );
    if (!updatedComment) {
      return res.status(404).send('Comment not found');
    }
    res.json(updatedComment);
  } catch (err) {
    console.error('Error updating comment:', err);
    res.status(500).send('Error updating comment');
  }
});
// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});