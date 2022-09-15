class localStorageService {
  ls = window.localStorage;

  setKey(key, value) {
    this.ls.setItem(key, value);
    return true;
  }

  getKey(key) {
    let value = this.ls.getItem(key);
    try {
      return value;
    } catch (e) {
      return null;
    }
  }

  removeKey(key) {
    this.ls.removeItem(key);
  }
}

export default new localStorageService();
