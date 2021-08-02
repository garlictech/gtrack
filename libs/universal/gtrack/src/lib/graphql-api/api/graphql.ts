import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
}

export enum PublicationState {
  draft = 'draft',
  published = 'published',
  archived = 'archived',
}

export enum LengthUnit {
  imperial = 'imperial',
  metric = 'metric',
}

export interface LocalizedObject {
  lat: Scalars['Float'];
  lon: Scalars['Float'];
}

export interface PublishableObject {
  publicationState: PublicationState;
}

export enum TextualDescriptionType {
  markdown = 'markdown',
  html = 'html',
}

export interface TextualDescription {
  __typename?: 'TextualDescription';
  languageKey: Scalars['String'];
  title?: Maybe<Scalars['String']>;
  summary?: Maybe<Scalars['String']>;
  fullDescription?: Maybe<Scalars['String']>;
  type: TextualDescriptionType;
}

export interface TextualDescriptionInput {
  languageKey: Scalars['String'];
  title?: Maybe<Scalars['String']>;
  summary?: Maybe<Scalars['String']>;
  fullDescription?: Maybe<Scalars['String']>;
  type: TextualDescriptionType;
}

export interface IdMap {
  __typename?: 'IdMap';
  id: Scalars['ID'];
}

export interface ImageInfo {
  __typename?: 'ImageInfo';
  url: Scalars['String'];
  width?: Maybe<Scalars['Int']>;
  height?: Maybe<Scalars['Int']>;
}

export interface ImageInfoInput {
  url: Scalars['String'];
  width?: Maybe<Scalars['Int']>;
  height?: Maybe<Scalars['Int']>;
}

export interface ImageLabel {
  __typename?: 'ImageLabel';
  label: Scalars['String'];
  confidence: Scalars['Float'];
}

export interface ImageLabelInput {
  label: Scalars['String'];
  confidence: Scalars['Float'];
}

export interface Image extends LocalizedObject {
  __typename?: 'Image';
  id: Scalars['ID'];
  lat: Scalars['Float'];
  lon: Scalars['Float'];
  original: ImageInfo;
  card: ImageInfo;
  thumbnail: ImageInfo;
  sourceObject: PoiSourceObject;
  attributions?: Maybe<Scalars['String']>;
  labels?: Maybe<Array<Maybe<ImageLabel>>>;
}

export interface CreateImageInput {
  lat: Scalars['Float'];
  lon: Scalars['Float'];
  original: ImageInfoInput;
  card: ImageInfoInput;
  thumbnail: ImageInfoInput;
  sourceObject: PoiSourceObjectInput;
  attributions?: Maybe<Scalars['String']>;
}

export interface UpdateImageInput {
  id: Scalars['ID'];
  attributions?: Maybe<Scalars['String']>;
  labels?: Maybe<Array<Maybe<ImageLabelInput>>>;
}

export interface MultipleImagesResponse {
  __typename?: 'MultipleImagesResponse';
  data?: Maybe<Array<Maybe<Image>>>;
  unprocessedKeys?: Maybe<Array<Maybe<IdMap>>>;
}

export interface GenericHikingObject {
  id: Scalars['ID'];
  description: Array<TextualDescription>;
  tags?: Maybe<Array<Scalars['String']>>;
}

export enum PoiSource {
  google = 'google',
  wikipedia = 'wikipedia',
  osmamenity = 'osmAmenity',
  osmnatural = 'osmNatural',
  osmroute = 'osmRoute',
  osmpublictransport = 'osmPublicTransport',
  osmemergency = 'osmEmergency',
  osmhistoric = 'osmHistoric',
  osmleisure = 'osmLeisure',
  osmmanmade = 'osmManMade',
  osmmilitary = 'osmMilitary',
  osmshop = 'osmShop',
  osmtourism = 'osmTourism',
  mapillary = 'mapillary',
  flickr = 'flickr',
}

export interface PoiSourceObject {
  __typename?: 'PoiSourceObject';
  objectType: PoiSource;
  languageKey?: Maybe<Scalars['String']>;
  objectId: Scalars['String'];
  url?: Maybe<Scalars['String']>;
}

export interface MultiplePoisResponse {
  __typename?: 'MultiplePoisResponse';
  data?: Maybe<Array<Maybe<Poi>>>;
  unprocessedKeys?: Maybe<Array<Maybe<IdMap>>>;
}

export interface Poi {
  __typename?: 'Poi';
  id: Scalars['ID'];
  elevation: Scalars['Float'];
  lat: Scalars['Float'];
  lon: Scalars['Float'];
  types?: Maybe<Array<Scalars['String']>>;
  description: Array<TextualDescription>;
  tags?: Maybe<Array<Scalars['String']>>;
  sourceObject: Array<PoiSourceObject>;
  address?: Maybe<Scalars['String']>;
  phoneNumber?: Maybe<Scalars['String']>;
  openingHours?: Maybe<Scalars['String']>;
}

export interface PoiSourceObjectInput {
  objectType: PoiSource;
  languageKey?: Maybe<Scalars['String']>;
  objectId: Scalars['String'];
  url?: Maybe<Scalars['String']>;
}

export interface CreatePoiInput {
  elevation: Scalars['Float'];
  lat: Scalars['Float'];
  lon: Scalars['Float'];
  types?: Maybe<Array<Scalars['String']>>;
  description: Array<TextualDescriptionInput>;
  tags?: Maybe<Array<Scalars['String']>>;
  sourceObject: Array<PoiSourceObjectInput>;
  address?: Maybe<Scalars['String']>;
  phoneNumber?: Maybe<Scalars['String']>;
  openingHours?: Maybe<Scalars['String']>;
}

export interface UpdatePoiInput {
  id: Scalars['ID'];
  types?: Maybe<Array<Scalars['String']>>;
  description?: Maybe<Array<TextualDescriptionInput>>;
  tags?: Maybe<Array<Scalars['String']>>;
  sourceObject?: Maybe<Array<PoiSourceObjectInput>>;
  address?: Maybe<Scalars['String']>;
  phoneInt?: Maybe<Scalars['String']>;
  openingHours?: Maybe<Scalars['String']>;
}

export interface PoiConnection {
  __typename?: 'PoiConnection';
  items: Array<Poi>;
  nextToken?: Maybe<Scalars['String']>;
}

