import { Doctor, columns } from "./columns"
import { DataTable } from "./data-table"

const getData = async (): Promise<Doctor[]> => {
    return [
        {
        id: "doc-001",
        avatar: "/assets/images/dr-cameron.png",
        fullName: "Dr. Amit Sharma",
        email: "amit.sharma@gmail.com",
        status: "active",
        revenue: 88000,
  },
    {
        id: "doc-002",
        avatar: "/assets/images/dr-cruz.png",
        fullName: "Dr. Neha Verma",
        email: "neha.verma@gmail.com",
        status: "active",
        revenue: 57000,

    },
    {
        id: "doc-003",
        avatar: "/assets/images/dr-green.png",
        fullName: "Dr. Rajesh Khanna",
        email: "rajesh.khanna@gmail.com",
        status: "inactive",
        revenue: 120000,

    },
    {
        id: "doc-004",
        avatar: "/assets/images/dr-lee.png",
        fullName: "Dr. Pooja Mehta",
        email: "pooja.mehta@gmail.com",
        status: "active",
        revenue: 72800,

    },
    {
        id: "doc-005",
        avatar: "/assets/images/dr-livingston.png",
        fullName: "Dr. Arjun Patel",
        email: "arjun.patel@gmail.com",
        status: "pending",
        revenue: 60000,

    },
    {
        id: "doc-006",
        avatar: "/assets/images/dr-peter.png",
        fullName: "Dr. Kavita Iyer",
        email: "kavita.iyer@gmail.com",
        status: "active",
        revenue: 65000,

    },
    {
        id: "doc-007",
        avatar: "/assets/images/dr-powell.png",
        fullName: "Dr. Mohit Jain",
        email: "mohit.jain@gmail.com",
        status: "active",
        revenue: 44000,

    },
    {
        id: "doc-008",
        avatar: "/assets/images/dr-remirez.png",
        fullName: "Dr. Rina Das",
        email: "rina.das@gmail.com",
        status: "inactive",
        revenue: 91800,

    },
    {
        id: "doc-009",
        avatar: "/assets/images/dr-sharma.png",
        fullName: "Dr. Sunil Rao",
        email: "sunil.rao@gmail.com",
        status: "active",

        revenue: 80000,

    },
    {
        id: "doc-010",
        avatar: "/assets/images/avatar.png",
        fullName: "Dr. Ananya Kulkarni",
        email: "ananya.k@gmail.com",
        revenue: 105000,
        status: "active",

    },
    ]
}

const DoctorsList = async () => {
    const data = await getData()

    return (
        <div className="space-y-2">
            <div className="mb-2 rounded-md">
                <h1 className=" text-lg font-semibold">All Doctors</h1>
            </div>
            <DataTable columns={columns} data={data} />

        </div>

    )
}

export default DoctorsList
