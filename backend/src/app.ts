import 'dotenv/config'
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());

app.get('/product', (req, res) => {
  res.send({'Hello, World!': true});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});