export interface CreateHikeGroupInput {
  description: Array<TextualDescriptionInput>;
  hikeIds?: Maybe<Array<Scalars['String']>>;
  publicationState: PublicationState;
}

export interface UpdateHikeGroupInput {
  id: Scalars['ID'];
  description?: Maybe<Array<TextualDescriptionInput>>;
  hikeIds?: Maybe<Array<Scalars['String']>>;
  publicationState?: Maybe<PublicationState>;
}

export interface HikeGroup {
  __typename?: 'HikeGroup';
  id: Scalars['ID'];
  description: Array<TextualDescription>;
  hikeIds?: Maybe<Array<Scalars['String']>>;
  publicationState: PublicationState;
}

export interface HikeGroupConnection {
  __typename?: 'HikeGroupConnection';
  items: Array<HikeGroup>;
  nextToken?: Maybe<Scalars['String']>;
}

export interface Point {
  __typename?: 'Point';
  lat: Scalars['Float'];
  lon: Scalars['Float'];
  elevation?: Maybe<Scalars['Float']>;
}

export interface BoundingBox {
  __typename?: 'BoundingBox';
  NorthEast: Point;
  SouthWest: Point;
}

export interface PointInput {
  lat: Scalars['Float'];
  lon: Scalars['Float'];
}

export interface BoundingBoxInput {
  NorthEast: PointInput;
  SouthWest: PointInput;
}

export enum PlaceType {
  poi = 'poi',
  hike = 'hike',
  message = 'message',
  image = 'image',
}

export interface Place {
  __typename?: 'Place';
  id: Scalars['ID'];
  type: PlaceType;
  objectId: Scalars['String'];
  lat: Scalars['Float'];
  lon: Scalars['Float'];
  title?: Maybe<Scalars['String']>;
  banned?: Maybe<Scalars['Boolean']>;
  processed?: Maybe<Scalars['Boolean']>;
}

export interface DeletePlaceResponse {
  __typename?: 'DeletePlaceResponse';
  deleted?: Maybe<Scalars['Int']>;
}

export interface CreatePlaceInput {
  type: PlaceType;
  objectId: Scalars['String'];
  lat: Scalars['Float'];
  lon: Scalars['Float'];
  title?: Maybe<Scalars['String']>;
  banned?: Maybe<Scalars['Boolean']>;
  processed?: Maybe<Scalars['Boolean']>;
}

export interface DeletePlaceInput {
  id: Scalars['ID'];
}

export interface HikeStopData {
  __typename?: 'HikeStopData';
  poiId: Scalars['ID'];
  description?: Maybe<Array<TextualDescription>>;
}

export interface HikeStopDataInput {
  poiId: Scalars['ID'];
  description?: Maybe<Array<TextualDescriptionInput>>;
}

export interface Checkpoint {
  __typename?: 'Checkpoint';
  poiId?: Maybe<Scalars['String']>;
  point?: Maybe<Point>;
}

export interface CheckpointInput {
  poiId?: Maybe<Scalars['String']>;
  point?: Maybe<PointInput>;
}

export interface RouteData {
  __typename?: 'RouteData';
  distance: Scalars['Int'];
  uphill: Scalars['Int'];
  downhill: Scalars['Int'];
  track: Array<Array<Scalars['Float']>>;
  bigBuffer: Array<Array<Array<Scalars['Float']>>>;
  smallBuffer: Array<Array<Array<Scalars['Float']>>>;
  averageTime: Scalars['Int'];
  score: Scalars['Int'];
  difficulty: Scalars['Int'];
  bounds: BoundingBox;
  isRoundTrip: Scalars['Boolean'];
  poiSearchBox: BoundingBox;
}

export interface HikeData extends GenericHikingObject {
  __typename?: 'HikeData';
  id: Scalars['ID'];
  description: Array<TextualDescription>;
  location: Scalars['String'];
  publicationState: PublicationState;
  featured?: Maybe<Scalars['Boolean']>;
  rate?: Maybe<Scalars['String']>;
  offlineMap?: Maybe<Scalars['String']>;
  featuredStops?: Maybe<Array<Maybe<HikeStopData>>>;
  checkpoints?: Maybe<Array<Maybe<Checkpoint>>>;
  tags?: Maybe<Array<Scalars['String']>>;
  route: RouteData;
  segments: Array<Scalars['Int']>;
}

export interface HikeConnection {
  __typename?: 'HikeConnection';
  items: Array<HikeData>;
  nextToken?: Maybe<Scalars['String']>;
  scannedCount: Scalars['Int'];
}

export interface CreateRouteDataInput {
  distance: Scalars['Int'];
  uphill: Scalars['Int'];
  downhill: Scalars['Int'];
  track: Array<Array<Scalars['Float']>>;
  bigBuffer: Array<Array<Array<Scalars['Float']>>>;
  smallBuffer: Array<Array<Array<Scalars['Float']>>>;
  averageTime: Scalars['Int'];
  score: Scalars['Int'];
  difficulty: Scalars['Int'];
  bounds: BoundingBoxInput;
  isRoundTrip: Scalars['Boolean'];
  poiSearchBox: BoundingBoxInput;
}

export interface CreateHikeInput {
  description: Array<TextualDescriptionInput>;
  location: Scalars['String'];
  publicationState: PublicationState;
  featured?: Maybe<Scalars['Boolean']>;
  rate?: Maybe<Scalars['String']>;
  offlineMap?: Maybe<Scalars['String']>;
  featuredStops?: Maybe<Array<Maybe<HikeStopDataInput>>>;
  checkpoints?: Maybe<Array<Maybe<CheckpointInput>>>;
  tags?: Maybe<Array<Scalars['String']>>;
  route: CreateRouteDataInput;
  segments: Array<Scalars['Int']>;
}

export interface UpdateHikeInput {
  id: Scalars['ID'];
  description?: Maybe<Array<TextualDescriptionInput>>;
  publicationState?: Maybe<PublicationState>;
  featured?: Maybe<Scalars['Boolean']>;
  rate?: Maybe<Scalars['String']>;
  featuredStops?: Maybe<Array<Maybe<HikeStopDataInput>>>;
  checkpoints?: Maybe<Array<Maybe<CheckpointInput>>>;
  tags?: Maybe<Array<Scalars['String']>>;
}

