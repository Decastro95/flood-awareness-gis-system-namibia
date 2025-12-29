// import-trig-points.js
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://fohtrrqbibinhqzmuhqr.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key'; // from Supabase dashboard

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function importCSV(filePath, sourceFileName) {
  const data = fs.readFileSync(filePath, 'utf8');
  const lines = data.trim().split('\n');
  const headers = lines[0].split(',');

  const records = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    if (values.length < 3)
