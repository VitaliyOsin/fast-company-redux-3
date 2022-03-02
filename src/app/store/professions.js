import { createSlice } from "@reduxjs/toolkit";
import professionService from "../services/profession.service";

const professionsSlice = createSlice({
    name: "professions",
    initialState: {
        entities: null,
        isLoading: true,
        error: null,
        lastFetch: null
    },
    reducers: {
        professionsRequested: (state) => {
            state.isLoading = true;
        },
        professionsRecieved: (state, action) => {
            state.entities = action.payload;
            state.isLoading = false;
            state.lastFetch = Date.now();
        },
        professionsRequestFailed: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        }
    }
});

const { reducer: professionsReducer, actions } = professionsSlice;
const { professionsRequested, professionsRecieved, professionsRequestFailed } = actions;

function isOutdated(date) {
    return (Date.now() - date) > 600000;
}

export const loadProfessionsList = () => async (dispatch, getState) => {
    const { lastFetch } = getState().professions;
        if (isOutdated(lastFetch)) {
            dispatch(professionsRequested());
            try {
                const { content } = await professionService.get();
                dispatch(professionsRecieved(content));
            } catch (error) {
                dispatch("Ошибка получения качеств: ", professionsRequestFailed(error.message));
            }
     }
};

export const getProfessions = () => (state) => state.professions.entities;
export const getProfessionById = (professionId) => (state) => {
    if (state.professions.entities) {
        return state.professions.entities.find(p => professionId === p._id);
    }
    return "";
};
export const getProfessionsLoadingStatus = () => (state) => state.professions.isLoading;

export default professionsReducer;
