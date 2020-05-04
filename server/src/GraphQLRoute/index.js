import graphqlHTTP from 'express-graphql';
import schema from './schema/GraphQLSchema';

import createWordRoot from './roots/wordRoot';

export default function GraphQLRoute(pgPool) {
    const wordRoot = createWordRoot(pgPool);
    const root = {
        ...wordRoot,
    };

    return graphqlHTTP({
        schema: schema,
        rootValue: root,
        graphiql: true,
    });
};