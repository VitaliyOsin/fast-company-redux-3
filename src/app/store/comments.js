import { createSlice } from "@reduxjs/toolkit";
import commentService from "../services/comment.service";

const commentsSlice = createSlice({
    name: "comments",
    initialState: {
        entities: null,
        isLoading: true,
        error: null
    },
    reducers: {
        commentsRequested: (state) => {
            state.isLoading = true;
        },
        commentsRecieved: (state, action) => {
            state.entities = action.payload;
            state.isLoading = false;
        },
        commentsRequestFailed: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        },
        commentRemoned: (state, action) => {
            state.entities = state.entities.filter(
                (c) => c._id !== action.payload
            );
        },
        commentCreated: (state, action) => {
            state.entities.push(action.payload);
        }
    }
});

const { reducer: commentsReducer, actions } = commentsSlice;
const {
    commentsRequested,
    commentsRecieved,
    commentsRequestFailed,
    commentRemoned,
    commentCreated
} = actions;

export const loadCommentsList = (userId) => async (dispatch) => {
    dispatch(commentsRequested());
    try {
        const { content } = await commentService.getComments(userId);
        dispatch(commentsRecieved(content));
    } catch (error) {
        dispatch(
            "Ошибка получения качеств: ",
            commentsRequestFailed(error.message)
        );
    }
};

export const removeComment = (id) => async (dispatch) => {
    const { content } = await commentService.removeComment(id);
    console.log(content);
    dispatch(commentRemoned(id));
};

export const createComment = (data) => async (dispatch) => {
    try {
        const { content } = await commentService.createComment(data);
        dispatch(commentCreated(content));
    } catch (err) {
        dispatch(
            "Ошибка создания комментария: ",
            commentsRequestFailed(err.message)
        );
    }
};

export const getComments = () => (state) => state.comments.entities;
export const getCommentsLoadingStatus = () => (state) =>
    state.comments.isLoading;

export default commentsReducer;
