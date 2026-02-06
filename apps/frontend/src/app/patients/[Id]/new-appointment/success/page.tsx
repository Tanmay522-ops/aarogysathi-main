
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Button } from '../../../../../../components/ui/button';

const Success = ({
    params,
}: {
    params: { userId: string };

}) => {
    const { userId } = params;
    return (
        <div className='flex h-screen max-h-screen px-[5%]'>
            <div className='m-auto flex flex-1 flex-col items-center justify-between gap-10 py-10'>
                <Link href="/">
                    <Image
                        src="/assets/icons/logo-lotus.svg"
                        alt="patient"
                        width={1000}
                        height={1000}
                        className="mb-12 h-17 w-fit"
                    />
                </Link>

                <section className="flex flex-col items-center">
                    <Image
                        src="/assets/gifs/success.gif"
                        height={300}
                        width={280}
                        alt="success"
                    />
                    <h2 className="text-32-bold md:text-36-bold mb-6 max-w-[600px] text-center">
                        Your <span className="text-green-500">appointment request</span> has
                        been successfully submitted!
                    </h2>
                    <p>We will be in touch shortly to confirm.</p>
                </section>

                <section className="flex w-full flex-col items-center gap-8 border-y-2 border-dark-400 py-8 md:w-fit md:flex-row">
                    <p>Requested appointment details: </p>
                    <div className="flex items-center gap-3">
                        {/* <Image
                          src={doctor?.image!}
                          alt="doctor"
                          width={100}
                          height={100}
                          className="size-6"
                      />
                      <p className="whitespace-nowrap">Dr. {doctor?.name}</p> */}
                    </div>
                    <div className="flex gap-2">
                        <Image
                            src="/assets/icons/calendar.svg"
                            height={24}
                            width={24}
                            alt="calendar"
                        />
                        {/* <p> {formatDateTime(appointment.schedule).dateTime}</p> */}
                    </div>
                </section>

                <Button variant="outline" className="bg-green-500 text-white" asChild>
                    <Link href={`/patients/${userId}/new-appointment`}>
                        New Appointment
                    </Link>
                </Button>

                <p className="copyright">© 2026 aarogyaSathi</p>
            </div>

        </div>
    )
}

export default Success
