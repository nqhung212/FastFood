// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

// Supabase config - replace with your project values or use env
const supabaseUrl = 'https://bcinyelxkqefwchptvhh.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjaW55ZWx4a3FlZndjaHB0dmhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0MzE5NjIsImV4cCI6MjA3OTAwNzk2Mn0.tfkW1MMlW0rmvWyZiv0e-epsa93eA4FbI7Rx5fAVuV0'


export const supabase = createClient(supabaseUrl, supabaseKey)
