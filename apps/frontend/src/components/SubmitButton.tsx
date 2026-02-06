import Image from "next/image";
import React from "react";
import { Button } from "../../components/ui/button";

interface ButtonProps {
    isLoading: boolean;
    className?: string;
    disabled?: boolean;
    children: React.ReactNode;
    onClick?: (e?: React.BaseSyntheticEvent) => void;
    type?: "button" | "submit";
}

const SubmitButton = ({
    isLoading,
    className,
    children,
    onClick,
    type = "submit", 
}: ButtonProps) => {
    return (
        <Button
            type={type}
            disabled={isLoading}
            onClick={onClick}
            className={className ?? "bg-green-500 text-white w-full"}
        >
            {isLoading ? (
                <div className="flex items-center gap-4">
                    <Image
                        src="/assets/icons/loader.svg"
                        alt="loader"
                        width={24}
                        height={24}
                        className="animate-spin"
                    />
                    Loading...
                </div>
            ) : (
                children
            )}
        </Button>
    );
};

export default SubmitButton;