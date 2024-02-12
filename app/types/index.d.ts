type Author = {
    name: string
    avatar: string
}

type PostPreview = {
    id: number
    title: string
    createdAt: string
    author: Author
    description: string
    tags: string[]
    cursor: string
}

type Post = {
    id: number
    title: string
    createdAt: string
    tags: string[]
    author: Author
    body: string
    comments: string[]
}

type Comment = {
    author: Author
    body: string
    createdAt: string
}