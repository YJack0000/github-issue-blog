"use server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/config/auth"
import { getClient } from "@/lib/apollo"
import {
    GET_FIRST_COMMENT_ID,
    UPDATE_COMMENT,
    UPDATE_ISSUE,
} from "@/graphql/github"

const client = getClient()

const GITHUB_GRAPHQL_API = "https://api.github.com/graphql"
const GITHUB_BLOG_POST_OWNER = process.env.GITHUB_BLOG_POST_OWNER
const GITHUB_BLOG_POST_REPO = process.env.GITHUB_BLOG_POST_REPO
const GITHUB_PAT = process.env.GITHUB_PAT

export const getUserName = async (): Promise<string | undefined> => {
    const session = await getServerSession(authOptions)

    if (!session) {
        return undefined
    }

    return session.user.name
}

export const getAuthor = async (): Promise<string> => {
    const query = `
      query {
        repository(owner: "${GITHUB_BLOG_POST_OWNER}", name: "${GITHUB_BLOG_POST_REPO}") {
            owner { 
                login
            }
        }
      }`
    const response = await fetch(GITHUB_GRAPHQL_API, {
        method: "POST",
        headers: {
            Accept: "application/json",
            Authorization: `token ${GITHUB_PAT}`,
        },
        body: JSON.stringify({ query }),
    })

    if (!response.ok) {
        throw new Error("Failed to fetch author data")
    }

    const data = await response.json()
    if (data.errors) {
        throw new Error(data.errors[0].message)
    }

    return data.data.repository.owner.login
}

export const getRepositoryId = async (): Promise<string> => {
    const session = await getServerSession(authOptions)
    const response = await fetch(GITHUB_GRAPHQL_API, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${session.accessToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            query: `
        query {
        repository(owner: "${GITHUB_BLOG_POST_OWNER}", name: "${GITHUB_BLOG_POST_REPO}") {
            id
        }
    }
        `,
        }),
    })

    const data = await response.json()
    return data.data.repository.id
}

export const getLabelIds = async (labelNames: string[]) => {
    const session = await getServerSession(authOptions)

    const query = `
    query getLabels($owner: String!, $name: String!) {
        repository(owner: $owner, name: $name) {
            labels(first: 100) {
                edges {
                    node {
                        id
                        name
                    }
                }
            }
        }
    }
`
    const variables = {
        owner: GITHUB_BLOG_POST_OWNER,
        name: GITHUB_BLOG_POST_REPO,
    }

    const response = await fetch(GITHUB_GRAPHQL_API, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${session.accessToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            query,
            variables,
        }),
    })

    const responseData = await response.json()

    if (response.status !== 200 || responseData.errors) {
        console.error("Failed to fetch label IDs:", responseData.errors)
        throw new Error("Failed to fetch label IDs.")
    }

    // filter out labels that are not in the list of labelNames
    const labelIds = responseData.data.repository.labels.edges
        .filter((edge: any) => labelNames.includes(edge.node.name))
        .map((edge: any) => edge.node.id)

    return labelIds
}

export const createIssue = async (
    repositoryId: string,
    title: string,
    body: string
) => {
    const session = await getServerSession(authOptions)
    const query = `
    mutation CreateIssue($repositoryId: ID!, $title: String!, $body: String!) {
        createIssue(input: { repositoryId: $repositoryId, title: $title, body: $body }) {
        issue {
                id
            }
        }
    }
        `

    const response = await fetch(GITHUB_GRAPHQL_API, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${session.accessToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            query,
            variables: { repositoryId, title, body: body },
        }),
    })

    const responseData = await response.json()
    const issueId = responseData.data.createIssue.issue.id

    return issueId
}

export const updateLabelsToIssue = async (
    issueId: string,
    labelIds: string[]
): Promise<void> => {
    const session = await getServerSession(authOptions)

    const mutation = `
    mutation UpdateIssue($issueId: ID!, $labelIds: [ID!]) {
      updateIssue(input: {
        id: $issueId,
        labelIds: $labelIds,
      }) {
        issue {
          id
          title
        }
      }
    }
  `

    try {
        const response = await fetch(GITHUB_GRAPHQL_API, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: mutation,
                variables: { issueId, labelIds },
            }),
        })

        const responseData = await response.json()

        if (responseData.errors) {
            console.error("Failed to add labels to issue:", responseData.errors)
            throw new Error("Failed to add labels to issue.")
        }
    } catch (error) {
        console.error("An error occurred:", error)
        throw error
    }
}

export const addCommentToIssue = async (issueId: string, body: string) => {
    const session = await getServerSession(authOptions)
    const query = `
    mutation AddComment($issueId: ID!, $body: String!) {
        addComment(input: { subjectId: $issueId, body: $body }) {
        commentEdge {
          node {
                    id
                }
            }
        }
    }
        `

    try {
        const response = await fetch(GITHUB_GRAPHQL_API, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query,
                variables: { issueId, body },
            }),
        })

        const responseData = await response.json()

        if (responseData.errors) {
            console.error(
                "Failed to add comment to issue:",
                responseData.errors
            )
            throw new Error("Failed to add comment to issue.")
        }
    } catch (error) {
        console.error("An error occurred:", error)
        throw error
    }
}

export const closeIssue = async (issueId: string) => {
    const session = await getServerSession(authOptions)
    const query = `
    mutation CloseIssue($issueId: ID!) {
        closeIssue(input: { issueId: $issueId }) {
        clientMutationId
        }
    }
    `

    try {
        const response = await fetch(GITHUB_GRAPHQL_API, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query,
                variables: { issueId },
            }),
        })

        const responseData = await response.json()

        if (responseData.errors) {
            console.error("Failed to delete issue:", responseData.errors)
            throw new Error("Failed to delete issue.")
        }
    } catch (error) {
        console.error("An error occurred:", error)
        throw error
    }
}

export const updateIssue = async (
    issueId: string,
    labelIds: string[],
    title: string,
    description: string
) => {
    const session = await getServerSession(authOptions)

    try {
        const { errors } = await client.mutate({
            mutation: UPDATE_ISSUE,
            variables: { issueId, labelIds, title, description },
            context: {
                headers: {
                    Authorization: `bearer ${session?.accessToken}`,
                },
            },
        })
        if (errors) {
            console.error("GraphQL errors:", errors)
            throw new Error(errors.map((error) => error.message).join(", "))
        }
    } catch (error) {
        console.error("An error occurred when updateIssue info")
        throw error
    }
}

export const getFirstCommentId = async (issueId: string): Promise<string> => {
    const session = await getServerSession(authOptions)

    try {
        const { data, errors } = await client.query({
            query: GET_FIRST_COMMENT_ID,
            variables: { issueId },
            context: {
                headers: {
                    Authorization: `bearer ${session?.accessToken}`,
                },
            },
        })
        if (errors) {
            console.error("GraphQL errors:", errors)
            throw new Error(errors.map((error) => error.message).join(", "))
        }

        return data.node.comments.edges[0].node.id
    } catch (error) {
        console.error("An error occurred when getFirstCommentId info")
        throw error
    }
}

export const updateComment = async (commentId: string, body: string) => {
    const session = await getServerSession(authOptions)

    try {
        const { errors } = await client.mutate({
            mutation: UPDATE_COMMENT,
            variables: { commentId, body },
            context: {
                headers: {
                    Authorization: `bearer ${session?.accessToken}`,
                },
            },
        })
        if (errors) {
            console.error("GraphQL errors:", errors)
            throw new Error(errors.map((error) => error.message).join(", "))
        }
    } catch (error) {
        console.error("An error occurred when updateComment info")
        throw error
    }
}
