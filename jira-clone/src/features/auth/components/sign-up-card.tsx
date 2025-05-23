"use client";

import React from 'react'
import { useForm } from 'react-hook-form'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGoogle } from '@fortawesome/free-brands-svg-icons/faGoogle'
import { faGithub } from '@fortawesome/free-brands-svg-icons/faGithub'

import { DottedSeparator } from '@/components/dotted-separator'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signUpFormSchema } from '@/features/auth/schemas'
import { useSignUpMutation } from '@/lib/tanstack-query/mutations/auth'




function SignUpCard() {
    const signUpForm = useForm<z.infer<typeof signUpFormSchema>>({
        defaultValues: {
            email: '',
            password: '',
            name: '',
        },
        resolver: zodResolver(signUpFormSchema),
    });

    const signUpMutation = useSignUpMutation();
    
  return (
    <Card className='w-full h-full md:w-[487px] border-none shadow-none'>
        <CardHeader className='flex items-center justify-center text-center p-7'>
            <CardTitle className='text-2xl'>
                Sign Up
            </CardTitle>
            <CardDescription>
                By signing up, you agree to our
                <Link href={"/privacy"}> <span className='text-blue-700'>Privacy policy</span> </Link>
                {" "}and{" "}
                <Link href={"/terms"}> <span className='text-blue-700'>Terms of service</span> </Link>
            </CardDescription>
        </CardHeader>
        <div className='px-7'>
            <DottedSeparator />
        </div>
        <CardContent className='p-7'>
            <Form {...signUpForm}>

            <form className='space-y-4' onSubmit={signUpForm.handleSubmit((data) => signUpMutation.mutate(data))}>
                <FormField name="email" control={signUpForm.control} render={({ field }) => (
                    <FormItem>

                    <FormControl>
                    <Input {...field} type='email' placeholder='Enter Email Address' />

                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}  />
                <FormField name="password" control={signUpForm.control} render={({ field }) => (
                    <FormItem>

                    <FormControl>
                    <Input {...field} type='password' placeholder='Enter Password' />

                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}  />
                <FormField name="name" control={signUpForm.control} render={({ field }) => (
                    <FormItem>

                    <FormControl>
                    <Input {...field} type='text' placeholder='Enter your name' />

                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}  />
                <Button className='w-full' variant='primary' type='submit'>
                    Sign Up
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
                    Already have an account?
                    <Link href={"/sign-in"}> <span className='text-blue-700'> Sign In</span> </Link>
                </p>
            </CardContent>
    </Card>
  )
}

export { SignUpCard }
