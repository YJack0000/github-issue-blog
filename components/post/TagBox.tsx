"use client"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export interface TagBoxProps {
    tags: string[]
    selected: string | undefined
    onSelect: (tag?: string) => void
}

function CollapseTagBox({ tags, selected, onSelect }: TagBoxProps) {
    const [selectedTag, setSelectedTag] = useState(selected || "全部")

    const handleTagClick = (tag: string) => {
        setSelectedTag(tag)
        onSelect(tag)
    }

    return (
        <div className="collapse collapse-arrow border border-base-300">
            <input type="checkbox" />
            <div className="collapse-title text-md font-normal">分類</div>
            <div className="collapse-content">
                <div className="my-2">
                    <div className="flex flex-row flex-wrap gap-1">
                        {tags.map((tag: string) => (
                            <button
                                key={tag}
                                className={`btn btn-md ${selectedTag === tag ? "btn-primary" : "btn-outline"}`}
                                onClick={() => handleTagClick(tag)}
                            >
                                {tag}
                            </button>
                        ))}{" "}
                    </div>
                </div>
            </div>
        </div>
    )
}

function DefaultTagBox({ tags, selected, onSelect }: TagBoxProps) {
    const [selectedTag, setSelectedTag] = useState(selected || "全部")

    const handleTagClick = (tag: string) => {
        setSelectedTag(tag)
        onSelect(tag)
    }

    return (
        <div className="my-2">
            <h2 className="text-md font-normal my-2">分類</h2>
            <div className="flex flex-row flex-wrap gap-1">
                <button
                    className={`btn btn-md ${selectedTag === "全部" ? "btn-primary" : "btn-outline"}`}
                    onClick={() => handleTagClick("全部")}
                >
                    全部
                </button>
                {tags.map((tag: string) => (
                    <button
                        key={tag}
                        className={`btn btn-md ${selectedTag === tag ? "btn-primary" : "btn-outline"}`}
                        onClick={() => handleTagClick(tag)}
                    >
                        {tag}
                    </button>
                ))}{" "}
            </div>
        </div>
    )
}

export default function TagBox({
    tags,
    selected,
}: {
    tags: string[]
    selected: string | undefined
}) {
    const router = useRouter()
    const onSelect = (tag?: string) => {
        if (tag === "全部") tag = undefined
        if (tag) {
            router.push(`/post?tag=${tag}`)
        } else {
            router.push("/post")
        }
    }

    return (
        <>
            <div className="block md:hidden">
                <CollapseTagBox
                    tags={tags}
                    selected={selected}
                    onSelect={onSelect}
                />
            </div>
            <div className="hidden md:block">
                <DefaultTagBox
                    tags={tags}
                    selected={selected}
                    onSelect={onSelect}
                />
            </div>
        </>
    )
}
