export default defineEventHandler(async (event) => {
  setResponseStatus(event, 404);
  return {
    status: "fail",
    statusMessage: "Invalid API route",
  };
});
