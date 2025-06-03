"use client";

import { useForm } from 'react-hook-form'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGoogle } from '@fortawesome/free-brands-svg-icons/faGoogle'
import { faGithub } from '@fortawesome/free-brands-svg-icons/faGithub'
import Link from 'next/link'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation';

import { useLoginMutation } from '@/lib/tanstack-query/mutations/auth'
import { SignInFormSchema } from '@/features/auth/schemas';

import { DottedSeparator } from '@/components/dotted-separator'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'

function SignInCard() {
  const router = useRouter();

  const signInForm = useForm<z.infer<typeof SignInFormSchema>>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(SignInFormSchema),
  });

  const loginMutation = useLoginMutation();

  return (
    <Card className='w-full h-full md:w-[487px] border-none shadow-none'>
      <CardHeader className='flex items-center justify-center text-center p-7'>
        <CardTitle className='text-2xl'>
          Welcome back
        </CardTitle>
      </CardHeader>
      <div className='px-7'>
        <DottedSeparator />
      </div>
      <CardContent className='p-7'>
        <Form {...signInForm}>
          <form className='space-y-4' onSubmit={signInForm.handleSubmit((data) => {
            loginMutation.mutate(data, {
              onSuccess: () => router.refresh()
            })
          })}>
            <FormField name='email' control={signInForm.control} render={({ field }) => (
              <FormItem>
                <FormControl>

                  <Input {...field} type='email' placeholder='Enter Email Address' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField name='password' control={signInForm.control} render={({ field }) => (
              <FormItem>
                <FormControl>

                  <Input type='password' {...field} placeholder='Enter Password' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <Button className='w-full' variant='primary' type='submit'>
              Sign In
            </Button>
          </form>
        </Form>
      </CardContent>
      <div className='px-7'>
        <DottedSeparator />
      </div>
      <CardContent className='p-7 flex flex-col gap-y-4'>
        <Button variant={'secondary'} size={'lg'}>
          <FontAwesomeIcon icon={faGoogle} className='mr-2' /> Sign In with Google
        </Button>
        <Button variant={'secondary'} size={'lg'}>
          <FontAwesomeIcon icon={faGithub} className='mr-2' /> Sign In with Github
        </Button>
      </CardContent>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className='p-7 flex items-center justify-center'>
        <p>
          Don&apos;t have an account?
          <Link href={"/sign-up"}> <span className='text-blue-700'>&nbsp;Sign Up</span> </Link>
        </p>
      </CardContent>
    </Card>
  )
}

export { SignInCard }
