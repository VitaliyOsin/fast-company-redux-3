import { createSlice } from "@reduxjs/toolkit";
import qualityService from "../services/qaulity.service";

const qualitiesSlice = createSlice({
    name: "qualities",
    initialState: {
        entities: null,
        isLoading: true,
        error: null,
        lastFetch: null
    },
    reducers: {
        qualitiesRequested: (state) => {
            state.isLoading = true;
        },
        qualitiesRecieved: (state, action) => {
            state.entities = action.payload;
            state.isLoading = false;
            state.lastFetch = Date.now();
        },
        qualitiesRequestFailed: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        }
    }
});

const { reducer: qualitiesReducer, actions } = qualitiesSlice;
const { qualitiesRequested, qualitiesRecieved, qualitiesRequestFailed } = actions;

function isOutdated(date) {
    return (Date.now() - date) > 600000;
}

export const loadQualitiesList = () => async (dispatch, getState) => {
    const { lastFetch } = getState().qualities;
        if (isOutdated(lastFetch)) {
            dispatch(qualitiesRequested());

            try {
                const { content } = await qualityService.fetchAll();
                dispatch(qualitiesRecieved(content));
            } catch (error) {
                dispatch("Ошибка получения качеств: ", qualitiesRequestFailed(error.message));
            }
     }
};

export const getQualities = () => (state) => state.qualities.entities;
export const getQualitiesByIds = (qualityIds) => (state) => {
    if (state.qualities.entities) {
        return state.qualities.entities.filter(q => qualityIds.includes(q._id));
    }
    return [];
};
export const getQualitiesLoadingStatus = () => (state) => state.qualities.isLoading;

export default qualitiesReducer;
