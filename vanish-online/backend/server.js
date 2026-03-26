require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const lotsRouter = require('./routes/lots');
const forumRouter = require('./routes/forum');
const messagesRouter = require('./routes/messages');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/lots', lotsRouter);
app.use('/api/forum', forumRouter);
app.use('/api/messages', messagesRouter);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error(err));