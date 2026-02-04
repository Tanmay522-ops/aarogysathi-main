import {  Patient, columns } from "./columns"
import { DataTable } from "./data-table"

const getData = async (): Promise<Patient[]> => {
    return [
        {
            id: "pat-001",
            avatar: "/assets/images/dr-cameron.png",
            fullName: "Rohit Singh",
            email: "rohit.singh@gmail.com",
            status: "active",
            lastVisit: "2026-01-28",
            appointments: 5,
        },
        {
            id: "pat-002",
            avatar: "/assets/images/dr-cruz.png",
            fullName: "Sneha Kapoor",
            email: "sneha.kapoor@gmail.com",
            status: "pending",
            lastVisit: "2026-01-20",
            appointments: 2,
        },
        {
            id: "pat-003",
            avatar: "/assets/images/dr-green.png",
            fullName: "Aditya Mehra",
            email: "aditya.mehra@gmail.com",
            status: "active",
            lastVisit: "2026-01-25",
            appointments: 3,
        },
        {
            id: "pat-004",
            avatar: "/assets/images/dr-lee.png",
            fullName: "Priya Sharma",
            email: "priya.sharma@gmail.com",
            status: "inactive",
            lastVisit: "2025-12-15",
            appointments: 1,
        },
        {
            id: "pat-005",
            avatar: "/assets/images/dr-livingston.png",
            fullName: "Karan Malhotra",
            email: "karan.malhotra@gmail.com",
            status: "active",
            lastVisit: "2026-01-30",
            appointments: 6,
        },
        {
            id: "pat-006",
            avatar: "/assets/images/dr-peter.png",
            fullName: "Anjali Desai",
            email: "anjali.desai@gmail.com",
            status: "pending",
            lastVisit: "2026-01-18",
            appointments: 2,
        },
        {
            id: "pat-007",
            avatar: "/assets/images/dr-powell.png",
            fullName: "Vikram Joshi",
            email: "vikram.joshi@gmail.com",
            status: "active",
            lastVisit: "2026-01-27",
            appointments: 4,
        },
        {
            id: "pat-008",
            avatar: "/assets/images/dr-remirez.png",
            fullName: "Rhea Nair",
            email: "rhea.nair@gmail.com",
            status: "inactive",
            lastVisit: "2025-12-22",
            appointments: 1,
        },
        {
            id: "pat-009",
            avatar: "/assets/images/dr-sharma.png",
            fullName: "Sameer Kapoor",
            email: "sameer.kapoor@gmail.com",
            status: "active",
            lastVisit: "2026-01-29",
            appointments: 5,
        },
        {
            id: "pat-010",
            avatar: "/assets/images/avatar.png",
            fullName: "Isha Verma",
            email: "isha.verma@gmail.com",
            status: "active",
            lastVisit: "2026-01-31",
            appointments: 7,
        },
    ]
}

const PatientList = async () => {
    const data = await getData()

    return (
        <div>
            <div className="mb-2 rounded-md">
                <h1 className=" text-lg font-semibold">All Patient</h1>
            </div>
            <DataTable columns={columns} data={data} />

        </div>

    )
}

export default PatientList
