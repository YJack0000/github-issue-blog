import { ApolloClient, InMemoryCache } from "@apollo/client"

let apolloClient: ApolloClient<any> | null = null

const createApolloClient = () =>
    new ApolloClient({
        uri: "https://api.github.com/graphql",
        cache: new InMemoryCache(),
    })

export const getClient = () => {
    if (!apolloClient) {
        apolloClient = createApolloClient()
    }
    return apolloClient
}
