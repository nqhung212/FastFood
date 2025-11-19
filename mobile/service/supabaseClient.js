import 'react-native-url-polyfill/auto'
import { createClient } from '@supabase/supabase-js'

// const supabaseUrl = 'https://uuxtbxkgnktfcbdevbmx.supabase.co'
// const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1eHRieGtnbmt0ZmNiZGV2Ym14Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MjY4NjcsImV4cCI6MjA3NjIwMjg2N30.GlnYAAiTLG4wJieUUt8retNEMW3MvSu7H9GeramkU74'
const supabaseUrl = 'https://bcinyelxkqefwchptvhh.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjaW55ZWx4a3FlZndjaHB0dmhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0MzE5NjIsImV4cCI6MjA3OTAwNzk2Mn0.tfkW1MMlW0rmvWyZiv0e-epsa93eA4FbI7Rx5fAVuV0'


export const supabase = createClient(supabaseUrl, supabaseKey)
