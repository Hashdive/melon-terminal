import { Resolver } from '~/graphql';
import { Hub } from '@melonproject/melonjs';

export const address: Resolver<Hub> = hub => hub.contract.address;
export const name: Resolver<Hub> = (hub, _, context) => hub.getName(context.block);
export const manager: Resolver<Hub> = (hub, _, context) => hub.getManager(context.block);
export const creator: Resolver<Hub> = (hub, _, context) => hub.getCreator(context.block);
export const creationTime: Resolver<Hub> = (hub, _, context) => hub.getCreationTime(context.block);
export const routes: Resolver<Hub> = async (hub, _, context) => [hub, await hub.getRoutes(context.block)];