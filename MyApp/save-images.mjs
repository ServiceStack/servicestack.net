#!/usr/bin/env bun

import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync, unlinkSync } from 'fs';
import { join, basename, dirname, parse, resolve } from 'path';
import { spawn } from 'child_process';

// Configuration
const MARKDOWN_DIR = './_posts';           // Directory containing markdown files
const OUTPUT_DIR = './wwwroot/img/posts';  // Directory to save converted images
const QUALITY = 80;                        // WebP quality (0-100)
const FFMPEG_PATH = 'ffmpeg';              // Path to ffmpeg executable

// Example image URL for testing
// https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?crop=entropy&fit=crop&h=1000&w=2000

/**
 * Simple function to extract frontmatter from markdown content
 * @param {string} content - Markdown file content
 * @returns {Object} - Parsed frontmatter as an object
 */
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return {};
  }
  
  const frontmatterText = match[1];
  const frontmatter = {};
  
  // Split by lines and process each key-value pair
  frontmatterText.split('\n').forEach(line => {
    // Skip empty lines
    if (!line.trim()) return;
    
    // Find the first colon to separate key and value
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) return;
    
    const key = line.slice(0, colonIndex).trim();
    // Get the value and remove quotes if present
    let value = line.slice(colonIndex + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || 
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    
    frontmatter[key] = value;
  });
  
  return frontmatter;
}

/**
 * Convert image to WebP using ffmpeg
 * @param {string} inputPath - Path to input image file
 * @param {string} outputPath - Path to output WebP file
 * @param {number} quality - WebP quality (0-100)
 * @returns {Promise<void>}
 */
function convertToWebP(inputPath, outputPath, quality) {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn(FFMPEG_PATH, [
      '-i', inputPath,
      // '-c:v', 'libwebp',
      // '-quality', quality.toString(),
      // '-y',  // Overwrite output files without asking
      outputPath
    ]);
    
    let errorOutput = '';
    
    ffmpeg.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });
    
    ffmpeg.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`ffmpeg exited with code ${code}: ${errorOutput}`));
      } else {
        resolve();
      }
    });
    
    ffmpeg.on('error', (err) => {
      reject(new Error(`Failed to start ffmpeg: ${err.message}`));
    });
  });
}

async function main() {
  console.log('Starting markdown image conversion process...');
  
  // Ensure output directory exists
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`Created output directory: ${OUTPUT_DIR}`);
  }
  
  // Create a temporary directory for downloaded images
  const TEMP_DIR = join(OUTPUT_DIR, 'temp');
  if (!existsSync(TEMP_DIR)) {
    mkdirSync(TEMP_DIR, { recursive: true });
  }
  
  try {
    // Get all markdown files in the directory
    const mdFiles = readdirSync(MARKDOWN_DIR)
      .filter(file => file.endsWith('.md'));
    
    console.log(`Found ${mdFiles.length} markdown files to process`);
    
    // Process each markdown file
    for (const mdFile of mdFiles) {
      const mdPath = join(MARKDOWN_DIR, mdFile);
      const mdFileName = basename(mdFile).slice(0, -3);
      const slug = mdFileName.substring(mdFileName.indexOf('_') + 1);
      console.log(`Processing: ${mdFile} (${slug})`);
      
      try {
        // Read and parse the frontmatter
        const fileContent = readFileSync(mdPath, 'utf8');
        const frontmatter = parseFrontmatter(fileContent);
        
        // Check if the image frontmatter exists
        if (!frontmatter.image) {
          console.log(`  No image frontmatter found in ${mdFile}, skipping`);
          continue;
        }
        
        const imageUrl = frontmatter.image.trim();
        if (!imageUrl.startsWith('https://')) {
          console.log(`  Ignoring non-HTTPS image URL: ${imageUrl}`);
          continue;
        }

        console.log(`  Found image URL: ${imageUrl}`);
        
        // Generate output filename (use original filename but with .webp extension)
        const originalFilename = basename(imageUrl);
        const outputDir = join(OUTPUT_DIR, slug);

        // Ensure output directory for the specific slug exists
        if (!existsSync(outputDir)) {
          mkdirSync(outputDir, { recursive: true });
        }
        const outputPath = join(outputDir, 'bg.webp');
        if (existsSync(outputPath)) {
          const relativePath = `./img/posts/${slug}/bg.webp`;
          console.log(`  File already exists: ${relativePath}, skipping conversion`);

          console.log(`  Updating ${mdFile} with existing image path: ${relativePath}`);
          const updatedContent = fileContent.replace(imageUrl, relativePath);
          writeFileSync(mdPath, updatedContent, 'utf8');
          continue;
        }
        
        // Create a temporary file path for the downloaded image
        const tempFilePath = join(TEMP_DIR, originalFilename);
        
        // Download the image
        console.log(`  Downloading image from: ${imageUrl}`);
        console.log(`  Saving to: ${outputPath}`);
        try {
          const response = await fetch(imageUrl);
          if (!response.ok) {
            throw new Error(`Failed to download image: ${response.status} ${response.statusText}`);
          }
          
          const arrayBuffer = await response.arrayBuffer();
          writeFileSync(tempFilePath, Buffer.from(arrayBuffer));
          console.log(`  Image downloaded to: ${tempFilePath}`);
        } catch (error) {
          console.error(`  Error downloading image: ${error.message}`);
          continue;
        }
        
        // Convert to WebP using ffmpeg
        console.log(`  Converting image to WebP format using ffmpeg...`);
        try {
          await convertToWebP(tempFilePath, outputPath, QUALITY);
          console.log(`  Successfully converted and saved to: ${outputPath}`);

          // Clean up the temporary file
          unlinkSync(tempFilePath);

          // Update the frontmatter with the new local image path
          const relativePath = `./img/posts/${slug}/bg.webp`;
          console.log(`  Updating ${mdFile} with new image path: ${relativePath}`);
          const updatedContent = fileContent.replace(imageUrl, relativePath);
          writeFileSync(mdPath, updatedContent, 'utf8');
        } catch (error) {
          console.error(`  Error converting image: ${error.message}`);
        }
      } catch (error) {
        console.error(`  Error processing ${mdFile}: ${error.message}`);
      }
    }
    
    // Clean up temporary directory
    try {
      const tempFiles = readdirSync(TEMP_DIR);
      for (const file of tempFiles) {
        unlinkSync(join(TEMP_DIR, file));
      }
    } catch (error) {
      console.error(`Error cleaning up temporary files: ${error.message}`);
    }
    
    console.log('Image conversion complete!');
  } catch (error) {
    console.error(`Fatal error: ${error.message}`);
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});