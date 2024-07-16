// This is the basic structure of an API response.

import type { H3Error } from "h3";

// Use T to define the type of the data property in the response. If no data is returned, use void.
export interface ApiResponse<T = void> {
  status: "ok" | "fail";
  error?: H3Error;
  data?: T;
}
