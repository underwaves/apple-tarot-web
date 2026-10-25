import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const MIME_MAP: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg',
  '.ogg': 'audio/ogg',
  '.wav': 'audio/wav',
  '.m4a': 'audio/mp4',
  '.aac': 'audio/aac',
};

export async function GET(
  req: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathSegments } = await params;

    if (!pathSegments || pathSegments.length === 0) {
      return NextResponse.json({ error: 'File path required' }, { status: 400 });
    }

    // Security check: No path traversal attacks
    for (const segment of pathSegments) {
      if (
        segment.includes('..') ||
        segment.includes('/') ||
        segment.includes('\\') ||
        segment.includes('\0')
      ) {
        return NextResponse.json({ error: 'Invalid path segment' }, { status: 400 });
      }
    }

    const safeRel = path.join(...pathSegments);
    const candidates = [
      path.join(process.cwd(), 'public', 'uploads', safeRel),
      path.join(process.cwd(), 'data', 'uploads', safeRel),
    ];

    let foundPath: string | null = null;
    for (const candidate of candidates) {
      if (
        fs.existsSync(/*turbopackIgnore: true*/ candidate) &&
        fs.statSync(/*turbopackIgnore: true*/ candidate).isFile()
      ) {
        foundPath = candidate;
        break;
      }
    }

    if (!foundPath) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(/*turbopackIgnore: true*/ foundPath);
    const ext = path.extname(foundPath).toLowerCase();
    const contentType = MIME_MAP[ext] || 'application/octet-stream';

    return new Response(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error serving uploaded asset';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
