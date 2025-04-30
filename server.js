const express = require('express');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

app.use(express.json());

app.post('/location', async (req, res) => {
  const { latitude, longitude, timestamp } = req.body;

  if (!latitude || !longitude) {
    return res.status(400).send('Missing latitude or longitude');
  }

  const { error } = await supabase.from('location').insert([
    { latitude, longitude, timestamp }
  ]);

  if (error) {
    console.error('Error inserting data:', error);
    return res.status(500).send('Failed to insert data');
  }

  res.status(200).send('Location saved');
});

// ✅ ←ここが漏れてた！
app.get('/', (req, res) => {
  res.send('TabitomoWiFi Location API is running.');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
