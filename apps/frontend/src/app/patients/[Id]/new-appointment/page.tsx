import AppointmentForm from "@/components/AppointmentForm";
import Image from "next/image";

const NewAppointment = async ({
  params,
}: {
  params: { userId: string };
}) => {

  const { userId } = params;

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
