import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient(){
    const cookieStore = await cookies();
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        {
            cookies: {
                getAll(){
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet){
                    try{
                        cookiesToSet.forEach(({name, value, options}) => cookieStore.set(name,value,options))
                    }catch{
                        // why can we ignore, what exactly is needed in middleware to ignore the error part?
                        // ERROR tab throw hoga jab server side se mein set cookies krdunga, 
                        // however yahan mein safely ignore krsakta hun kyunke is chiz ki handling middleware already dekhne wala hai
                    }
                },
            },

        }
        
    )
}