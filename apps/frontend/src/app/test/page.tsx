import { auth } from "@clerk/nextjs/server";


const TestPage = async () => {
  const { getToken } = await auth();
  const token = await getToken();


  // verification of token in auth services = auth service is autheticated
  const resAuth = await fetch("http://localhost:8000/test", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const dataAuth = await resAuth.json();
  console.log(dataAuth);

  // verification of token in appointment services = appoitnment service is autheticated
  const resAppointment = await fetch("http://localhost:8001/test", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const dataAppointment = await resAppointment.json();
  console.log(dataAppointment);


  const resPayment = await fetch("http://localhost:8002/test", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const dataPayment = await resPayment.json();
  console.log(dataPayment);

  return <div className="">TestPage</div>;
};

export default TestPage;