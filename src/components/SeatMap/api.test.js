import { JetsSeatMapApiService } from './api';
import { cabin, entertainment, power, wifi, seatDetails, cabinItem } from './__fixtures__/seatMapApiPostDataResponse';
import { flightDetails } from './__fixtures__/seatMapApiGetPlaneFeatures';

jest.mock('./api', () => {
  const module = jest.requireActual('./api');
  return {
    ...module,
    JetsSeatMapApiService: class extends module.JetsSeatMapApiService {
      postData = jest.fn();
    },
  };
});

const api = new JetsSeatMapApiService('appId', 'key', 'url');

describe('JetsSeatMapApiService', () => {
  describe('when the getPlaneFeatures function is called', () => {
    beforeEach(() => {
      const singleCabinResponseFixture = [
        {
          id: '1111',
          cabin: cabin(),
          entertainment: entertainment(),
          power: power(),
          wifi: wifi(),
          seatDetails: seatDetails(),
        },
      ];
      api.postData.mockImplementation(() => singleCabinResponseFixture);
    });

    it('should call postData with the correct parameters', async () => {
      const flightFixture = flightDetails();

      await api.getPlaneFeatures(flightFixture, 'EN', 'metric');

      expect(api.postData).toHaveBeenCalledWith('flight/features/plane/seatmap', {
        flight: flightFixture,
        lang: 'EN',
        units: 'metric',
      });
    });

    it('should call postData with the default language if the provided language is not supported', async () => {
      const flightFixture = flightDetails();

      await api.getPlaneFeatures(flightFixture, 'A', 'metric');

      expect(api.postData).toHaveBeenCalledWith('flight/features/plane/seatmap', {
        flight: flightFixture,
        lang: 'EN',
        units: 'metric',
      });
    });
  });

  describe('when a specific cabin class (F, B, P or E) is provided', () => {
    it('should return the correct information when all the information is present', async () => {
      const flightFixture = flightDetails({ cabinClass: 'E' });
      const singleCabinResponseFixture = [
        {
          id: '1111',
          cabin: cabin(),
          entertainment: entertainment(),
          power: power(),
          wifi: wifi(),
          seatDetails: seatDetails(),
        },
      ];
      api.postData.mockImplementation(() => singleCabinResponseFixture);

      const result = await api.getPlaneFeatures(flightFixture);

      expect(result).toEqual({
        E: {
          cabin: singleCabinResponseFixture[0].cabin,
          entertainment: singleCabinResponseFixture[0].entertainment,
          power: singleCabinResponseFixture[0].power,
          wifi: singleCabinResponseFixture[0].wifi,
        },
        seatDetails: singleCabinResponseFixture[0].seatDetails,
      });
    });

    it('should throw if no seat details were returned from the API', async () => {
      const flightFixture = flightDetails({ cabinClass: 'E' });
      const singleCabinResponseFixture = [
        {
          id: '1111',
          cabin: cabin(),
          entertainment: entertainment(),
          power: power(),
          wifi: wifi(),
        },
      ];
      api.postData.mockImplementation(() => singleCabinResponseFixture);

      await expect(api.getPlaneFeatures(flightFixture)).rejects.toThrow('data is not found for the flight: 1111');
    });

    it('should throw if the response item has an error', async () => {
      const flightFixture = flightDetails({ cabinClass: 'E' });
      const singleCabinResponseFixture = [
        {
          id: '1111',
          cabin: cabin(),
          entertainment: entertainment(),
          power: power(),
          wifi: wifi(),
          error: 'Something went wrong!',
        },
      ];
      api.postData.mockImplementation(() => singleCabinResponseFixture);

      await expect(api.getPlaneFeatures(flightFixture)).rejects.toThrow('Something went wrong!');
    });
  });

  describe('when the whole plane (cabin class A) is provided', () => {
    it('should return the correct information when all the information is present', async () => {
      const flightFixture = flightDetails({ cabinClass: 'A' });
      const allCabinsResponseFixture = [
        {
          id: '1111',
          seatDetails: seatDetails(),
        },
        cabinItem({ id: '1111:F' }),
        cabinItem({ id: '1111:B' }),
        cabinItem({ id: '1111:P' }),
        cabinItem({ id: '1111:E' }),
      ];
      api.postData.mockImplementation(() => allCabinsResponseFixture);

      const result = await api.getPlaneFeatures(flightFixture);

      expect(result).toEqual({
        seatDetails: allCabinsResponseFixture[0].seatDetails,
        F: {
          cabin: allCabinsResponseFixture[1].cabin,
          entertainment: allCabinsResponseFixture[1].entertainment,
          power: allCabinsResponseFixture[1].power,
          wifi: allCabinsResponseFixture[1].wifi,
        },
        B: {
          cabin: allCabinsResponseFixture[2].cabin,
          entertainment: allCabinsResponseFixture[2].entertainment,
          power: allCabinsResponseFixture[2].power,
          wifi: allCabinsResponseFixture[2].wifi,
        },
        P: {
          cabin: allCabinsResponseFixture[3].cabin,
          entertainment: allCabinsResponseFixture[3].entertainment,
          power: allCabinsResponseFixture[3].power,
          wifi: allCabinsResponseFixture[3].wifi,
        },
        E: {
          cabin: allCabinsResponseFixture[4].cabin,
          entertainment: allCabinsResponseFixture[4].entertainment,
          power: allCabinsResponseFixture[4].power,
          wifi: allCabinsResponseFixture[4].wifi,
        },
      });
    });

    it('should throw if no seat details were returned from the API', async () => {
      const flightFixture = flightDetails({ cabinClass: 'A' });
      const allCabinsResponseFixture = [
        cabinItem({ id: '1111:F' }),
        cabinItem({ id: '1111:B' }),
        cabinItem({ id: '1111:P' }),
        cabinItem({ id: '1111:E' }),
      ];
      api.postData.mockImplementation(() => allCabinsResponseFixture);

      await expect(api.getPlaneFeatures(flightFixture)).rejects.toThrow('data is not found for the flight: 1111');
    });

    it('should throw if the seat details response item has an error', async () => {
      const flightFixture = flightDetails({ cabinClass: 'E' });
      const allCabinsResponseFixture = [
        {
          id: '1111',
          seatDetails: seatDetails(),
          error: 'Something went wrong!',
        },
        cabinItem({ id: '1111:F' }),
        cabinItem({ id: '1111:B' }),
        cabinItem({ id: '1111:P' }),
        cabinItem({ id: '1111:E' }),
      ];
      api.postData.mockImplementation(() => allCabinsResponseFixture);

      await expect(api.getPlaneFeatures(flightFixture)).rejects.toThrow('Something went wrong!');
    });
  });

  describe('when a cabin class is provided that is not supported', () => {
    it('should return...', async () => {
      const flightFixture = flightDetails({ cabinClass: 'Q' });
      const errorResponse = {
        statusCode: 400,
        message: 'cabinClass must be one of the following values: A, F, B, P, E',
        error: 'Bad Request',
      };
      api.postData.mockImplementation(() => errorResponse);

      await expect(api.getPlaneFeatures(flightFixture)).rejects.toThrow();
    });
  });
});
