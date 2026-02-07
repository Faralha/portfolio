import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

/**
 * Get all image files from a public folder path
 * @param folderPath - Path relative to public folder (e.g., "/projects/hcq-lms")
 * @returns Array of image filenames sorted alphabetically
 */
export function getImagesFromFolder(folderPath: string): string[] {
  try {
    // Remove leading slash and construct full path
    const relativePath = folderPath.startsWith('/') ? folderPath.slice(1) : folderPath
    const fullPath = path.join(process.cwd(), 'public', relativePath)

    // Check if folder exists
    if (!fs.existsSync(fullPath)) {
      console.warn(`Folder not found: ${fullPath}`)
      return []
    }

    // Read directory contents
    const files = fs.readdirSync(fullPath)

    // Filter for image files
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.avif']
    const images = files.filter((file) => {
      const ext = path.extname(file).toLowerCase()
      return imageExtensions.includes(ext)
    })

    // Sort alphabetically
    return images.sort()
  }
  catch (error) {
    console.error(`Error reading folder ${folderPath}:`, error)
    return []
  }
}
