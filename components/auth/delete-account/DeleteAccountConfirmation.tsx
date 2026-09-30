"use client";
//import useDeleteAccountConfirmationStore from '@/stores/useDeleteAccountConfirmationStore'
import React, { useEffect, useState } from 'react'
//import DeleteConfirmationCancelIcon from './DeleteAccountConfirmationCancelIcon';
//import FormField from '@/components/ui/form/formField';
//import Button from '@/components/ui/general/button';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import type { DeleteAccountConfirmationFields } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import deleteAccountConfirmationSchema from '@/schemas/deleteAccountConfirmationSchema';
import { useMutation } from '@tanstack/react-query';
import { deleteUser } from '@/actions/userActions';
import Message from '@/components/ui/custom/message';
import { useUser } from '@clerk/nextjs';
import { useDeleteAccountConfirmationContext } from '@/contexts/DeleteAccountConfirmationContext';
import { Input } from '@/components/ui/input';
import Alignment from '@/components/ui/custom/alignment';
const DeleteAccountConfirmation = () => {
    const [confirmed, setConfirmed] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');

    const { enabled, setEnabled } = useDeleteAccountConfirmationContext();
    // const enabled = useDeleteAccountConfirmationStore((state) => state.enabled);
    // const setEnabled = useDeleteAccountConfirmationStore((state) => state.setEnabled);

    //const { data: session, status } = useSession();
    const { user } = useUser();
    const email: string = user?.primaryEmailAddress?.emailAddress || ""

    const { handleSubmit, register, reset, watch, formState: { errors } } = useForm<DeleteAccountConfirmationFields>({
        resolver: zodResolver(deleteAccountConfirmationSchema)
    });

    const confirmationEmail: string = watch("email");

    const { mutate, isPending, isError, isSuccess } = useMutation({
        mutationKey: ["deleteAccount"],
        mutationFn: (data: DeleteAccountConfirmationFields) => deleteUser(data),
        onSuccess: () => {
            setMessage("Success");
            setEnabled(false);
            reset();
            window.location.href = "/"

        },
        onError: (e: Error) => {
            setMessage(e.message)
        }
    });

    const onSubmit = async (data: DeleteAccountConfirmationFields) => {
        console.log("DELETE ACCOUNT BUTTON CLICKED!");
        await mutate({
            email: data.email
        });
    }

    useEffect(() => {
        if (!email) {
            setConfirmed(false);
            return;
        }

        setConfirmed(confirmationEmail === email);
    }, [confirmationEmail]);

    if (!enabled) return (<div></div>)
    return (
        <div className='w-full h-full fixed bg-brand-background/80 z-20 flex items-center justify-center'>
            <div className='border-[1.5px] border-brand-border rounded-lg w-xl min-h-150 p-6
            flex flex-col gap-4'>
                <div className='text-brand-white text-[clamp(1.3rem,4vw,2.5rem)] font-bold'>
                    Are you sure you?
                </div>

                <form className='flex items-center flex-col gap-5' onSubmit={handleSubmit(onSubmit)}>
                    <Input
                        placeholder='Confirm Email'
                        {...register("email")}
                    />
                    {errors.email && <Message content={errors.email?.message} variant='error' />}

                    {confirmed && <div className='text-yellow-500 text-center'>
                        This action cannot be undone! Your account would be permanantely deleted! Proceed with caution!
                    </div>}
                    <Alignment className='w-full' variant='colCenter'>
                        <Message content={message} disableOnContent='md'
                            variant={isError ? "error" : "success"} />
                    </Alignment>
                    <Alignment className='w-full gap-2' variant='rowRight'>
                        <Button className='w-32 h-10 font-bold font-roboto hover:cursor-pointer hover:scale-99
                        transition-all duration-150 border-brand-border bg-brand-white text-brand-dark p-2'
                            onClick={() => { setEnabled(false); reset() }}>
                            Cancel
                        </Button>

                        {confirmed && <Button className='text-red-500 w-32 h-10 font-bold font-roboto hover:cursor-pointer hover:scale-99
                        transition-all duration-150 border-brand-border bg-transparent p-2'
                            type='submit'>
                            {isPending ? "Loading..." : "Delete Account"}
                        </Button>}
                    </Alignment>

                </form>


            </div>
        </div>
    )
}

export default DeleteAccountConfirmation