export interface MultipleHikesResponse {
  __typename?: 'MultipleHikesResponse';
  data?: Maybe<Array<Maybe<HikeData>>>;
  unprocessedKeys?: Maybe<Array<Maybe<IdMap>>>;
}

export interface UpdateProfileInput {
  username?: Maybe<Scalars['String']>;
  birthDate?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  languages?: Maybe<Array<Maybe<Scalars['String']>>>;
  picture?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
}

export interface Profile {
  __typename?: 'Profile';
  username: Scalars['String'];
  birthDate?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  languages?: Maybe<Array<Scalars['String']>>;
  picture?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
}

export interface UpdateSettingsInput {
  averageSpeed?: Maybe<Scalars['Int']>;
  lengthUnit?: Maybe<LengthUnit>;
}

export interface Settings {
  __typename?: 'Settings';
  averageSpeed?: Maybe<Scalars['Int']>;
  lengthUnit?: Maybe<LengthUnit>;
}

export interface Customer {
  __typename?: 'Customer';
  profile?: Maybe<Profile>;
  settings?: Maybe<Settings>;
  bookmarkedHikes?: Maybe<Array<Maybe<Scalars['ID']>>>;
}


export interface ToggleHikeBookmarkInput {
  hikeId: Scalars['ID'];
}

export interface Mutation {
  __typename?: 'Mutation';
  createPoi?: Maybe<Poi>;
  createMultiplePois?: Maybe<Array<Maybe<Poi>>>;
  updatePoi?: Maybe<Poi>;
  deletePoi?: Maybe<Poi>;
  createImage?: Maybe<Image>;
  createMultipleImages?: Maybe<Array<Maybe<Image>>>;
  updateImage?: Maybe<Image>;
  deleteImage?: Maybe<Image>;
  createHikeGroup?: Maybe<HikeGroup>;
  updateHikeGroup?: Maybe<HikeGroup>;
  deleteHikeGroup?: Maybe<HikeGroup>;
  updateCustomerSettings?: Maybe<Settings>;
  updateCustomerProfile?: Maybe<Profile>;
  toggleBookmarkedHike?: Maybe<Scalars['Boolean']>;
  createPlace?: Maybe<Place>;
  deletePlace?: Maybe<DeletePlaceResponse>;
  deleteAllPlaces?: Maybe<DeletePlaceResponse>;
  setPlaceAcceptance: Scalars['Boolean'];
  createHike?: Maybe<HikeData>;
  createMultipleHikes?: Maybe<Array<Maybe<HikeData>>>;
  updateHike?: Maybe<HikeData>;
  deleteHike?: Maybe<HikeData>;
  processRouteSegment: Scalars['Boolean'];
}

export interface MutationCreatePoiArgs {
  input: CreatePoiInput;
}

export interface MutationCreateMultiplePoisArgs {
  input: Array<CreatePoiInput>;
}

export interface MutationUpdatePoiArgs {
  input: UpdatePoiInput;
}

export interface MutationDeletePoiArgs {
  id: Scalars['ID'];
}

export interface MutationCreateImageArgs {
  input: CreateImageInput;
}

export interface MutationCreateMultipleImagesArgs {
  input: Array<CreateImageInput>;
}

export interface MutationUpdateImageArgs {
  input: UpdateImageInput;
}

export interface MutationDeleteImageArgs {
  id: Scalars['ID'];
}

export interface MutationCreateHikeGroupArgs {
  input: CreateHikeGroupInput;
}

export interface MutationUpdateHikeGroupArgs {
  input: UpdateHikeGroupInput;
}

export interface MutationDeleteHikeGroupArgs {
  id: Scalars['ID'];
}

export interface MutationUpdateCustomerSettingsArgs {
  input: UpdateSettingsInput;
}

export interface MutationUpdateCustomerProfileArgs {
  input: UpdateProfileInput;
}

export interface MutationToggleBookmarkedHikeArgs {
  input: ToggleHikeBookmarkInput;
}

export interface MutationCreatePlaceArgs {
  input: CreatePlaceInput;
}

export interface MutationDeletePlaceArgs {
  objectId: Scalars['ID'];
}

export interface MutationSetPlaceAcceptanceArgs {
  id: Scalars['ID'];
  isAccepted: Scalars['Boolean'];
}

export interface MutationCreateHikeArgs {
  input: CreateHikeInput;
}

export interface MutationCreateMultipleHikesArgs {
  input: Array<CreateHikeInput>;
}

export interface MutationUpdateHikeArgs {
  input: UpdateHikeInput;
}

export interface MutationDeleteHikeArgs {
  id: Scalars['ID'];
}

export interface MutationProcessRouteSegmentArgs {
  input: Array<Array<Scalars['Float']>>;
}

export interface Query {
  __typename?: 'Query';
  getPoi?: Maybe<Poi>;
  getMultiplePois?: Maybe<MultiplePoisResponse>;
  getImage?: Maybe<Image>;
  getMultipleImages?: Maybe<MultipleImagesResponse>;
  getSafeImages?: Maybe<MultipleImagesResponse>;
  getHikeGroup?: Maybe<HikeGroup>;
  listHikeGroups?: Maybe<HikeGroupConnection>;
  getCustomer?: Maybe<Customer>;
  searchPlaceInCircle: Array<Maybe<Place>>;
  searchSafeImageInCircle: Array<Maybe<Place>>;
  searchPlaceInBox: Array<Maybe<Place>>;
  searchPlaceByTitle: Array<Maybe<Place>>;
  searchPlaceByObjectId: Array<Maybe<Place>>;
  getHike?: Maybe<HikeData>;
  listHikes?: Maybe<HikeConnection>;
  getMultipleHikes?: Maybe<MultipleHikesResponse>;
}

export interface QueryGetPoiArgs {
  id: Scalars['ID'];
}

export interface QueryGetMultiplePoisArgs {
  ids: Array<Scalars['ID']>;
}

export interface QueryGetImageArgs {
  id: Scalars['ID'];
}

export interface QueryGetMultipleImagesArgs {
  ids: Array<Scalars['ID']>;
}

export interface QueryGetSafeImagesArgs {
  ids: Array<Scalars['ID']>;
}

