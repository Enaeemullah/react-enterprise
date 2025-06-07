import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useAuth } from "../../contexts/auth-context";

const signupSchema = z.object({
  orga_desc: z.string().min(10, "Organization description must be at least 10 characters"),
  orga_code: z.string().min(2, "Organization code must be at least 2 characters"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phoneNo: z.string().min(10, "Please enter a valid phone number"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

export function SignupForm() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormValues) => {
    try {
      setError(null);
      await signup({
        orga_desc: data.orga_desc,
        orga_code: data.orga_code,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNo: data.phoneNo,
        password: data.password,
      });
      setSuccess(true);
      // Redirect to login after a short delay
      setTimeout(() => {
        navigate("/auth/login");
      }, 2000);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Create an account
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Sign up to get started
        </p>
      </div>

      {error && (
        <div className="bg-error-50 dark:bg-error-900/30 border border-error-300 dark:border-error-800 text-error-700 dark:text-error-400 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-success-50 dark:bg-success-900/30 border border-success-300 dark:border-success-800 text-success-700 dark:text-success-400 px-4 py-3 rounded-md text-sm">
          Account created successfully! Redirecting to login...
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="First Name"
            placeholder="John"
            error={errors.firstName?.message}
            {...register("firstName")}
          />
          
          <Input
            label="Last Name"
            placeholder="Doe"
            error={errors.lastName?.message}
            {...register("lastName")}
          />
        </div>

        <Input
          label="Organization Code"
          placeholder="Enter organization code"
          error={errors.orga_code?.message}
          {...register("orga_code")}
        />
        
         <Input
            label="Organization Description"
            placeholder="Describe your organization"
            error={errors.orga_desc?.message}
             {...register("orga_desc")}
          /> 
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          autoComplete="email"
          {...register("email")}
        />
        
        <Input
          label="Phone Number"
          type="tel"
          placeholder="+1 (555) 123-4567"
          error={errors.phoneNo?.message}
          {...register("phoneNo")}
        />
        
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          autoComplete="new-password"
          {...register("password")}
        />
        
        <Input
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          autoComplete="new-password"
          {...register("confirmPassword")}
        />

        <Button
          type="submit"
          className="w-full"
          isLoading={isSubmitting}
        >
          Create account
        </Button>
        
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            to="/auth/login"
            className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
          >
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}