"use client";

import { AuthForm, signUpSchema, signUpWithCredentials } from "@/features/auth";

export default function SignUp() {
   return (
         <AuthForm
            type="SIGN_UP"
            schema={signUpSchema}
            defaultValues={{
               name: "",
               email: "",
               password: "",
               confirmPassword: "",
            }}
            onSubmit={async (data) => {
               const { name, email, password } = data as {
                  name: string;
                  email: string;
                  password: string;
               };
               const res = await signUpWithCredentials({ name, email, password });
               return { success: res.success, error: res.error };
            }}
         />
   );
}
