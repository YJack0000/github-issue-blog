import MDEditor from "@uiw/react-md-editor"
import rehypeSanitize from "rehype-sanitize"

export interface MarkDownEditorProps {
    className: string
    value: string
    onChange: (val: string | undefined) => void
}

export default function MarkdownEditor({
    className,
    value,
    onChange,
}: MarkDownEditorProps) {
    return (
        <MDEditor
            className={className}
            value={value}
            onChange={onChange}
            previewOptions={{
                rehypePlugins: [[rehypeSanitize]], // prevent xss
            }}
        />
    )
}
