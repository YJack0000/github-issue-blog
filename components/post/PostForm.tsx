"use client"
import { useState } from "react"
import MDEditor from "@uiw/react-md-editor"
import rehypeSanitize from "rehype-sanitize"
import MultiSelect from "@/components/ui/MultiSelect"

export interface PostFormProps {
    header: string
    title?: string
    id?: number
    tags?: string[]
    description?: string
    body?: string
}

type PostFormState = {
    id: number | undefined
    title: string | undefined
    tags: string[]
    description: string | undefined
    body: string | undefined
}

export default function PostForm({
    header,
    title,
    id,
    tags,
    description,
    body,
}: PostFormProps) {
    const [form, setForm] = useState<PostFormState>({
        id: id,
        title: title,
        tags: tags || [],
        description: description || "",
        body: body,
    })

    const updateForm = (name: string, value: string | string[]) => {
        setForm((prevState: any) => ({
            ...prevState,
            [name]: value,
        }))
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        try {
            const response = await fetch("/api/edit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            })
            console.log(response.json())
        } catch (error) {
            console.error("Error:", error)
        }
    }
    const defaultTags = form.tags.map((t) => ({ value: t, label: t }))
    return (
        <>
            <div className="">
                <button
                    className="btn btn-primary"
                    onClick={() =>
                        document.getElementById("post_form")?.showModal()
                    }
                >
                    {header}
                </button>
            </div>
            <dialog id="post_form" className="modal">
                <div className="modal-box w-11/12 modal-middle max-w-5xl">
                    <h2 className="font-bold text-lg my-4">
                        {header} #{id}
                    </h2>
                    <form
                        onSubmit={handleSubmit}
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
                            onChange={(val) => updateForm("body", val)}
                            previewOptions={{
                                rehypePlugins: [[rehypeSanitize]], // prevent xss
                            }}
                        />
                        <button type="submit" className="btn btn-primary">
                            送出
                        </button>
                    </form>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>關閉</button>
                </form>
            </dialog>
        </>
    )
}
