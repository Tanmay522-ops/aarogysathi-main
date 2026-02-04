
import Image from "next/image"
import Link from "next/link"
import PatientForm from "../components/PatientForm"




const Homepage = () => {
  return (
    <div className="flex h-screen max-h-screen">
      {/* Left  */}
      <section className="relative flex-1 overflow-y-auto px-[5%]  remove-scrollbar">
        <div className="mx-auto flex size-full flex-col py-10 max-w-[496px] ">
          {/* Logo */}
        
            <Image
              src="/assets/icons/logo-lotus.svg"
              alt="patient"
              width={1000}
              height={1000}
            className="mb-12 h-17 w-fit"
            />


          {/* Patient Form */}
          <PatientForm />

          {/* Fotter */}
          <div className="text-[14px] leading-[18px] font-normal mt-5 flex justify-between">
            <p className="justify-items-end text-dark-600 xl:text-left">
              © 2026 aarogyaSathi
            </p>
            <Link href="/?admin=true" className="text-green-500 hover:text-green-600">
              Admin
            </Link>
          </div>
        </div>
      </section>

      {/* Right  */}
      <Image
        src="/assets/images/onshiverring-img.webp"
        height={1000}
        width={1000}
        alt="patient"
        className="hidden h-full object-cover lg:block max-w-[50%]"
      />
    </div>
  )
}

export default Homepage