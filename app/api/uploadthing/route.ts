import { createRouteHandler } from "uploadthing/next"
import { ourFileRouter } from "./core"

// Tạo route handler cho uploadthing
export const { GET, POST } = createRouteHandler({
    router: ourFileRouter,
})