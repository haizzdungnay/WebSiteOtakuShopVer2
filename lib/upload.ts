import { UTApi } from "uploadthing/server"

const utapi = new UTApi()

export async function deleteFileByUrl(url: string): Promise<void> {
  try {
    // Extract file key from UploadThing URL
    // Format: https://utfs.io/f/abc-123-xyz.png
    const match = url.match(/\/f\/(.+)$/)
    
    if (!match || !match[1]) {
      throw new Error('Invalid UploadThing URL format')
    }
    
    const fileKey = match[1]
    await utapi.deleteFiles(fileKey)
    
  } catch (error) {
    console.error('Delete file from UploadThing error:', error)
    throw error
  }
}
