export const ERROR_SAVE_DATA_MESSAGE = 'Error saving data to local storage. Message:';
export const ERROR_LOAD_DATA_MESSAGE = 'Error getting data from local storage. Message:';

export class JetsLocalStorageService {
  getData(key) {
    try {
      const storedData = localStorage.getItem(key);

      if (!storedData) return null;

      const { value, expiry } = JSON.parse(storedData);
      const now = new Date().getTime();

      if (!value || expiry < now) {
        this.removeData(key);
        return null;
      }

      return value;
    } catch (err) {
      console.log(ERROR_LOAD_DATA_MESSAGE, err);
      return null;
    }
  }

  setData(key, value, ttl) {
    try {
      const data = { value };

      if (ttl) data['expiry'] = new Date().getTime() + ttl;

      localStorage.setItem(key, JSON.stringify(data));

      return true;
    } catch (err) {
      console.log(ERROR_SAVE_DATA_MESSAGE, err);
      return false;
    }
  }

  removeData(key) {
    localStorage.removeItem(key);
  }
}
