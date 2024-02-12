import type { Config } from "tailwindcss"

const config: Config = {
    content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
    theme: {
        extend: {},
    },
    plugins: [
        require("tailwind-scrollbar"),
        require("@tailwindcss/typography"),
        require("daisyui"),
    ],
    daisyui: {
        themes: [
            "winter",
            {
                business: {
                    // eslint-disable-next-line @typescript-eslint/no-var-requires
                    ...require("daisyui/src/theming/themes")[
                        "[data-theme=business]"
                    ],
                    "base-100": "#10151a",
                },
            },
        ],
        darkTheme: "business",
    },
}
export default config
