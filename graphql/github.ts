import { gql } from "@apollo/client"

const GITHUB_BLOG_POST_OWNER = process.env.GITHUB_BLOG_POST_OWNER
const GITHUB_BLOG_POST_REPO = process.env.GITHUB_BLOG_POST_REPO

export const GET_POSTS = gql`
    query GetPosts($after: String, $labels: [String!]) {
        repository(owner: "${GITHUB_BLOG_POST_OWNER}", name: "${GITHUB_BLOG_POST_REPO}") {
          issues(after: $after, first: 10, filterBy: {states: [OPEN], labels: $labels}, orderBy: {field: CREATED_AT, direction: DESC}) {
            edges {
              node {
                id
                title
                author {
                    login
                    avatarUrl(size: 100)
                }
                createdAt
                labels (first: 5) {
                  edges {
                    node {
                      name
                    }
                  }
                }
                body
              }
              cursor
            }
          }
        }
      }
    `

export const GET_ALL_POSTS_ID = gql`
    query GetAllPostsId {
        repository(owner: "${GITHUB_BLOG_POST_OWNER}", name: "${GITHUB_BLOG_POST_REPO}") {
            issues(first: 100, filterBy: {states: [OPEN]}) {
                edges {
                    node {
                        id
                    }
                }
            }
        }
    }
`

export const GET_TAGS = gql`
    query GetTags {
        repository(owner: "${GITHUB_BLOG_POST_OWNER}", name: "${GITHUB_BLOG_POST_REPO}") {
            labels(first: 20) {
                edges {
                    node {
                        name
                    }
                }
            }
        }
    }
    `

export const CREATE_TAG = gql`
    mutation CreateTag($repositoryId: ID!, $name: String!) {
        createLabel(
            input: { repositoryId: $repositoryId, name: $name, color: "000000" }
        ) {
            label {
                name
            }
        }
    }
`

export const GET_POST_DATA = gql`
    query GetPostData($id: ID!) {
        node(id: $id) {
            ... on Issue {
                title
                author {
                    login
                    avatarUrl(size: 100)
                }
                labels(first: 5) {
                    edges {
                        node {
                            name
                        }
                    }
                }
                body
                comments(first: 20) {
                    edges {
                        node {
                            author {
                                login
                                avatarUrl(size: 100)
                            }
                            body
                            createdAt
                        }
                    }
                }
            }
        }
    }
`

export const UPDATE_ISSUE = gql`
    mutation UpdateIssue(
        $issueId: ID!
        $labelIds: [ID!]!
        $title: String!
        $description: String!
    ) {
        updateIssue(
            input: {
                id: $issueId
                title: $title
                body: $description
                labelIds: $labelIds
            }
        ) {
            issue {
                id
                title
            }
        }
    }
`

export const GET_FIRST_COMMENT_ID = gql`
    query GetFirstCommentId($issueId: ID!) {
        node(id: $issueId) {
            ... on Issue {
                comments(first: 1) {
                    edges {
                        node {
                            id
                        }
                    }
                }
            }
        }
    }
`

export const UPDATE_COMMENT = gql`
    mutation UpdateComment($commentId: ID!, $body: String!) {
        updateIssueComment(input: { id: $commentId, body: $body }) {
            issueComment {
                id
                body
            }
        }
    }
`
