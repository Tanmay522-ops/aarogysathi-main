"use client"
import RegisterForm from '@/components/RegisterForm'
import { useUser } from '@clerk/nextjs';
import Image from 'next/image'
import { useEffect } from 'react';


const Registerpage = () => {
    const { user, isLoaded } = useUser();


    useEffect(() => {
        if (isLoaded && user) {
            user.reload(); // ✅ force fetch latest metadata
        }
    }, [isLoaded, user]);

    if (!isLoaded) {
        return (
            <div className="flex h-screen items-center justify-center bg-black text-white">
                Loading your profile...
            </div>
        );
    }


    return (
        <div className="flex h-screen max-h-screen">
            {/* Left  */}
            <section className=" remove-scrollbar relative flex-1 overflow-y-auto px-[5%]">
                <div className="mx-auto flex size-full flex-col py-10 max-w-[860px] flex-1 flex-col py-10">
                    {/* Logo */}
                    <Image
                        src="/assets/icons/logo-lotus.svg"
                        alt="patient"
                        width={1000}
                        height={1000}
                        className="mb-12 h-17 w-fit"
                    />

                    {/* Register Form */}
                    <RegisterForm user={{
                        name: user?.fullName || "",
                        email: user?.primaryEmailAddress?.emailAddress || "",
                        userId: user?.id!,
                        abhaId: (user?.unsafeMetadata?.abhaId as string) || ""


                    }} />

                    <p className="text-14-regular justify-items-end text-center text-dark-600 xl:text-left py-12">© 2026 aarogyaSathi</p>

                </div>
            </section>

            {/* Right */}
            <Image
                src="/assets/images/register-img.png"
                height={1000}
                width={1000}
                alt="patient"
                className="hidden h-full object-cover md:block max-w-[390px]"
            />
        </div>
    )
}

export default Registerpage
