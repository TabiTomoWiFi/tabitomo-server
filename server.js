const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Supabaseクライアントの初期化（Service Role Key を使用）
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

app.use(cors());
app.use(express.json());

// POST /location → Supabaseにデータ挿入
app.post('/location', async (req, res) => {
  const { latitude, longitude, timestamp, nationality, gender, age } = req.body;

  if (!latitude || !longitude) {
    return res.status(400).send('Missing latitude or longitude');
  }

  const { error } = await supabase.from('location').insert([
    { latitude, longitude, timestamp, nationality, gender, age }
  ]);

  if (error) {
    console.error('Error inserting data:', error);
    return res.status(500).send('Failed to insert data');
  }

  res.status(200).send('Location saved');
});

// GET / → サーバの疎通確認用
app.get('/', (req, res) => {
  res.send('TabitomoWiFi Location API is running.');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
