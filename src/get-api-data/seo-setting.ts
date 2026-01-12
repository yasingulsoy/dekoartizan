import { unstable_cache } from 'next/cache';
import { db } from '@/lib/prisma';

export const getSeoSettings = unstable_cache(
  async () => {
    const result = await db.query(
      'SELECT * FROM seo_settings LIMIT 1'
    );
    return result.rows[0] || null;
  },
  ['seo-setting'], 
  { tags: ['seo-setting'] }
);
