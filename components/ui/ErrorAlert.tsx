import { cn } from "@/lib/utils"

export default function ErrorAlert({
    className,
    message,
    isVisible,
}: {
        className?: string | undefined
    message: string | undefined
    isVisible: boolean
}) {
    return (
        <div
            role="alert"
            className={cn(
                "alert alert-error w-auto fixed right-4 bottom-4 transition-opacity duration-500",
                className
            )}
            style={{ opacity: isVisible ? 1 : 0 }}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
            </svg>
            <span>{message}</span>
        </div>
    )
}