export interface QueryGetHikeGroupArgs {
  id: Scalars['ID'];
}

export interface QuerySearchPlaceInCircleArgs {
  lat: Scalars['Float'];
  lon: Scalars['Float'];
  radius: Scalars['Float'];
  type: PlaceType;
  from?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
}

export interface QuerySearchSafeImageInCircleArgs {
  lat: Scalars['Float'];
  lon: Scalars['Float'];
  radius: Scalars['Float'];
  from?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
}

export interface QuerySearchPlaceInBoxArgs {
  box: BoundingBoxInput;
  type: PlaceType;
}

export interface QuerySearchPlaceByTitleArgs {
  title: Scalars['String'];
  type: PlaceType;
  from?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
}

export interface QuerySearchPlaceByObjectIdArgs {
  objectId: Scalars['ID'];
}

export interface QueryGetHikeArgs {
  id: Scalars['ID'];
}

export interface QueryGetMultipleHikesArgs {
  ids: Array<Scalars['ID']>;
}

export type ToggleBookmarkedHikeMutationVariables = Exact<{
  input: ToggleHikeBookmarkInput;
}>;

export type ToggleBookmarkedHikeMutation = { __typename?: 'Mutation' } & Pick<
  Mutation,
  'toggleBookmarkedHike'
>;

export type UpdateCustomerProfileMutationVariables = Exact<{
  input: UpdateProfileInput;
}>;

export type UpdateCustomerProfileMutation = { __typename?: 'Mutation' } & {
  updateCustomerProfile?: Maybe<
    { __typename?: 'Profile' } & ProfileFieldsFragment
  >;
};

export type UpdateCustomerSettingsMutationVariables = Exact<{
  input: UpdateSettingsInput;
}>;

export type UpdateCustomerSettingsMutation = { __typename?: 'Mutation' } & {
  updateCustomerSettings?: Maybe<
    { __typename?: 'Settings' } & SettingsFieldsFragment
  >;
};

export type GetCustomerQueryVariables = Exact<{ [key: string]: never }>;

export type GetCustomerQuery = { __typename?: 'Query' } & {
  getCustomer?: Maybe<{ __typename?: 'Customer' } & CustomerFieldsFragment>;
};

export type CustomerFieldsFragment = { __typename?: 'Customer' } & Pick<
  Customer,
  'bookmarkedHikes'
> & {
    profile?: Maybe<{ __typename?: 'Profile' } & ProfileFieldsFragment>;
    settings?: Maybe<{ __typename?: 'Settings' } & SettingsFieldsFragment>;
  };

export type ProfileFieldsFragment = { __typename?: 'Profile' } & Pick<
  Profile,
  | 'username'
  | 'birthDate'
  | 'firstName'
  | 'lastName'
  | 'languages'
  | 'picture'
  | 'phone'
>;

export type SettingsFieldsFragment = { __typename?: 'Settings' } & Pick<
  Settings,
  'averageSpeed' | 'lengthUnit'
>;

export type DeletePlaceMutationVariables = Exact<{
  objectId: Scalars['ID'];
}>;

export type DeletePlaceMutation = { __typename?: 'Mutation' } & {
  deletePlace?: Maybe<
    { __typename?: 'DeletePlaceResponse' } & Pick<
      DeletePlaceResponse,
      'deleted'
    >
  >;
};

export type CreatePlaceMutationVariables = Exact<{
  input: CreatePlaceInput;
}>;

export type CreatePlaceMutation = { __typename?: 'Mutation' } & {
  createPlace?: Maybe<{ __typename?: 'Place' } & PlaceFieldsFragment>;
};

export type SetPlaceAcceptanceMutationVariables = Exact<{
  id: Scalars['ID'];
  isAccepted: Scalars['Boolean'];
}>;

export type SetPlaceAcceptanceMutation = { __typename?: 'Mutation' } & Pick<
  Mutation,
  'setPlaceAcceptance'
>;

export type SearchPlaceInCircleQueryVariables = Exact<{
  lat: Scalars['Float'];
  lon: Scalars['Float'];
  radius: Scalars['Float'];
  type: PlaceType;
  from?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
}>;

export type SearchPlaceInCircleQuery = { __typename?: 'Query' } & {
  searchPlaceInCircle: Array<
    Maybe<{ __typename?: 'Place' } & PlaceFieldsFragment>
  >;
};

export type SearchSafeImageInCircleQueryVariables = Exact<{
  lat: Scalars['Float'];
  lon: Scalars['Float'];
  radius: Scalars['Float'];
  from?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
}>;

export type SearchSafeImageInCircleQuery = { __typename?: 'Query' } & {
  searchSafeImageInCircle: Array<
    Maybe<{ __typename?: 'Place' } & PlaceFieldsFragment>
  >;
};

export type SearchPlaceInBoxQueryVariables = Exact<{
  box: BoundingBoxInput;
  type: PlaceType;
}>;

export type SearchPlaceInBoxQuery = { __typename?: 'Query' } & {
  searchPlaceInBox: Array<
    Maybe<{ __typename?: 'Place' } & PlaceFieldsFragment>
  >;
};

export type SearchPlaceByTitleQueryVariables = Exact<{
  title: Scalars['String'];
  type: PlaceType;
  from?: Maybe<Scalars['Int']>;
  pageSize?: Maybe<Scalars['Int']>;
}>;

export type SearchPlaceByTitleQuery = { __typename?: 'Query' } & {
  searchPlaceByTitle: Array<
    Maybe<{ __typename?: 'Place' } & PlaceFieldsFragment>
  >;
};

export type SearchPlaceByObjectIdQueryVariables = Exact<{
  objectId: Scalars['ID'];
}>;

export type SearchPlaceByObjectIdQuery = { __typename?: 'Query' } & {
  searchPlaceByObjectId: Array<
    Maybe<{ __typename?: 'Place' } & PlaceFieldsFragment>
  >;
};

export type PlaceFieldsFragment = { __typename?: 'Place' } & Pick<
  Place,
  'id' | 'type' | 'objectId' | 'lat' | 'lon' | 'processed' | 'banned'
>;

export type CreateHikeGroupMutationVariables = Exact<{
  input: CreateHikeGroupInput;
}>;

