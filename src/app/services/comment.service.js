import httpService from "./http.service";
const commentEndpoint = "comment/";

const commentService = {
    createComment: async (payload) => {
        try {
            const { data } = await httpService.put(
                commentEndpoint + payload._id,
                payload
            );
            return data;
        } catch (err) {
            console.log("ERROR", err);
            throw err;
        }
    },
    getComments: async (pageId) => {
        const { data } = await httpService.get(commentEndpoint, {
            params: {
                orderBy: '"pageId"',
                equalTo: `"${pageId}"`
            }
        });

        return data;
    },
    removeComment: async (commentId) => {
        const { data } = await httpService.delete(commentEndpoint + commentId);
        console.log(data);
        return data;
    }
};
export default commentService;
