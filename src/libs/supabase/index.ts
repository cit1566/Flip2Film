import { cookies } from 'next/headers'
import { createClient } from './server'

const cookieStore = await cookies()
const supabase = createClient(cookieStore)

export default supabase
