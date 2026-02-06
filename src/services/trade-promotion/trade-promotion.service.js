import { ApiUrls } from "../../constants/ApiUrls";
import { HTTPService } from "../http-service/http.service";

const baseURL = "https://profitpulse.polestarllp.com:8001/";

export const TradePromotionService = {
  //   PRODUCTS: "/tradepromotion/products",

  Budget: async (data) => {
    try {
      const response = await HTTPService.postRequest(
        ApiUrls.BUDGET,
        data,
        baseURL
      );
      return response.data;
    } catch (error) {
      return error;
    }
  },
  topChannels: async (data) => {
    try {
      const response = await HTTPService.postRequest(
        ApiUrls.TOP_CHANNELS,
        data,
        baseURL
      );
      return response.data;
    } catch (error) {
      return error;
    }
  },
  lowChannels: async (data) => {
    try {
      const response = await HTTPService.postRequest(
        ApiUrls.LOW_CHANNELS,
        data,
        baseURL
      );
      return response.data;
    } catch (error) {
      return error;
    }
  },
  channelWiseSpend: async (data) => {
    try {
      const response = await HTTPService.postRequest(
        ApiUrls.CHANNEL_WISE_SPEND,
        data,
        baseURL
      );
      return response.data;
    } catch (error) {
      return error;
    }
  },
  productWiseSpend: async (data) => {
    try {
      const response = await HTTPService.postRequest(
        ApiUrls.PRODUCT_WISE_SPEND,
        data,
        baseURL
      );
      return response.data;
    } catch (error) {
      return error;
    }
  },
  noConstraint: async (data) => {
    try {
      const response = await HTTPService.postRequest(
        ApiUrls.NO_CONSTRAINTS__SCREEN,
        data,
        baseURL
      );
      return response.data;
    } catch (error) {
      return error;
    }
  },
  Optimisation: async (data) => {
    try {
      const response = await HTTPService.postRequest(
        ApiUrls.OPTIMISATION,
        data,
        baseURL
      );
      return response.data;
    } catch (error) {
      return error;
    }
  },
  OnTrack: async (data) => {
    try {
      const response = await HTTPService.postRequest(
        ApiUrls.ON_TRACK,
        data,
        baseURL
      );
      return response.data;
    } catch (error) {
      return error;
    }
  },
  Channels: async () => {
    try {
      const response = await HTTPService.getRequest(
        ApiUrls.CHANNELS,
        {},
        baseURL
      );
      return response.data.channels;
    } catch (error) { }
  },
  Products: async (data) => {
    try {
      const response = await HTTPService.postRequest(
        ApiUrls.PRODUCTS,
        data,
        baseURL
      );
      return response.data.Products;
    } catch (error) { }
  },
  UnderHood: async (data) => {
    try {
      const response = await HTTPService.postRequest(
        ApiUrls.UNDER_HOOD,
        data,
        baseURL
      );
      return response.data;
    } catch (error) { }
  },
  productsWithoutChannels: async (data) => {
    try {
      const response = await HTTPService.postRequest(
        ApiUrls.PRODUCTS_WITHOUT_CHANNELS,
        data,
        baseURL
      );
      return response.data.Products;
    } catch (error) { }
  },
  changeDataChannel: async (data) => {
    try {
      const response = await HTTPService.postRequest(
        ApiUrls.CHANGE_DATA_CHANNEL,
        data,
        baseURL
      );
      return response.data;
    } catch (error) { }
  },
  getSuggestedPromotionData: async () => {
    try {
      const response = await HTTPService.getRequest(
        `/api/anaplan/runIntegration`,
        {},
        import.meta.env.VITE_API_LOCALHOSTURL || "http://localhost:3000"
      );
      return response?.data?.jsonData;
    } catch (error) { }
  },
};
