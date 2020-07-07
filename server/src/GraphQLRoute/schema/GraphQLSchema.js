import { buildSchema } from 'graphql';

export default buildSchema(`
    input WordInput {
        romaji: String
        en: String
        word: String
    }
    type Word {
        id: ID!
        romaji: String
        en: String
        word: String
    }
    type Question {
        id: ID!
        wordId: Int!
        result: String
    }
    type Query {
        numWords: Int!
        getWords(lowerDay: Int, higherDay: Int): [Word]!
        randWords(numWords: Int!): [Word]!
        numUpdatedWords(lowTimestamp: Int!, highTimestamp: Int!): Int!
        getQuestions: [Question]!
    } 
    type Mutation {
        updateWord(id: ID!, input: WordInput!): Word
    }
`);
