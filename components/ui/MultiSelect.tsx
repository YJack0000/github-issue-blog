import dynamic from "next/dynamic"
import { cn } from "@/lib/utils"
import "./MultiSelect.css"

// ensure react-select is not server rendered, prevent hydration warning
const Select = dynamic(() => import("react-select"), { ssr: false })

export type SelectOption = {
    value: string
    label: string
}

export interface MultiSelectProps {
    className?: string
    defaultValue?: SelectOption[]
    options: SelectOption[]
    disabled?: boolean
    placeholder?: string
    onChange: (selected: SelectOption[]) => void
}

export default function MultiSelect({
    className,
    defaultValue,
    options,
    disabled,
    placeholder,
    onChange,
}: MultiSelectProps) {
    const handleChange = (newValue: unknown) => {
        onChange(newValue as SelectOption[])
    }
    return (
        <Select
            isMulti
            className={cn("w-full my-react-select-container", className)}
   classNamePrefix = "my-react-select"
            defaultValue = { defaultValue }
            options = { options }
            onChange = { handleChange }
            isDisabled = { disabled }
            placeholder = { placeholder }
                ></Select >
    )
            }
