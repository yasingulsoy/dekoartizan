'use client';

import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { poppins } from '@/styles/fonts';

import './FlowingMenu.css';

interface FlowingMenuProps {
  items?: Array<{
    link: string;
    text: string;
    subTexts?: string[];
    image: string;
    slideImages?: string[]; // Arkaplan slide için resimler
    slideInterval?: number; // Slide değişim süresi (ms)
    backgroundImage?: string; // Arkaplan resmi (slide olmayan kareler için)
  }>;
  layout?: 'default' | 'leftMerged3';
  speed?: number;
  textColor?: string;
  bgColor?: string;
  marqueeBgColor?: string;
  marqueeTextColor?: string;
  borderColor?: string;
}

interface MenuItemProps {
  link: string;
  text: string;
  subTexts?: string[];
  image: string;
  className?: string;
  speed: number;
  textColor: string;
  marqueeBgColor: string;
  marqueeTextColor: string;
  borderColor: string;
  slideImages?: string[]; // Arkaplan slide için resimler
  slideInterval?: number; // Slide değişim süresi (ms)
  backgroundImage?: string; // Arkaplan resmi (slide olmayan kareler için)
}

function FlowingMenu({
  items = [],
  layout = 'default',
  speed = 15,
  textColor = '#fff',
  bgColor = '#060010',
  marqueeBgColor = '#fff',
  marqueeTextColor = '#060010',
  borderColor = '#fff'
}: FlowingMenuProps) {
  return (
    <div className="menu-wrap" style={{ backgroundColor: bgColor }}>
      <nav className={`menu ${layout === 'leftMerged3' ? 'menu--leftMerged3' : ''}`}>
        {items.map((item, idx) => (
          <MenuItem
            key={idx}
            {...item}
            className={
              layout === 'leftMerged3'
                ? idx === 0
                  ? 'menu__item--merged'
                  : `menu__item--right menu__item--right-${idx}`
                : undefined
            }
            speed={speed}
            textColor={textColor}
            marqueeBgColor={marqueeBgColor}
            marqueeTextColor={marqueeTextColor}
            borderColor={borderColor}
            slideImages={item.slideImages}
            slideInterval={item.slideInterval}
            backgroundImage={item.backgroundImage}
          />
        ))}
      </nav>
    </div>
  );
}

