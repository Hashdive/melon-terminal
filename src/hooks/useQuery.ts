import { useContext } from 'react';
import { useQuery, QueryHookOptions as BaseQueryHookOptions } from '@apollo/react-hooks';
import { OperationVariables, QueryResult } from '@apollo/react-common';
import { DocumentNode } from 'graphql';
import ApolloClient from 'apollo-client';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import { TheGraphContext } from '~/components/Contexts/Connection';

export type QueryHookOptions<TData = any, TVariables = OperationVariables> = BaseQueryHookOptions<TData, TVariables>;

export const useContextQuery = <TData = any, TVariables = OperationVariables>(
  context: ApolloClient<NormalizedCacheObject>,
  query: DocumentNode,
  options?: QueryHookOptions<TData, TVariables>
): QueryResult<TData, TVariables> => {
  return useQuery(query, {
    ...options,
    client: context,
  });
};

export const useOnChainQuery = <TData = any, TVariables = OperationVariables>(
  query: DocumentNode,
  options?: QueryHookOptions<TData, TVariables>
): QueryResult<TData, TVariables> => {
  const result = useQuery<TData, TVariables>(query, options);
  return result;
};

export const useTheGraphQuery = <TData = any, TVariables = OperationVariables>(
  query: DocumentNode,
  options?: QueryHookOptions<TData, TVariables>
): QueryResult<TData, TVariables> => {
  const context = useContext(TheGraphContext);
  return useContextQuery<TData, TVariables>(context.client, query, options);
};
