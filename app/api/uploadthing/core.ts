import { createUploadthing, type FileRouter } from "uploadthing/next"
import { getUserFromRequest } from "@/lib/auth"
import { getAdminFromRequest } from "@/lib/admin-auth"
import { NextRequest } from "next/server"

const f = createUploadthing()

// FileRouter cho app
export const ourFileRouter = {
  // Image uploader cho products (Admin only)
  productImage: f({ image: { maxFileSize: "4MB", maxFileCount: 10 } })
    .middleware(async ({ req }) => {
      // Verify admin
      const admin = getAdminFromRequest(req as NextRequest)
      
      if (!admin) {
        throw new Error("Admin access required")
      }

      return { userId: admin.userId }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Product image uploaded by:", metadata.userId)
      console.log("File URL:", file.url)

      return { uploadedBy: metadata.userId, url: file.url }
    }),

  // Image uploader cho reviews (User)
  reviewImage: f({ image: { maxFileSize: "2MB", maxFileCount: 5 } })
    .middleware(async ({ req }) => {
      const user = await getUserFromRequest(req as NextRequest)
      
      if (!user) {
        throw new Error("Unauthorized")
      }

      return { userId: user.userId }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Review image uploaded by:", metadata.userId)
      console.log("File URL:", file.url)

      return { uploadedBy: metadata.userId, url: file.url }
    }),

  // Avatar uploader (User)
  avatar: f({ image: { maxFileSize: "1MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      const user = await getUserFromRequest(req as NextRequest)
      
      if (!user) {
        throw new Error("Unauthorized")
      }

      return { userId: user.userId }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Avatar uploaded by:", metadata.userId)
      console.log("File URL:", file.url)

      return { uploadedBy: metadata.userId, url: file.url }
    }),

  // Payment proof uploader (User)
  paymentProof: f({ image: { maxFileSize: "2MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      const user = await getUserFromRequest(req as NextRequest)
      
      if (!user) {
        throw new Error("Unauthorized")
      }

      return { userId: user.userId }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Payment proof uploaded by:", metadata.userId)
      console.log("File URL:", file.url)

      return { uploadedBy: metadata.userId, url: file.url }
    }),

  // Category image uploader (Admin)
  categoryImage: f({ image: { maxFileSize: "2MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      const admin = getAdminFromRequest(req as NextRequest)
      
      if (!admin) {
        throw new Error("Admin access required")
      }

      return { userId: admin.userId }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Category image uploaded by:", metadata.userId)
      console.log("File URL:", file.url)

      return { uploadedBy: metadata.userId, url: file.url }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
   