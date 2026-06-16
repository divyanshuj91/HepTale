'use client'

import { useState, useTransition } from 'react'
import { signup } from '@/app/auth-actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Film } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export default function SignupPage() {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSuccess(null)
    const formData = new FormData(event.currentTarget)

    startTransition(async () => {
      const result = await signup(formData)
      if (result?.error) {
        setError(result.error)
        toast.error(result.error)
      } else if (result?.success) {
        setSuccess(result.success)
        toast.success(result.success)
      } else {
        toast.success('Successfully registered!')
      }
    })
  }

  return (
    <div className="container relative flex min-h-[85vh] flex-col items-center justify-center px-4 py-8">
      {/* Background Decorative Glow */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center opacity-30 blur-[100px]">
        <div className="h-[300px] w-[300px] rounded-full bg-emerald-500/20" />
        <div className="h-[250px] w-[250px] rounded-full bg-rose-500/15" />
      </div>

      <Card className="w-full max-w-md border-zinc-800 bg-zinc-950/60 backdrop-blur-xl text-zinc-100 shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-yellow-400 text-zinc-950">
              <Film className="h-6 w-6" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Create your account</CardTitle>
          <CardDescription className="text-zinc-400">
            Join the OMDb community and start sharing reviews
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-lg bg-rose-500/10 p-3 text-sm text-rose-400 border border-rose-500/20">
                {error}
              </div>
            )}
            
            {success && (
              <div className="rounded-lg bg-emerald-500/10 p-3 text-sm text-emerald-400 border border-emerald-500/20">
                {success}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-zinc-300">Username</Label>
                <Input
                  id="username"
                  name="username"
                  placeholder="cinephile99"
                  required
                  className="border-zinc-800 bg-zinc-900/50 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-emerald-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-zinc-300">Display Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="John Doe"
                  required
                  className="border-zinc-800 bg-zinc-900/50 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-emerald-500"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-300">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                className="border-zinc-800 bg-zinc-900/50 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-emerald-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-zinc-300">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                className="border-zinc-800 bg-zinc-900/50 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-emerald-500"
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-gradient-to-r from-emerald-500 to-yellow-400 font-bold text-zinc-950 transition-transform hover:scale-[1.01] hover:from-emerald-400 hover:to-yellow-300 disabled:opacity-50"
            >
              {isPending ? 'Registering...' : 'Sign Up'}
            </Button>
            
            <p className="text-center text-xs text-zinc-400">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-emerald-400 hover:underline">
                Log in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
