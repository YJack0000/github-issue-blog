"use client"

import { useState } from "react"
import MDEditor from "@uiw/react-md-editor"
import rehypeSanitize from "rehype-sanitize"
import MultiSelect from "@/components/ui/MultiSelect"
import ErrorAlert from "@/components/ui/ErrorAlert"

export interface PostFormProps {
    header: string
    formData?: {
        id?: string
        title: string
        tags: string[]
        description: string
        body: string
    }
    formAction?: (form: PostFormState) => Promise<void>
}

export type PostFormState = {
    id: string | undefined
    title: string
    tags: string[]
    description: string
    body: string
}

export default function PostForm({
    header,
    formData,
    formAction,
}: PostFormProps) {
    const [form, setForm] = useState<PostFormState>({
        id: formData ? formData.id : undefined,
        title: formData ? formData.title : "",
        tags: formData ? formData.tags : [],
        description: formData ? formData.description : "",
        body: formData ? formData.body : "",
    })
    const [errorMessage, setErrorMessage] = useState<string | undefined>(
        undefined
    )

    const updateForm = (name: string, value: string | string[]) => {
        setForm((prevState: any) => ({
            ...prevState,
            [name]: value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        console.log("handleSubmit", form)
        try {
            if (formAction) await formAction(form)
        } catch (e: any) {
            setErrorMessage(e.message)
            setTimeout(() => {
                // hide error message after 5 seconds
                setErrorMessage(undefined)
            }, 5000)
        }
    }

    const defaultTags = form.tags.map((t) => ({ value: t, label: t }))
    return (
        <>
            <div className="">
                <button
                    className="btn btn-primary w-100"
                    onClick={() =>
                        (
                            document.getElementById("post_form") as any
                        ).showModal()
                    }
                >
                    {header}
                </button>
            </div>
            <dialog id="post_form" className="modal">
                <div className="modal-box w-11/12 modal-middle max-w-5xl">
                    <h2 className="font-bold text-lg my-4">
                        {header} #{form.id}
                    </h2>
                    <form
                        onSubmit={(e) => handleSubmit(e)}
                        className="form-control w-full [&>*]:mb-2"
                    >
                        <input
                            type="text"
                            placeholder="文章標題"
                            value={form.title}
                            className="input input-bordered w-full"
                            onChange={(e) =>
                                updateForm("title", e.target.value)
                            }
                        />
                        <MultiSelect
                            defaultValue={defaultTags}
                            options={[
                                { value: "test", label: "test" },
                                { value: "tt", label: "tt" },
                            ]}
                            onChange={(selected: any) =>
                                updateForm(
                                    "tags",
                                    selected.map((s: any) => s.value)
                                )
                            }
                        ></MultiSelect>
                        <textarea
                            placeholder="文章描述"
                            value={form.description}
                            className="textarea textarea-bordered w-full"
                            onChange={(e) =>
                                updateForm("description", e.target.value)
                            }
                        />
                        <MDEditor
                            className="min-h-[40vh]"
                            value={form.body}
                            onChange={(val: any) => updateForm("body", val)}
                            previewOptions={{
                                rehypePlugins: [[rehypeSanitize]], // prevent xss
                            }}
                        />
                        <button type="submit" className="btn btn-primary">
                            送出
                        </button>
                    </form>
                </div>

                <ErrorAlert message={errorMessage} isVisible={!!errorMessage} />
                <form method="dialog" className="modal-backdrop">
                    <button>關閉</button>
                </form>
            </dialog>
        </>
    )
}
