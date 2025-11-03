// Required polyfill for URL in React Native runtime
import 'react-native-url-polyfill/auto'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://uuxtbxkgnktfcbdevbmx.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1eHRieGtnbmt0ZmNiZGV2Ym14Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MjY4NjcsImV4cCI6MjA3NjIwMjg2N30.GlnYAAiTLG4wJieUUt8retNEMW3MvSu7H9GeramkU74'

export const supabase = createClient(supabaseUrl, supabaseKey)
