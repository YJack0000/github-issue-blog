import { useState } from "react"
import dynamic from "next/dynamic"
import { cn } from "@/lib/utils"
import "./MultiSelect.css"

// ensure react-select is not server rendered, prevent hydration warning
const CreatableSelect = dynamic(() => import("react-select/creatable"), {
    ssr: false,
})

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
    onCreate: (newValue: string) => Promise<void>
}

export default function MultiSelect({
    className,
    defaultValue,
    options,
    disabled,
    placeholder,
    onChange,
    onCreate,
}: MultiSelectProps) {
    const handleChange = (newValue: unknown) => {
        onChange(newValue as SelectOption[])
    }
    const [loading, setLoading] = useState(false)
    const handleCreate = async (newValue: string) => {
        setLoading(true)
        try {
            await onCreate(newValue)
        } catch (e: any) {
            throw e
        } finally {
            setLoading(false)
        }
    }
    return (
        <CreatableSelect
            isMulti
            isLoading={loading}
            className={cn("w-full my-react-select-container", className)}
            classNamePrefix="my-react-select"
            defaultValue={defaultValue}
            options={options}
            onChange={handleChange}
            isDisabled={disabled}
            placeholder={placeholder}
            onCreateOption={handleCreate}
        ></CreatableSelect>
    )
}
