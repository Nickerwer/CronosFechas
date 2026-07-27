// js/supabaseClient.js

// Sustituye con las credenciales de tu proyecto Supabase
const SUPABASE_URL = 'https://ynyhmahabdltukyznasa.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlueWhtYWhhYmRsdHVreXpuYXNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxNzE3NTAsImV4cCI6MjEwMDc0Nzc1MH0.bVdNy0Dq-jA26yvIR5Mbth3HBNC2cdOCZHlNOuuiMX0';

// Inicializamos el cliente global desde el CDN
export const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);