const appTypeDefs = `
    type AuthUser {
        _id: ID!
        username: String!
        email: String!
        createdAt: String!
        posts: [Post]
        followers: [User]
        following: [User]
        token: String
    }
    type User {
        _id: ID!
        username: String!
        email: String!
        createdAt: String!
        posts: [Post]
        followers: [User]
        following: [User]
    }

    type Post {
        _id: ID!
        type: String!
        body: String!
        user: User!
        username: String!
        createdAt: String!
    }

    input TextPostInput {
        text: String!
        type: String!
        userId: ID!
        username: String!
    }

    input ImagePostInput {
        image: String!
        type: String!
        userId: ID!
        username: String!
    }

    type ImagePost {
        _id: ID!
        type: String!
        image: String!
        user: User!
        createdAt: String!
    }

    input UserRegister {
        username: String!
        email: String!
        password: String!
        confirmPassword: String!
    }
    input UserLogin {
        email: String!
        password: String!
    }

    input PostInput {
        type: String!
        text: String
        image: String
        caption: String
    }

    type Query {
        getUser(username: String!): User
        getPost(_id: String!): Post
        getPostsByUsername(username: String!): [Post]
        getPosts: [Post]
        getSinglePost(postId: ID!): Post!
    }

    type Mutation {
        registerUser(email: String!, username: String!, password: String!, confirmPassword: String!): AuthUser!
        loginUser(email: String!, password: String!): AuthUser!
        createTextPost(input: TextPostInput!): Post!
        createImagePost(input: ImagePostInput!): Post!
        deletePost(postId: ID!, userId: ID!): String!
        followUser(selectedUserId: ID!, loggedInUserId : ID!): User
        unfollowUser(selectedUserId: ID!, loggedInUserId : ID!): User
    }
`;

module.exports = appTypeDefs;
