import { gql } from '@apollo/client'

export const GET_ME = gql`
  query getSingleUser($id: ID, $username: String) {
    getSingleUser(id: $id, username: $username) {
      _id
      username
      email
      bookCount
      savedBooks {
        authors
        description
        bookId
        image
        link
        title
      }
    }
  }
`;
