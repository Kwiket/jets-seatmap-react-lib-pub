import { ERROR_LOAD_DATA_MESSAGE, ERROR_SAVE_DATA_MESSAGE, JetsLocalStorageService } from './localStorage';

const jetsLocalStorageService = new JetsLocalStorageService();
const SECOND_IN_MILLISECONDS = 1000;

describe('JetsLocalStorageService', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      },
    });
  });

  describe('getData', () => {
    it('should return the value of the key-value pair from localStorage if set and not expired', () => {
      localStorage.getItem.mockReturnValue(JSON.stringify({
        value: 'the value',
        expiry: Date.now() + SECOND_IN_MILLISECONDS,
      }));

      const result = jetsLocalStorageService.getData('key');

      expect(result).toEqual('the value');
      expect(localStorage.getItem).toHaveBeenCalledWith('key');
      expect(localStorage.getItem).toHaveBeenCalledTimes(1);
    });

    it('should return null if the key-value pair is not set in localStorage', () => {
      localStorage.getItem.mockReturnValue(null);

      const result = jetsLocalStorageService.getData('key');

      expect(result).toBeNull();
      expect(localStorage.getItem).toHaveBeenCalledWith('key');
      expect(localStorage.getItem).toHaveBeenCalledTimes(1);
    });

    it('should return null if the key-value pair has expired and remove the item from localStorage', () => {
      localStorage.getItem.mockReturnValue(JSON.stringify({
        value: 'the value',
        expiry: Date.now() - SECOND_IN_MILLISECONDS,
      }));

      const result = jetsLocalStorageService.getData('key');

      expect(result).toBeNull();
      expect(localStorage.getItem).toHaveBeenCalledWith('key');
      expect(localStorage.getItem).toHaveBeenCalledTimes(1);
      expect(localStorage.removeItem).toHaveBeenCalledWith('key');
      expect(localStorage.removeItem).toHaveBeenCalledTimes(1);
    });

    it('should return null and remove the item from localStorage if the key-value pair exists but the value is not set', () => {
      localStorage.getItem.mockReturnValue(JSON.stringify({
        value: null,
        expiry: Date.now() + SECOND_IN_MILLISECONDS,
      }));

      const result = jetsLocalStorageService.getData('key');

      expect(result).toBeNull();
      expect(localStorage.getItem).toHaveBeenCalledWith('key');
      expect(localStorage.getItem).toHaveBeenCalledTimes(1);
      expect(localStorage.removeItem).toHaveBeenCalledWith('key');
      expect(localStorage.removeItem).toHaveBeenCalledTimes(1);
    });

    it('should return null if something went wrong and log a message in the console', () => {
      localStorage.getItem.mockReturnValue(JSON.stringify({
        value: 'the value',
        expiry: Date.now() + SECOND_IN_MILLISECONDS,
      }));
      const jsonParseError = new Error('json parse error');
      jest.spyOn(JSON, 'parse').mockImplementation(() => {
        throw jsonParseError;
      });
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {
      });

      const result = jetsLocalStorageService.getData('key');

      expect(result).toBeNull();
      expect(localStorage.getItem).toHaveBeenCalledWith('key');
      expect(localStorage.getItem).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).toHaveBeenCalledWith(ERROR_LOAD_DATA_MESSAGE, jsonParseError);
    });
  });

  describe('setData', () => {
    it('should set the key-value pair in localStorage with expiry if provided and return true', () => {
      const fakeNow = new Date('2025-01-30T12:00:00Z').getTime();
      jest.spyOn(Date.prototype, 'getTime').mockImplementation(() => fakeNow);

      const result = jetsLocalStorageService.setData('key', 'the value', SECOND_IN_MILLISECONDS);

      expect(result).toEqual(true);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'key',
        JSON.stringify({
          value: 'the value',
          expiry: (fakeNow + SECOND_IN_MILLISECONDS),
        }));
      expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    });

    it('should not set the expiry if it is not provided and return true', () => {
      const result = jetsLocalStorageService.setData('key', 'the value');

      expect(result).toEqual(true);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'key',
        JSON.stringify({
          value: 'the value',
        }));
      expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    });

    it('should return null if something went wrong and log a message in the console', () => {
      const jsonStringifyError = new Error('json stringify error');
      jest.spyOn(JSON, 'stringify').mockImplementation(() => {
        throw jsonStringifyError;
      });
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {
      });

      const result = jetsLocalStorageService.setData('key', 'value');

      expect(result).toEqual(false);
      expect(consoleLogSpy).toHaveBeenCalledWith(ERROR_SAVE_DATA_MESSAGE, jsonStringifyError);
      expect(localStorage.setItem).toHaveBeenCalledTimes(0);
    });
  });

  describe('removeData', () => {
    it('should remove the item from localStorage', () => {
      jetsLocalStorageService.removeData('key');

      expect(localStorage.removeItem).toHaveBeenCalledWith('key');
      expect(localStorage.removeItem).toHaveBeenCalledTimes(1);
    });
  });
});
