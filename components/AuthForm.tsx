/**
 * AuthForm Component
 * 
 * Client-side component that handles user authentication (sign-in and sign-up)
 * Uses React Hook Form with Zod validation and Firebase Authentication
 */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form
} from "@/components/ui/form";

import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import FormField from "./FormField";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/client";
import { signUp, signIn } from "@/lib/actions/auth.action";


/**
 * Dynamic schema generator for authentication forms
 * @param type - Form type ('sign-up' or 'sign-in')
 * @returns Zod schema with appropriate validation rules
 */
const authFormSchema = (type: FormType) => {
    return z.object({
      name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
      email: z.string().email(),
      password: z.string().min(3),
    })
}

/**
 * Authentication form component that handles both sign-in and sign-up
 * @param type - Determines whether the form is for sign-in or sign-up
 */
const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
  
  const formSchema = authFormSchema(type);
  
  // Initialize form with React Hook Form and Zod validation
  const form = useForm<z.infer<typeof formSchema>>({  
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  /**
   * Form submission handler that processes authentication
   * For sign-up: Creates Firebase account and stores user data
   * For sign-in: Authenticates with Firebase and creates session
   */
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try{
      if(type === "sign-up"){
        const {name, email, password} = values;
        const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
        const result = await signUp({
          uid: userCredentials.user.uid,
          name: name!,
          email,
          password,
        })

        if(!result?.success){
          toast.error(result?.message);
          return
        }
        toast.success('Account created successfully. Please sign in.');
        router.push('/sign-in');
        console.log('SIGN UP', values)
      } else {
        const {email, password } = values;
        const userCredential = await signInWithEmailAndPassword(auth, email, password);

        const idToken = await userCredential.user.getIdToken();

        if(!idToken){
          toast.error('Sign in failed');
          return;
        }

        await signIn({
          email, idToken
        })

        toast.success('Sign in successfully.');
        router.push('/');
        console.log('SIGN IN', values)
      }
    } catch(error) {
      console.log(error)
      toast.error(`There was an error: ${error}`);
    }
  }

  const isSignIn = type === "sign-in";

  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image src="/logo.svg" alt="logo" height={32} width={38} />
          <h2 className="text-primary-100">PrepWise</h2>
        </div>

        <h3 className="text-center text-primary-100">Practice job interviews with AI</h3>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mt-4 form">
            {!isSignIn && (
              <FormField
                control={form.control}
                name="name"
                label="Name"
                placeholder="Your Name"
              />
            )}
            
            <FormField 
              control={form.control}
              name="email"
              label="Email"
              placeholder="Your email address"
              type="email"
            />
            
            <FormField 
              control={form.control}
              name="password"
              label="Password"
              placeholder="Enter your password"
              type="password"
            />
            
            <Button className="btn" type="submit">
              {isSignIn ? "Sign in" : "Create an Account"}
            </Button>
          </form>
        </Form>

        <p className="text-center text-primary-100">
          {isSignIn
            ? "Don't have an account?"
            : "Already have an account?"}
          <Link href={isSignIn ? "/sign-up" : "/sign-in"} className="font-bold text-user-primary ml-1">
            {isSignIn ? "Sign up" : "Sign in"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
