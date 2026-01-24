import { NextResponse } from 'next/server';
import { readdir } from 'fs/promises';
import { join } from 'path';

export async function GET() {
  try {
    const publicPath = join(process.cwd(), 'public', 'header-kare');
    
    // Klasör var mı kontrol et
    let files: string[] = [];
    try {
      const entries = await readdir(publicPath);
      // Sadece resim dosyalarını filtrele
      files = entries.filter(file => {
        const ext = file.toLowerCase();
        return ext.endsWith('.jpg') || 
               ext.endsWith('.jpeg') || 
               ext.endsWith('.png') || 
               ext.endsWith('.webp') || 
               ext.endsWith('.gif');
      });
      
      // Alfabetik sırala
      files.sort();
    } catch (error) {
      // Klasör yoksa boş array döndür
      console.log('header-kare klasörü bulunamadı:', error);
    }

    return NextResponse.json({
      success: true,
      images: files.map(file => `/header-kare/${file}`)
    });
  } catch (error: any) {
    console.error('Resim listesi alınamadı:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
