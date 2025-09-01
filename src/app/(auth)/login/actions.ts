"use server"
import { createClient } from "@/utils/supabase/server";
// we using the lib/auth-actions instead, as it has google wagera bhi
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


export async function login(formdata: FormData){
    const supabase = await createClient();
    const data = {
        email: formdata.get('email') as string,
        password: formdata.get('password') as string
    }
    const {error} = await supabase.auth.signInWithPassword(data);
    if(error){
        redirect("/error")
    }
    revalidatePath("/","layout") // what is this
    redirect("/")
}   


export async function signup(formdata: FormData) {
  const supabase = await createClient();
  const data = {
    email: formdata.get("email") as string,
    password: formdata.get("password") as string,
  };
  const { error } = await supabase.auth.signUp(data);
  if (error) {
    redirect("/error");
  }
  revalidatePath("/", "layout"); // what is this reload this page '/'
  redirect("/");
}   
