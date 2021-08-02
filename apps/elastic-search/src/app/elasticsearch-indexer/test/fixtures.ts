export const eventFixture = () => ({
  Records: [
    {
      eventID: '5583be2c9f849c484cbe18acc08d2f74',
      eventName: 'REMOVE',
      eventVersion: '1.1',
      eventSource: 'aws:dynamodb',
      awsRegion: 'us-east-1',
      dynamodb: {
        ApproximateCreationDateTime: 1603712362,
        Keys: {
          id: {
            S: '47.8334721-19.9675629',
          },
        },
        OldImage: {
          elevation: {
            N: '376.0150451660156',
          },
          createdAt: {
            S: '2020-10-26T00:44:58.574Z',
          },
          types: {
            L: [
              {
                S: 'tourism:information',
              },
            ],
          },
          description: {
            L: [
              {
                M: {
                  type: {
                    S: 'markdown',
                  },
                  languageKey: {
                    S: 'en_US',
                  },
                },
              },
            ],
          },
          lon: {
            N: '19.9675629',
          },
          sourceObject: {
            L: [
              {
                M: {
                  languageKey: {
                    S: 'en_US',
                  },
                  objectId: {
                    S: '2466025056',
                  },
                  objectType: {
                    S: 'osmTourism',
                  },
                },
              },
            ],
          },
          id: {
            S: '47.8334721-19.9675629',
          },
          lat: {
            N: '47.8334721',
          },
        },
        SequenceNumber: '7981400000000029758433293',
        SizeBytes: 268,
        StreamViewType: 'NEW_AND_OLD_IMAGES',
      },
      eventSourceARN:
        'arn:aws:dynamodb:us-east-1:697486207432:table/gtrack-staging-pois/stream/2020-10-24T20:26:25.353',
    },
  ],
});
