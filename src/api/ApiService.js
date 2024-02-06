import axios from "axios";

class ApiService {
  constructor(baseURL) {
    this.api = axios.create({
      baseURL,
    });
  }
  // GET Request
  async get(endpoint, params = {}) {
    try {
      const response = await this.api.get(endpoint, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // POST Request
  async post(endpoint, data = {}, config = {}) {
    try {
      const response = await this.api.post(endpoint, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // PUT Request
  async put(endpoint, data = {}, config = {}) {
    try {
      const response = await this.api.put(endpoint, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // DELETE Request
  async delete(endpoint) {
    try {
      const response = await this.api.delete(endpoint);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default ApiService;
