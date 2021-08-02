import { EntityDataModuleConfig, EntityMetadataMap } from '@ngrx/data';

const entityMetadata: EntityMetadataMap = {
  CommentMessage: {},
};

// ---Should be needless
const pluralNames = { CommentMessage: 'CommentMessages' };

export const entityConfig: EntityDataModuleConfig = {
  entityMetadata,
  pluralNames,
};
