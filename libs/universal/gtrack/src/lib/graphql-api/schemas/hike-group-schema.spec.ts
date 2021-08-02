import { PublicationState } from '../api/graphql';
import {
  isCreateHikeGroupInput,
  isHikeGroup,
  validateCreateHikeGroupInput,
  validateHikeGroup,
} from './hike-group-schema';

describe('Test the hike group schema', () => {
  it('it should reconstruct the HikeGroup', async () => {
    const hikeGroup = {
      id: 'bd1e9454-aeb5-488f-9e0b-1a5b512fe1bf',
      description: [
        {
          languageKey: 'en_US',
          title: 'TITLE',
          type: 'html',
        },
      ],
      publicationState: PublicationState.draft,
    };

    expect(await validateHikeGroup(hikeGroup).toPromise()).toMatchSnapshot();
    expect(isHikeGroup(hikeGroup)).toEqual(true);
  });

  it('it should report the wrong fields', done => {
    const hikeGroup = {
      id: '',
      description: {
        languageKey: 'en_US',
      },
    };

    validateHikeGroup(hikeGroup).subscribe(undefined, err => {
      expect(err).toMatchSnapshot();
      expect(isHikeGroup(hikeGroup)).toEqual(false);
      done();
    });
  });
});

describe('Test the create hike group input schema', () => {
  it('it should reconstruct the CreateHikeGroupInput', async () => {
    const hikeGroup = {
      description: [
        {
          languageKey: 'en_US',
          title: 'The title',
          type: 'markdown',
        },
      ],
      hikeIds: ['hikeid-1'],
      publicationState: PublicationState.draft,
    };

    expect(
      await validateCreateHikeGroupInput(hikeGroup).toPromise()
    ).toMatchSnapshot();
    expect(isCreateHikeGroupInput(hikeGroup)).toEqual(true);
  });

  it('it should report the wrong fields', done => {
    const hikeGroup = {
      id: '',
      description: {
        languageKey: 'en_US',
      },
    };

    validateCreateHikeGroupInput(hikeGroup).subscribe(undefined, err => {
      expect(err).toMatchSnapshot();
      expect(isCreateHikeGroupInput(hikeGroup)).toEqual(false);
      done();
    });
  });
});
