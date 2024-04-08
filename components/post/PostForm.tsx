"use client"

import { useEffect, useState } from "react"
import MarkdownEditor from "@/components/post/MarkdownEditor"
import MultiSelect, { SelectOption } from "@/components/ui/MultiSelect"
import ErrorAlert from "@/components/ui/ErrorAlert"
import { getTags } from "@/actions/tag"

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

    const [loading, setLoading] = useState<boolean>(false)

    const updateForm = (name: string, value: string | string[]) => {
        setForm((prevState: any) => ({
            ...prevState,
            [name]: value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            if (formAction) {
                await formAction(form)
            }
            ;(document.getElementById("post_form") as any).close()
        } catch (e: any) {
            setErrorMessage(e.message)
            setTimeout(() => {
                // hide error message after 5 seconds
                setErrorMessage(undefined)
            }, 5000)
        } finally {
            setLoading(false)
        }
    }

    const [tags, setTags] = useState<SelectOption[]>([])
    const fetchTags = async () => {
        const data = await getTags()
        setTags(
            data.map((t: any) => {
                return { value: t, label: t }
            })
        )
    }

    useEffect(() => {
        fetchTags()
    }, [])

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
                            disabled={loading}
                        />
                        <MultiSelect
                            defaultValue={defaultTags}
                            options={tags}
                            onChange={(selected: any) =>
                                updateForm(
                                    "tags",
                                    selected.map((s: any) => s.value)
                                )
                            }
                            disabled={loading}
                            placeholder="文章標籤"
                        ></MultiSelect>
                        <textarea
                            placeholder="文章描述"
                            value={form.description}
                            className="textarea textarea-bordered w-full"
                            onChange={(e) =>
                                updateForm("description", e.target.value)
                            }
                            disabled={loading}
                        />
                        <MarkdownEditor
                            className="min-h-[40vh]"
                            value={form.body}
                            onChange={(val: string | undefined) =>
                                updateForm("body", val ?? "")
                            }
                        />
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {!loading ? (
                                "送出"
                            ) : (
                                <span className="loading loading-spinner loading-md"></span>
                            )}
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
