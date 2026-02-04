"use client"

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export type Doctor = {
    id: string
    avatar: string
    fullName: string
    email: string
    revenue: number
    status: "active" | "inactive" | "pending"


};


export const columns: ColumnDef<Doctor>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                checked={row.getIsSelected()}
            />
        ),
    },
    {
        accessorKey: "avatar",
        header: "Avatar",
        cell: ({ row }) => {
            const doctor = row.original;
            return (
                <div className="w-8 h-8 relative">
                    <Image src={doctor.avatar} alt={doctor.fullName} fill className="rounded-full object-cover" />
                </div>
            )   // to get the data
        }
    },
    
    {
        accessorKey: "fullName",
        header: "Name",
    },
    {
        accessorKey: "email",
        header: ({ column }) => {
            
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="hidden md:flex" 
                    
                >
                    Email
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="hidden md:block"> {/* Wrap cell content */}
                {row.getValue("email")}
            </div>
        )
    },


    {
        accessorKey: "revenue",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="hidden md:flex" 
            >
                Revenue
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <div className="hidden md:block"> {/* Wrap cell content */}
                {row.getValue("revenue")}
            </div>
        ),
      
    },

    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = String(row.getValue("status")).toLowerCase()

            return (
                <div
                    className={cn(
                        "px-2 py-2 rounded-md w-max text-xs capitalize font-medium",
                        status === "active" && "bg-green-500/20 text-green-700",
                        status === "inactive" && "bg-red-500/20 text-red-700",
                        status === "pending" && "bg-orange-500/20 text-orange-700"
                    )}
                >
                    {status}
                </div>
            )
        },
    },



    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const doctor = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(doctor.id.toString())}
                        >
                            Copy Doctor ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <Link href={`/doctors/${doctor.id}`}>View Doctor</Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },

]
