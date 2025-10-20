"use client";

import { AuthForm, signInSchema, signInWithCredentials } from "@/features/auth";

export default function SignIn() {
   async function handleSubmit(data: { email: string; password: string }) {
      const result = await signInWithCredentials(data);
      return { success: result.success, error: result.error };
   }
   return (
      <div>
         <AuthForm
            type="SIGN_IN"
            schema={signInSchema}
            defaultValues={{
               email: "",
               password: "",
            }}
            onSubmit={handleSubmit}
         />
      </div>
   );
}
