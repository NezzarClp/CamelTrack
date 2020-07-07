import graphqlHTTP from 'express-graphql';
import schema from './schema/GraphQLSchema';

import createWordRoot from './roots/wordRoot';
import createQuestionRoot from './roots/questionRoot';

export default function GraphQLRoute(pgPool) {
    const wordRoot = createWordRoot(pgPool);
    const questionRoot = createQuestionRoot(pgPool);
    const root = {
        ...wordRoot,
        ...questionRoot,
    };

    return graphqlHTTP({
        schema: schema,
        rootValue: root,
        graphiql: true,
    });
};