function MenuItem({
  link,
  text,
  subTexts,
  image,
  className,
  speed,
  textColor,
  marqueeBgColor,
  marqueeTextColor,
  borderColor,
  slideImages = [],
  slideInterval = 3000,
  backgroundImage
}: MenuItemProps) {
  const itemRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const marqueeInnerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);
  const slideRef = useRef<HTMLDivElement>(null);
  const slideIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [repetitions, setRepetitions] = useState(4);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [prevSlideIndex, setPrevSlideIndex] = useState(-1);
  const isStacked = !!subTexts?.length;
  const isMerged = className?.includes('menu__item--merged');
  const isRightItem = className?.includes('menu__item--right');
  const marqueeText = [text, ...(subTexts ?? [])].join(' • ');
  
  // Slide resimleri varsa ve merged kare ise slide özelliğini aktif et
  const hasSlideImages = slideImages.length > 0 && isMerged;

  const animationDefaults = { duration: 0.6, ease: 'expo' };

  const findClosestEdge = (mouseX: number, mouseY: number, width: number, height: number) => {
    const topEdgeDist = distMetric(mouseX, mouseY, width / 2, 0);
    const bottomEdgeDist = distMetric(mouseX, mouseY, width / 2, height);
    return topEdgeDist < bottomEdgeDist ? 'top' : 'bottom';
  };

  const distMetric = (x: number, y: number, x2: number, y2: number) => {
    const xDiff = x - x2;
    const yDiff = y - y2;
    return xDiff * xDiff + yDiff * yDiff;
  };

  useEffect(() => {
    const calculateRepetitions = () => {
      if (!marqueeInnerRef.current) return;

      // Get the first marquee part to measure content width
      const marqueeContent = marqueeInnerRef.current.querySelector('.marquee__part') as HTMLElement;
      if (!marqueeContent) return;

      const contentWidth = marqueeContent.offsetWidth;
      const viewportWidth = window.innerWidth;

      const needed = Math.ceil(viewportWidth / contentWidth) + 2;
      setRepetitions(Math.max(4, needed));
    };

    calculateRepetitions();
    window.addEventListener('resize', calculateRepetitions);
    return () => window.removeEventListener('resize', calculateRepetitions);
  }, [marqueeText, image]);

  useEffect(() => {
    const setupMarquee = () => {
      if (!marqueeInnerRef.current) return;

      const marqueeContent = marqueeInnerRef.current.querySelector('.marquee__part');
      if (!marqueeContent) return;

      const contentWidth = (marqueeContent as HTMLElement).offsetWidth;
      if (contentWidth === 0) return;

      if (animationRef.current) {
        animationRef.current.kill();
      }

      // Animate exactly one content width for seamless loop
      animationRef.current = gsap.to(marqueeInnerRef.current, {
        x: -contentWidth,
        duration: speed,
        ease: 'none',
        repeat: -1
      });
    };

    // Small delay to ensure DOM is ready after repetitions update
    const timer = setTimeout(setupMarquee, 50);

    return () => {
      clearTimeout(timer);
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, [marqueeText, image, repetitions, speed]);

  // Slide animasyonu için effect
  useEffect(() => {
    if (!hasSlideImages || !slideRef.current || slideImages.length === 0) return;

    // İlk slide'ı göster ve prevSlideIndex'i temizle
    setCurrentSlideIndex(0);
    setPrevSlideIndex(-1);

    let timeoutId: NodeJS.Timeout | null = null;

    const changeSlide = () => {
      // Önceki timeout'u temizle
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      setCurrentSlideIndex((prev) => {
        const nextIndex = (prev + 1) % slideImages.length;
        // Önceki index'i ayarla
        setPrevSlideIndex(prev);
        
        // Animasyon bittikten sonra prevSlideIndex'i temizle
        timeoutId = setTimeout(() => {
          setPrevSlideIndex((currentPrev) => {
            // Sadece hala aynı prev index ise temizle
            if (currentPrev === prev) {
              return -1;
            }
            return currentPrev;
          });
        }, 1200); // Transition süresi kadar bekle
        
        return nextIndex;
      });
    };

    // İlk slide'ı göster
    slideIntervalRef.current = setInterval(changeSlide, slideInterval);

    return () => {
      if (slideIntervalRef.current) {
        clearInterval(slideIntervalRef.current);
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [hasSlideImages, slideImages.length, slideInterval]);

  const handleMouseEnter = (ev: React.MouseEvent<HTMLAnchorElement>) => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    const x = ev.clientX - rect.left;
    const y = ev.clientY - rect.top;
    const edge = findClosestEdge(x, y, rect.width, rect.height);

    gsap
      .timeline({ defaults: animationDefaults })
      .set(marqueeRef.current, { y: edge === 'top' ? '-101%' : '101%' }, 0)
      .set(marqueeInnerRef.current, { y: edge === 'top' ? '101%' : '-101%' }, 0)
      .to([marqueeRef.current, marqueeInnerRef.current], { y: '0%' }, 0);
  };

  const handleMouseLeave = (ev: React.MouseEvent<HTMLAnchorElement>) => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    const x = ev.clientX - rect.left;
    const y = ev.clientY - rect.top;
    const edge = findClosestEdge(x, y, rect.width, rect.height);

    gsap
      .timeline({ defaults: animationDefaults })
      .to(marqueeRef.current, { y: edge === 'top' ? '-101%' : '101%' }, 0)
      .to(marqueeInnerRef.current, { y: edge === 'top' ? '101%' : '-101%' }, 0);
  };

  return (
    <div 
      className={`menu__item ${className ?? ''}`.trim()} 
      ref={itemRef} 
      style={{ 
        borderColor,
        ...(backgroundImage && !hasSlideImages && !isMerged ? {
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'var(--flowing-menu-bg-size, contain)',
          backgroundPosition: 'var(--flowing-menu-bg-position, center)',
          backgroundRepeat: 'no-repeat'
        } : {})
      }}
    >
      {/* Arkaplan slide resimleri (sadece merged kare için) */}
      {hasSlideImages && (
        <div className="menu__item-slide-bg" ref={slideRef}>
          {slideImages.map((slideImage, idx) => {
            const isActive = idx === currentSlideIndex;
            const isPrev = idx === prevSlideIndex && prevSlideIndex !== -1;
            
            return (
              <div
                key={idx}
                className={`menu__item-slide-image ${isActive ? 'active' : ''} ${isPrev ? 'prev' : ''}`}
                style={{
                  backgroundImage: `url(${slideImage})`,
                  backgroundSize: 'var(--flowing-menu-bg-size, contain)',
                  backgroundPosition: 'var(--flowing-menu-bg-position, center)',
                  backgroundRepeat: 'no-repeat'
                }}
              />
            );
          })}
        </div>
      )}
      <a
        className={`menu__item-link ${isStacked ? 'menu__item-link--stacked' : ''} ${poppins.className}`.trim()}
        href={link}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ color: isRightItem ? '#1c1515' : textColor }}
      >
        <span className="menu__item-text">{text}</span>
        {subTexts?.map((t, i) => (
          <span key={i} className="menu__item-subtext">
            {t}
          </span>
        ))}
      </a>
      <div className="marquee" ref={marqueeRef} style={{ backgroundColor: marqueeBgColor }}>
        <div className="marquee__inner-wrap">
          <div className="marquee__inner" ref={marqueeInnerRef} aria-hidden="true">
            {[...Array(repetitions)].map((_, idx) => (
              <div className="marquee__part" key={idx} style={{ color: marqueeTextColor }}>
                <span>{marqueeText}</span>
                <div className="marquee__img" style={{ backgroundImage: `url(${image})` }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FlowingMenu;
