import { ApiUrls } from "../../constants/ApiUrls";
import { HTTPService } from "../http-service/http.service";

const baseURL = "https://profitpulse.polestarllp.com:8000/";

export const CEOService = {
  Categories: async () => {
    try {
      const response = await HTTPService.getRequest(
        ApiUrls.CATEGORIES,
        {},
        baseURL
      );
      return response.data.categories;
    } catch (error) {
      return error;
    }
  },
  Brands: async (data) => {
    try {
      const response = await HTTPService.postRequest(
        ApiUrls.BRANDS,
        data,
        baseURL
      );
      return response.data.brands;
    } catch (error) {
      return error;
    }
  },
  Time: async () => {
    try {
      const response = await HTTPService.getRequest(ApiUrls.TIME, {}, baseURL);
      return response.data;
    } catch (error) {
      return error;
    }
  },
  Sales: async (data) => {
    const response = await HTTPService.postRequest(
      ApiUrls.SALES,
      data,
      baseURL
    );
    return response.data;
  },
  ProfitLoss: async (data) => {
    const response = await HTTPService.postRequest(
      ApiUrls.PROFIT_LOSS,
      data,
      baseURL
    );
    return response.data;
  },
  Promotion: async (data) => {
    const response = await HTTPService.postRequest(
      ApiUrls.PROMOTION,
      data,
      baseURL
    );
    return response.data;
  },
  Marketing: async (data) => {
    const response = await HTTPService.postRequest(
      ApiUrls.MARKETING,
      data,
      baseURL
    );
    return response.data;
  },
};
