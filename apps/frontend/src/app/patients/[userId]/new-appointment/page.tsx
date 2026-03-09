import AppointmentForm from "@/components/AppointmentForm";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";


async function getCurrentPatient() {
  const { getToken } = await auth();
  const token = await getToken();


  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/patients/me`, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });


  if (!response.ok) {
    const errorText = await response.text();
    console.error("❌ Error response:", errorText);
    return null;
  }

  const data = await response.json();
  console.log("✅ Patient data:", data);
  return data.patient;
}


const NewAppointment = async ({
  params,
}: {
  params: Promise<{ userId: string }>;
}) => {
  
  const { userId } = await params; 

  const patient = await getCurrentPatient();


  if (!patient) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">
            Patient Not Found
          </h1>
          <p className="text-gray-600">
            Unable to load patient information. Please try again.
          </p>
        </div>
      </div>
    );
  }

  

  return (
    <div className="flex h-screen max-h-screen">
      {/* Left */}
      <section className="relative flex-1 overflow-y-auto px-[5%]  remove-scrollbar">
        <div className="mx-auto flex size-full flex-col py-10 max-w-[860px] flex-1 justify-between">
          {/* Logo */}
          <Image
            src="/assets/icons/logo-lotus.svg"
            alt="patient"
            width={1000}
            height={1000}
            className="mb-12 h-17 w-fit"
          />

          {/* Appointment Form */}
          <AppointmentForm
            type="create"
            userId={userId}
            patientId={patient.id}
          />

          {/* Footer */}
          <p className="text-14-regular justify-items-end text-center text-dark-600 xl:text-left mt-2 py-12">
            © 2026 aarogyaSathi
          </p>
        </div>
      </section>

      {/* Right */}
      <Image
        src="/assets/images/appointment-img.png"
        height={1000}
        width={1000}
        alt="appointment"
        className="hidden h-full object-cover lg:block max-w-[390px] bg-bottom"
      />
    </div>
  );
};

export default NewAppointment;
