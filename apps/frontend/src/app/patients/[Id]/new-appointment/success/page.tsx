import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Button } from '../../../../../../components/ui/button';
import { auth } from '@clerk/nextjs/server';

const formatDateTime = (date: Date) => ({
    dateTime: new Intl.DateTimeFormat('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    }).format(date),
});

interface Appointment {
    id: string;
    schedule: string;
    status: string;
    reason?: string;
    note?: string;
    doctor: {
        id: string;
        name: string;
        image: string;
        specialization: string;
    };
}

async function getAppointment(appointmentId: string, token: string): Promise<Appointment | null> {
    try {
        const url = `${process.env.NEXT_PUBLIC_APPOINTMENT_API_URL}/appointments/${appointmentId}`;
        console.log("Fetching appointment:", url);

        const response = await fetch(url, {
            cache: 'no-store',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        console.log("Response status:", response.status);

        if (!response.ok) {
            const text = await response.text();
            console.log("Error body:", text);
            return null;
        }

        const data = await response.json();
        console.log("Appointment fetched:", data.appointment?.id);
        return data.appointment;
    } catch (err) {
        console.error("Fetch error:", err);
        return null;
    }
}

const Success = async ({
    params,
    searchParams,
}: {
    params: Promise<{ Id: string }>;
    searchParams: Promise<{ appointmentId?: string }>;
}) => {
    const { Id: userId } = await params;
    const { appointmentId } = await searchParams;

    const { getToken } = await auth();
    const token = await getToken();

    const appointment = appointmentId && token
        ? await getAppointment(appointmentId, token)
        : null;

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
                    <p className="whitespace-nowrap font-medium">Requested appointment details:</p>

                    {appointment ? (
                        <>
                            {/* Doctor */}
                            <div className="flex items-center gap-3">
                                <Image
                                    src={appointment.doctor?.image || '/doctors/default.png'}
                                    alt={appointment.doctor?.name}
                                    width={32}
                                    height={32}
                                    className="size-8 rounded-full object-cover border border-dark-500"
                                />
                                <p className="whitespace-nowrap font-medium">
                                    Dr. {appointment.doctor?.name}
                                </p>
                                {appointment.doctor?.specialization && (
                                    <span className="text-xs text-muted-foreground">
                                        · {appointment.doctor.specialization}
                                    </span>
                                )}
                            </div>

                            {/* Date */}
                            <div className="flex items-center gap-2">
                                <Image
                                    src="/assets/icons/calendar.svg"
                                    height={24}
                                    width={24}
                                    alt="calendar"
                                />
                                <p className="whitespace-nowrap">
                                    {formatDateTime(new Date(appointment.schedule)).dateTime}
                                </p>
                            </div>

                            {/* Status */}
                            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${appointment.status === 'PENDING'
                                    ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                                    : appointment.status === 'SCHEDULED'
                                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                        : appointment.status === 'CONFIRMED'
                                            ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                                            : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                                }`}>
                                {appointment.status}
                            </span>
                        </>
                    ) : (
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                            <Image
                                src="/assets/icons/calendar.svg"
                                height={24}
                                width={24}
                                alt="calendar"
                            />
                            <p>Appointment details unavailable</p>
                        </div>
                    )}
                </section>

                <Button variant="outline" className="bg-green-500 text-white" asChild>
                    <Link href={`/patients/${userId}/new-appointment`}>
                        New Appointment
                    </Link>
                </Button>

                <p className="copyright">© 2026 aarogyaSathi</p>
            </div>
        </div>
    );
};

export default Success;