export type CreateHikeGroupMutation = { __typename?: 'Mutation' } & {
  createHikeGroup?: Maybe<
    { __typename?: 'HikeGroup' } & HikeGroupFieldsFragment
  >;
};

export type UpdateHikeGroupMutationVariables = Exact<{
  input: UpdateHikeGroupInput;
}>;

export type UpdateHikeGroupMutation = { __typename?: 'Mutation' } & {
  updateHikeGroup?: Maybe<
    { __typename?: 'HikeGroup' } & HikeGroupFieldsFragment
  >;
};

export type ListHikeGroupsQueryVariables = Exact<{ [key: string]: never }>;

export type ListHikeGroupsQuery = { __typename?: 'Query' } & {
  listHikeGroups?: Maybe<
    { __typename?: 'HikeGroupConnection' } & Pick<
      HikeGroupConnection,
      'nextToken'
    > & { items: Array<{ __typename?: 'HikeGroup' } & HikeGroupFieldsFragment> }
  >;
};

export type GetHikeGroupQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type GetHikeGroupQuery = { __typename?: 'Query' } & {
  getHikeGroup?: Maybe<{ __typename?: 'HikeGroup' } & HikeGroupFieldsFragment>;
};

export type HikeGroupFieldsFragment = { __typename?: 'HikeGroup' } & Pick<
  HikeGroup,
  'id' | 'hikeIds' | 'publicationState'
> & {
    description: Array<
      { __typename?: 'TextualDescription' } & TextualDescriptionFieldsFragment
    >;
  };

export type CreateHikeMutationVariables = Exact<{
  input: CreateHikeInput;
}>;

export type CreateHikeMutation = { __typename?: 'Mutation' } & {
  createHike?: Maybe<{ __typename?: 'HikeData' } & HikeFieldsFragment>;
};

export type UpdateHikeMutationVariables = Exact<{
  input: UpdateHikeInput;
}>;

export type UpdateHikeMutation = { __typename?: 'Mutation' } & {
  updateHike?: Maybe<{ __typename?: 'HikeData' } & HikeFieldsFragment>;
};

export type DeleteHikeMutationVariables = Exact<{
  id: Scalars['ID'];
}>;

export type DeleteHikeMutation = { __typename?: 'Mutation' } & {
  deleteHike?: Maybe<{ __typename?: 'HikeData' } & Pick<HikeData, 'id'>>;
};

export type GetHikeQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type GetHikeQuery = { __typename?: 'Query' } & {
  getHike?: Maybe<{ __typename?: 'HikeData' } & HikeFieldsFragment>;
};

export type ListHikesQueryVariables = Exact<{ [key: string]: never }>;

export type ListHikesQuery = { __typename?: 'Query' } & {
  listHikes?: Maybe<
    { __typename?: 'HikeConnection' } & HikeConnectionFieldsFragment
  >;
};

export type GetMultipleHikesQueryVariables = Exact<{
  ids: Array<Scalars['ID']>;
}>;

export type GetMultipleHikesQuery = { __typename?: 'Query' } & {
  getMultipleHikes?: Maybe<
    { __typename?: 'MultipleHikesResponse' } & {
      data?: Maybe<
        Array<Maybe<{ __typename?: 'HikeData' } & HikeFieldsFragment>>
      >;
      unprocessedKeys?: Maybe<
        Array<Maybe<{ __typename?: 'IdMap' } & Pick<IdMap, 'id'>>>
      >;
    }
  >;
};

export type CreateMultipleHikesMutationVariables = Exact<{
  input: Array<CreateHikeInput>;
}>;

export type CreateMultipleHikesMutation = { __typename?: 'Mutation' } & {
  createMultipleHikes?: Maybe<
    Array<Maybe<{ __typename?: 'HikeData' } & HikeFieldsFragment>>
  >;
};

export type PointFragmentFragment = { __typename?: 'Point' } & Pick<
  Point,
  'lon' | 'lat'
>;

export type BoundingBoxFieldsFragment = { __typename?: 'BoundingBox' } & {
  NorthEast: { __typename?: 'Point' } & PointFragmentFragment;
  SouthWest: { __typename?: 'Point' } & PointFragmentFragment;
};

export type RouteDataFieldsFragment = { __typename?: 'RouteData' } & Pick<
  RouteData,
  | 'distance'
  | 'uphill'
  | 'downhill'
  | 'track'
  | 'bigBuffer'
  | 'smallBuffer'
  | 'averageTime'
  | 'score'
  | 'difficulty'
  | 'isRoundTrip'
> & {
    poiSearchBox: { __typename?: 'BoundingBox' } & BoundingBoxFieldsFragment;
    bounds: { __typename?: 'BoundingBox' } & BoundingBoxFieldsFragment;
  };

export type HikeConnectionFieldsFragment = {
  __typename?: 'HikeConnection';
} & Pick<HikeConnection, 'nextToken' | 'scannedCount'> & {
    items: Array<{ __typename?: 'HikeData' } & HikeFieldsFragment>;
  };

export type HikeStopFieldsFragment = { __typename?: 'HikeStopData' } & Pick<
  HikeStopData,
  'poiId'
> & {
    description?: Maybe<
      Array<
        { __typename?: 'TextualDescription' } & TextualDescriptionFieldsFragment
      >
    >;
  };

export type PointFieldsFragment = { __typename?: 'Point' } & Pick<
  Point,
  'lat' | 'lon' | 'elevation'
>;

export type CheckpointFieldsFragment = { __typename?: 'Checkpoint' } & Pick<
  Checkpoint,
  'poiId'
> & { point?: Maybe<{ __typename?: 'Point' } & PointFieldsFragment> };

export type HikeFieldsFragment = { __typename?: 'HikeData' } & Pick<
  HikeData,
  | 'id'
  | 'location'
  | 'publicationState'
  | 'featured'
  | 'rate'
  | 'offlineMap'
  | 'tags'
  | 'segments'
> & {
    description: Array<
      { __typename?: 'TextualDescription' } & TextualDescriptionFieldsFragment
    >;
    featuredStops?: Maybe<
      Array<Maybe<{ __typename?: 'HikeStopData' } & HikeStopFieldsFragment>>
    >;
    checkpoints?: Maybe<
      Array<Maybe<{ __typename?: 'Checkpoint' } & CheckpointFieldsFragment>>
    >;
    route: { __typename?: 'RouteData' } & RouteDataFieldsFragment;
  };

