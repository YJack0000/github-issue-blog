import Markdown from "react-markdown"
import rehypeRaw from "rehype-raw"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism"

const CodeBlock = ({ language, value }: any) => (
    <SyntaxHighlighter language={language} style={dark}>
        {value}
    </SyntaxHighlighter>
)

export default async function Page({ content }: { content: string }) {
    return (
        <>
            <Markdown
                className="prose-lg text-base-content"
                components={{ code: CodeBlock }}
                rehypePlugins={[rehypeRaw]}
            >
                {content}
            </Markdown>
        </>
    )
}
