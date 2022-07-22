import { gql } from '@apollo/client';

export const CREATE_USER = gql`
  mutation createUser($username: String!, $email: String!, $password: String!) {
    createUser(username: $username, email: $email, password: $password) {
      user {
        _id
        email
        username
      }
      token
    }
  }
`;

export const LOGIN_USER = gql`
  mutation login($username: String, $email: String, $password: String!) {
    login(username: $username, email: $email, password: $password) {
      user {
        _id
        email
        username
      }
      token
    }
  }
`;

export const SAVE_BOOK = gql`
  mutation saveBook($bookId: String!, $authors: [String]!, $title: String!, $description: String!, $image: String!) {
    saveBook(bookId: $bookId, authors: $authors, title: $title, description: $description, image: $image) {
      _id
      username
      email
      bookCount
      savedBooks {
        authors
        bookId
        description
        image
        link
        title
      }
    }
  }
`;

export const DELETE_BOOK = gql`
  mutation deleteBook($bookId: String!) {
    deleteBook(bookId: $bookId) {
      email
      username
      _id
      bookCount
      savedBooks {
        authors
        bookId
        title
        description
        image
        link
      }
    }
  }
`;
