import { ApolloClient, InMemoryCache } from "@apollo/client"

import { defaultDataIdFromObject } from "@apollo/client"

let apolloClient: ApolloClient<any> | null = null

const createApolloClient = () =>
    new ApolloClient({
        uri: "https://api.github.com/graphql",
        cache: new InMemoryCache({
            dataIdFromObject(responseObject) {
                switch (responseObject.__typename) {
                    case "Repository":
                        // 假設每個Repository對象都有owner和name字段
                        return `Repository:${responseObject.owner}:${responseObject.name}`
                    // 你可以為其他類型添加更多的規則
                    default:
                        return defaultDataIdFromObject(responseObject)
                }
            },
        }),
    })

export const getClient = () => {
    if (!apolloClient) {
        apolloClient = createApolloClient()
    }
    return apolloClient
}
