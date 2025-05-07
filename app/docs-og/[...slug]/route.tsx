import { generateOGImage } from 'fumadocs-ui/og';
import { mainDocs } from '@/lib/source'; // Use mainDocs
import { notFound } from 'next/navigation';

export async function GET(
  _req: Request,
  { params }: any,
) {
  const { slug } = params;
  // Ensure slug is a valid array before processing
  if (!Array.isArray(slug)) {
    notFound();
  }
  // Remove the trailing 'image.png' segment from the slug
  const pageSlug = slug.slice(0, -1);
  const page = mainDocs.getPage(pageSlug); // Use mainDocs.getPage
  if (!page) notFound();

  return generateOGImage({
    title: page.data.title,
    description: page.data.description,
    // You can customize the site name if needed
    site: 'Morpheus API Docs', 
  });
}

export function generateStaticParams() {
  // Generate params based on all pages and append 'image.png'
  return mainDocs.getPages().map((page) => ({
    slug: [...page.slugs, 'opengraph-image.png'],
  }));
} 