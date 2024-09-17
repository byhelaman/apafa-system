import { supabase } from "@/lib/supabase"

const { data, error } = await supabase.auth.getUser()

const { data: userInfo } = await supabase.from('partners').select('').eq('user_id', data.user?.id).single()
console.log(userInfo);

export function Dashboard() {
  return (
    <>
      board...
    </>
  )
}