export type CreateImageMutationVariables = Exact<{
  input: CreateImageInput;
}>;

export type CreateImageMutation = { __typename?: 'Mutation' } & {
  createImage?: Maybe<{ __typename?: 'Image' } & ImageFieldsFragment>;
};

export type CreateMultipleImagesMutationVariables = Exact<{
  input: Array<CreateImageInput>;
}>;

export type CreateMultipleImagesMutation = { __typename?: 'Mutation' } & {
  createMultipleImages?: Maybe<
    Array<Maybe<{ __typename?: 'Image' } & ImageFieldsFragment>>
  >;
};

export type UpdateImageMutationVariables = Exact<{
  input: UpdateImageInput;
}>;

export type UpdateImageMutation = { __typename?: 'Mutation' } & {
  updateImage?: Maybe<{ __typename?: 'Image' } & ImageFieldsFragment>;
};

export type GetImageQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type GetImageQuery = { __typename?: 'Query' } & {
  getImage?: Maybe<{ __typename?: 'Image' } & ImageFieldsFragment>;
};

export type GetMultipleImagesQueryVariables = Exact<{
  ids: Array<Scalars['ID']>;
}>;

export type GetMultipleImagesQuery = { __typename?: 'Query' } & {
  getMultipleImages?: Maybe<
    { __typename?: 'MultipleImagesResponse' } & {
      data?: Maybe<
        Array<Maybe<{ __typename?: 'Image' } & ImageFieldsFragment>>
      >;
      unprocessedKeys?: Maybe<
        Array<Maybe<{ __typename?: 'IdMap' } & Pick<IdMap, 'id'>>>
      >;
    }
  >;
};

export type DeleteImageMutationVariables = Exact<{
  id: Scalars['ID'];
}>;

export type DeleteImageMutation = { __typename?: 'Mutation' } & {
  deleteImage?: Maybe<{ __typename?: 'Image' } & Pick<Image, 'id'>>;
};

export type ImageInfoFieldsFragment = { __typename?: 'ImageInfo' } & Pick<
  ImageInfo,
  'url' | 'width' | 'height'
>;

export type SourceObjectFieldsFragment = {
  __typename?: 'PoiSourceObject';
} & Pick<PoiSourceObject, 'objectType' | 'objectId'>;

export type ImageFieldsFragment = { __typename?: 'Image' } & Pick<
  Image,
  'id' | 'lat' | 'lon' | 'attributions'
> & {
    original: { __typename?: 'ImageInfo' } & ImageInfoFieldsFragment;
    card: { __typename?: 'ImageInfo' } & ImageInfoFieldsFragment;
    thumbnail: { __typename?: 'ImageInfo' } & ImageInfoFieldsFragment;
    sourceObject: {
      __typename?: 'PoiSourceObject';
    } & SourceObjectFieldsFragment;
    labels?: Maybe<
      Array<Maybe<{ __typename?: 'ImageLabel' } & ImageLabelFieldsFragment>>
    >;
  };

export type ImageLabelFieldsFragment = { __typename?: 'ImageLabel' } & Pick<
  ImageLabel,
  'label' | 'confidence'
>;

export type CreatePoiMutationVariables = Exact<{
  input: CreatePoiInput;
}>;

export type CreatePoiMutation = { __typename?: 'Mutation' } & {
  createPoi?: Maybe<{ __typename?: 'Poi' } & PoiFieldsFragment>;
};

export type CreateMultiplePoisMutationVariables = Exact<{
  input: Array<CreatePoiInput>;
}>;

export type CreateMultiplePoisMutation = { __typename?: 'Mutation' } & {
  createMultiplePois?: Maybe<
    Array<Maybe<{ __typename?: 'Poi' } & PoiFieldsFragment>>
  >;
};

export type UpdatePoiMutationVariables = Exact<{
  input: UpdatePoiInput;
}>;

export type UpdatePoiMutation = { __typename?: 'Mutation' } & {
  updatePoi?: Maybe<{ __typename?: 'Poi' } & PoiFieldsFragment>;
};

export type GetPoiQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type GetPoiQuery = { __typename?: 'Query' } & {
  getPoi?: Maybe<{ __typename?: 'Poi' } & PoiFieldsFragment>;
};

export type GetMultiplePoisQueryVariables = Exact<{
  ids: Array<Scalars['ID']>;
}>;

export type GetMultiplePoisQuery = { __typename?: 'Query' } & {
  getMultiplePois?: Maybe<
    { __typename?: 'MultiplePoisResponse' } & {
      data?: Maybe<Array<Maybe<{ __typename?: 'Poi' } & PoiFieldsFragment>>>;
      unprocessedKeys?: Maybe<
        Array<Maybe<{ __typename?: 'IdMap' } & Pick<IdMap, 'id'>>>
      >;
    }
  >;
};

export type DeletePoiMutationVariables = Exact<{
  id: Scalars['ID'];
}>;

export type DeletePoiMutation = { __typename?: 'Mutation' } & {
  deletePoi?: Maybe<{ __typename?: 'Poi' } & Pick<Poi, 'id'>>;
};

export type PoiFieldsFragment = { __typename?: 'Poi' } & Pick<
  Poi,
  | 'id'
  | 'lat'
  | 'lon'
  | 'elevation'
  | 'types'
  | 'tags'
  | 'address'
  | 'phoneNumber'
  | 'openingHours'
> & {
    description: Array<
      { __typename?: 'TextualDescription' } & TextualDescriptionFieldsFragment
    >;
    sourceObject: Array<
      { __typename?: 'PoiSourceObject' } & PoiSourceObjectFieldsFragment
    >;
  };

export type PoiSourceObjectFieldsFragment = {
  __typename?: 'PoiSourceObject';
} & Pick<PoiSourceObject, 'objectType' | 'languageKey' | 'objectId' | 'url'>;

export type ProcessRouteSegmentMutationVariables = Exact<{
  input: Array<Array<Scalars['Float']>>;
}>;

export type ProcessRouteSegmentMutation = { __typename?: 'Mutation' } & Pick<
  Mutation,
  'processRouteSegment'
>;

export type TextualDescriptionFieldsFragment = {
  __typename?: 'TextualDescription';
} & Pick<
  TextualDescription,
  'languageKey' | 'title' | 'summary' | 'fullDescription' | 'type'
