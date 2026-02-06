import { configureStore } from '@reduxjs/toolkit';
import pageReducer from './pageSlice';
import businessOverviewReducer from './reducers/businessOverviewReducer';
import tradePromotionReducer from './reducers/tradePromotionReducer';
import tpOptimisationReducer from './reducers/tpOptimisation';
import teresaReducer from './reducers/teresaReducer';

const rootReducer = {
    page: pageReducer,
    businessOverview: businessOverviewReducer,
    tradePromotion: tradePromotionReducer,
    tpOptimisation: tpOptimisationReducer,
    teresa: teresaReducer,
};

export const store = configureStore({
    reducer: rootReducer,
});

export default store;
