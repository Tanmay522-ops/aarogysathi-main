"use client"

import { Search } from "lucide-react"
import { Input } from "./ui/input"
import { useEffect, useRef, useState } from "react"

const SearchBar = () => {
    const [searchValue, setSearchValue] = useState("")
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                inputRef.current?.focus()
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value)
        // Add your search logic here
        console.log("Searching for:", e.target.value)
    }

    return (
        <div className=" hidden md:block relative w-full ">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
                ref={inputRef}
                type="text"
                placeholder="Search anything"
                value={searchValue}
                onChange={handleSearch}
                className="pl-10 pr-16 h-9 rounded-lg border-input bg-background"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none inline-flex h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">⌘</span>K
            </kbd>
        </div>
    )
}

export default SearchBar