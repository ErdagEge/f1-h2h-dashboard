import { getDrivers, getHeadToHead } from './f1Api';

describe('getDrivers', () => {
  it('parses drivers from API response', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        MRData: {
          DriverTable: {
            Drivers: [
              {
                driverId: 'hamilton',
                givenName: 'Lewis',
                familyName: 'Hamilton',
                dateOfBirth: '1985-01-07',
                nationality: 'British',
              },
            ],
          },
        },
      }),
    }) as unknown as Response;

    const drivers = await getDrivers('2023');
    expect(drivers).toHaveLength(1);
    expect(drivers[0].driverId).toBe('hamilton');
  });
});

describe('getHeadToHead', () => {
  it('counts wins correctly', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        MRData: {
          RaceTable: {
            season: '2022',
            Races: [
              {
                season: '2022',
                round: '1',
                raceName: 'Race 1',
                date: '2022-03-20',
                Results: [
                  {
                    position: '1',
                    Driver: {
                      driverId: 'driver1',
                      givenName: '',
                      familyName: '',
                      dateOfBirth: '',
                      nationality: '',
                    },
                  },
                  {
                    position: '2',
                    Driver: {
                      driverId: 'driver2',
                      givenName: '',
                      familyName: '',
                      dateOfBirth: '',
                      nationality: '',
                    },
                  },
                ],
              },
              {
                season: '2022',
                round: '2',
                raceName: 'Race 2',
                date: '2022-04-03',
                Results: [
                  {
                    position: '2',
                    Driver: {
                      driverId: 'driver1',
                      givenName: '',
                      familyName: '',
                      dateOfBirth: '',
                      nationality: '',
                    },
                  },
                  {
                    position: '1',
                    Driver: {
                      driverId: 'driver2',
                      givenName: '',
                      familyName: '',
                      dateOfBirth: '',
                      nationality: '',
                    },
                  },
                ],
              },
            ],
          },
        },
      }),
    }) as unknown as Response;

    const stats = await getHeadToHead('2022', 'driver1', 'driver2');
    expect(stats.driver1Wins).toBe(1);
    expect(stats.driver2Wins).toBe(1);
    expect(stats.ties).toBe(0);
  });
});