>;

export const ProfileFields = gql`
  fragment profileFields on Profile {
    username
    birthDate
    firstName
    lastName
    languages
    picture
    phone
  }
`;
export const SettingsFields = gql`
  fragment settingsFields on Settings {
    averageSpeed
    lengthUnit
  }
`;
export const CustomerFields = gql`
  fragment customerFields on Customer {
    profile {
      ...profileFields
    }
    settings {
      ...settingsFields
    }
    bookmarkedHikes
  }
  ${ProfileFields}
  ${SettingsFields}
`;
export const PlaceFields = gql`
  fragment placeFields on Place {
    id
    type
    objectId
    lat
    lon
    processed
    banned
  }
`;
export const TextualDescriptionFields = gql`
  fragment textualDescriptionFields on TextualDescription {
    languageKey
    title
    summary
    fullDescription
    type
  }
`;
export const HikeGroupFields = gql`
  fragment hikeGroupFields on HikeGroup {
    id
    description {
      ...textualDescriptionFields
    }
    hikeIds
    publicationState
  }
  ${TextualDescriptionFields}
`;
export const HikeStopFields = gql`
  fragment hikeStopFields on HikeStopData {
    poiId
    description {
      ...textualDescriptionFields
    }
  }
  ${TextualDescriptionFields}
`;
export const PointFields = gql`
  fragment pointFields on Point {
    lat
    lon
    elevation
  }
`;
export const CheckpointFields = gql`
  fragment checkpointFields on Checkpoint {
    poiId
    point {
      ...pointFields
    }
  }
  ${PointFields}
`;
export const PointFragment = gql`
  fragment pointFragment on Point {
    lon
    lat
  }
`;
export const BoundingBoxFields = gql`
  fragment boundingBoxFields on BoundingBox {
    NorthEast {
      ...pointFragment
    }
    SouthWest {
      ...pointFragment
    }
  }
  ${PointFragment}
`;
export const RouteDataFields = gql`
  fragment routeDataFields on RouteData {
    distance
    uphill
    downhill
    track
    bigBuffer
    smallBuffer
    averageTime
    score
    difficulty
    isRoundTrip
    poiSearchBox {
      ...boundingBoxFields
    }
    bounds {
      ...boundingBoxFields
    }
  }
  ${BoundingBoxFields}
`;
export const HikeFields = gql`
  fragment hikeFields on HikeData {
    id
    description {
      ...textualDescriptionFields
    }
    location
    publicationState
    featured
    rate
    offlineMap
    featuredStops {
      ...hikeStopFields
    }
    checkpoints {
      ...checkpointFields
    }
    tags
    route {
      ...routeDataFields
    }
    segments
  }
  ${TextualDescriptionFields}
  ${HikeStopFields}
  ${CheckpointFields}
  ${RouteDataFields}
`;
export const HikeConnectionFields = gql`
  fragment hikeConnectionFields on HikeConnection {
    items {
      ...hikeFields
    }
    nextToken
    scannedCount
  }
  ${HikeFields}
`;
export const ImageInfoFields = gql`
  fragment imageInfoFields on ImageInfo {
    url
    width
    height
  }
`;
export const SourceObjectFields = gql`
  fragment sourceObjectFields on PoiSourceObject {
    objectType
    objectId
  }
`;
export const ImageLabelFields = gql`
  fragment imageLabelFields on ImageLabel {
    label
    confidence
  }
`;
export const ImageFields = gql`
  fragment imageFields on Image {
    id
    lat
    lon
    original {
      ...imageInfoFields
    }
    card {
      ...imageInfoFields
    }
    thumbnail {
      ...imageInfoFields
    }
    sourceObject {
      ...sourceObjectFields
    }
    attributions
    labels {
      ...imageLabelFields
    }
  }
  ${ImageInfoFields}
  ${SourceObjectFields}
  ${ImageLabelFields}
`;
export const PoiSourceObjectFields = gql`
  fragment poiSourceObjectFields on PoiSourceObject {
    objectType
    languageKey
    objectId
    url
  }
`;
export const PoiFields = gql`
  fragment poiFields on Poi {
    id
    description {
      ...textualDescriptionFields
    }
    lat
    lon
    elevation
    types
    tags
    sourceObject {
      ...poiSourceObjectFields
    }
    address
    phoneNumber
    openingHours
  }
  ${TextualDescriptionFields}
  ${PoiSourceObjectFields}
`;
export const ToggleBookmarkedHike = gql`
  mutation ToggleBookmarkedHike($input: ToggleHikeBookmarkInput!) {
    toggleBookmarkedHike(input: $input)
  }
`;
export const UpdateCustomerProfile = gql`
  mutation UpdateCustomerProfile($input: UpdateProfileInput!) {
    updateCustomerProfile(input: $input) {
      ...profileFields
    }
  }
  ${ProfileFields}
`;
export const UpdateCustomerSettings = gql`
  mutation UpdateCustomerSettings($input: UpdateSettingsInput!) {
    updateCustomerSettings(input: $input) {
      ...settingsFields
    }
  }
  ${SettingsFields}
`;
export const GetCustomer = gql`
  query GetCustomer {
    getCustomer {
      ...customerFields
    }
  }
  ${CustomerFields}
`;
export const DeletePlace = gql`
  mutation DeletePlace($objectId: ID!) {
    deletePlace(objectId: $objectId) {
      deleted
    }
  }
`;
export const CreatePlace = gql`
  mutation CreatePlace($input: CreatePlaceInput!) {
    createPlace(input: $input) {
      ...placeFields
    }
  }
  ${PlaceFields}
`;
export const SetPlaceAcceptance = gql`
  mutation SetPlaceAcceptance($id: ID!, $isAccepted: Boolean!) {
    setPlaceAcceptance(id: $id, isAccepted: $isAccepted)
  }
`;
export const SearchPlaceInCircle = gql`
  query SearchPlaceInCircle(
    $lat: Float!
    $lon: Float!
    $radius: Float!
    $type: PlaceType!
    $from: Int
    $pageSize: Int
  ) {
    searchPlaceInCircle(
      lat: $lat
      lon: $lon
      radius: $radius
      type: $type
      from: $from
      pageSize: $pageSize
    ) {
      ...placeFields
    }
  }
  ${PlaceFields}
`;
export const SearchSafeImageInCircle = gql`
  query SearchSafeImageInCircle(
    $lat: Float!
    $lon: Float!
    $radius: Float!
    $from: Int
    $pageSize: Int
  ) {
    searchSafeImageInCircle(
      lat: $lat
      lon: $lon
      radius: $radius
      from: $from
      pageSize: $pageSize
    ) {
      ...placeFields
    }
  }
  ${PlaceFields}
`;
export const SearchPlaceInBox = gql`
  query SearchPlaceInBox($box: BoundingBoxInput!, $type: PlaceType!) {
    searchPlaceInBox(box: $box, type: $type) {
      ...placeFields
    }
  }
  ${PlaceFields}
`;
export const SearchPlaceByTitle = gql`
  query SearchPlaceByTitle(
    $title: String!
    $type: PlaceType!
    $from: Int
    $pageSize: Int
  ) {
    searchPlaceByTitle(
      title: $title
      type: $type
      from: $from
      pageSize: $pageSize
    ) {
      ...placeFields
    }
  }
  ${PlaceFields}
`;
export const SearchPlaceByObjectId = gql`
  query SearchPlaceByObjectId($objectId: ID!) {
    searchPlaceByObjectId(objectId: $objectId) {
      ...placeFields
    }
  }
  ${PlaceFields}
`;
export const CreateHikeGroup = gql`
  mutation CreateHikeGroup($input: CreateHikeGroupInput!) {
    createHikeGroup(input: $input) {
      ...hikeGroupFields
    }
  }
  ${HikeGroupFields}
`;
export const UpdateHikeGroup = gql`
  mutation UpdateHikeGroup($input: UpdateHikeGroupInput!) {
    updateHikeGroup(input: $input) {
      ...hikeGroupFields
    }
  }
  ${HikeGroupFields}
`;
export const ListHikeGroups = gql`
  query ListHikeGroups {
    listHikeGroups {
      items {
        ...hikeGroupFields
      }
      nextToken
    }
  }
  ${HikeGroupFields}
`;
export const GetHikeGroup = gql`
  query GetHikeGroup($id: ID!) {
    getHikeGroup(id: $id) {
      ...hikeGroupFields
    }
  }
  ${HikeGroupFields}
`;
export const CreateHike = gql`
  mutation CreateHike($input: CreateHikeInput!) {
    createHike(input: $input) {
      ...hikeFields
    }
  }
  ${HikeFields}
`;
export const UpdateHike = gql`
  mutation UpdateHike($input: UpdateHikeInput!) {
    updateHike(input: $input) {
      ...hikeFields
    }
  }
  ${HikeFields}
`;
export const DeleteHike = gql`
  mutation DeleteHike($id: ID!) {
    deleteHike(id: $id) {
      id
    }
  }
`;
export const GetHike = gql`
  query GetHike($id: ID!) {
    getHike(id: $id) {
      ...hikeFields
    }
  }
  ${HikeFields}
`;
export const ListHikes = gql`
  query ListHikes {
    listHikes {
      ...hikeConnectionFields
    }
  }
  ${HikeConnectionFields}
`;
export const GetMultipleHikes = gql`
  query GetMultipleHikes($ids: [ID!]!) {
    getMultipleHikes(ids: $ids) {
      data {
        ...hikeFields
      }
      unprocessedKeys {
        id
      }
    }
  }
  ${HikeFields}
`;
export const CreateMultipleHikes = gql`
  mutation CreateMultipleHikes($input: [CreateHikeInput!]!) {
    createMultipleHikes(input: $input) {
      ...hikeFields
    }
  }
  ${HikeFields}
`;
export const CreateImage = gql`
  mutation CreateImage($input: CreateImageInput!) {
    createImage(input: $input) {
      ...imageFields
    }
  }
  ${ImageFields}
`;
export const CreateMultipleImages = gql`
  mutation CreateMultipleImages($input: [CreateImageInput!]!) {
    createMultipleImages(input: $input) {
      ...imageFields
    }
  }
  ${ImageFields}
`;
export const UpdateImage = gql`
  mutation UpdateImage($input: UpdateImageInput!) {
    updateImage(input: $input) {
      ...imageFields
    }
  }
  ${ImageFields}
`;
export const GetImage = gql`
  query GetImage($id: ID!) {
    getImage(id: $id) {
      ...imageFields
    }
  }
  ${ImageFields}
`;
export const GetMultipleImages = gql`
  query GetMultipleImages($ids: [ID!]!) {
    getMultipleImages(ids: $ids) {
      data {
        ...imageFields
      }
      unprocessedKeys {
        id
      }
    }
  }
  ${ImageFields}
`;
export const DeleteImage = gql`
  mutation DeleteImage($id: ID!) {
    deleteImage(id: $id) {
      id
    }
  }
`;
export const CreatePoi = gql`
  mutation CreatePoi($input: CreatePoiInput!) {
    createPoi(input: $input) {
      ...poiFields
    }
  }
  ${PoiFields}
`;
export const CreateMultiplePois = gql`
  mutation CreateMultiplePois($input: [CreatePoiInput!]!) {
    createMultiplePois(input: $input) {
      ...poiFields
    }
  }
  ${PoiFields}
`;
export const UpdatePoi = gql`
  mutation UpdatePoi($input: UpdatePoiInput!) {
    updatePoi(input: $input) {
      ...poiFields
    }
  }
  ${PoiFields}
`;
export const GetPoi = gql`
  query GetPoi($id: ID!) {
    getPoi(id: $id) {
      ...poiFields
    }
  }
  ${PoiFields}
`;
export const GetMultiplePois = gql`
  query GetMultiplePois($ids: [ID!]!) {
    getMultiplePois(ids: $ids) {
      data {
        ...poiFields
      }
      unprocessedKeys {
        id
      }
    }
  }
  ${PoiFields}
`;
export const DeletePoi = gql`
  mutation DeletePoi($id: ID!) {
    deletePoi(id: $id) {
      id
    }
  }
`;
export const ProcessRouteSegment = gql`
  mutation ProcessRouteSegment($input: [[Float!]!]!) {
    processRouteSegment(input: $input)
  }
`;
