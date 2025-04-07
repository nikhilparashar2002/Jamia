'use client';

import React from 'react';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardBody, Input, Button } from "@nextui-org/react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
        return;
      }

      router.push('/dashboard');
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-white p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col gap-1 items-center justify-center pt-8 pb-4">
          <h1 className="text-2xl font-bold text-foreground">Welcome Back</h1>
          <p className="text-sm text-default-500">Sign in to continue to SEO CMS</p>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="bg-danger-50 text-danger p-3 rounded-medium text-sm">
                {error}
              </div>
            )}
            
            <Input
              type="email"
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="max-w-full"
            />

            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={toggleVisibility}
                >
                  {isVisible ? (
                    <EyeSlashIcon className="w-4 h-4 text-default-400" />
                  ) : (
                    <EyeIcon className="w-4 h-4 text-default-400" />
                  )}
                </button>
              }
              type={isVisible ? "text" : "password"}
              className="max-w-full"
            />

            <Button
              type="submit"
              color="primary"
              className="w-full mt-2"
              isLoading={isLoading}
            >
              Sign In
            </Button>

            <p className="text-center text-sm text-default-500 mt-4">
              Need help? Contact your administrator
            </p>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default LoginPage;
