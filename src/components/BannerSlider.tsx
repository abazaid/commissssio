'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import styles from './BannerSlider.module.css';

type Slide = {
  id: number;
  image_url: string;
  href: string;
  alt: string;
};

type Props = {
  slides: Slide[];
  autoPlayMs?: number;
};

export default function BannerSlider({ slides, autoPlayMs = 4500 }: Props) {
  const [active, setActive] = useState(0);

  const safeSlides = useMemo(() => slides.filter((slide) => !!slide.image_url), [slides]);
  const total = safeSlides.length;

  useEffect(() => {
    if (safeSlides.length <= 1) return;
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % safeSlides.length);
    }, autoPlayMs);
    return () => clearInterval(timer);
  }, [autoPlayMs, safeSlides.length]);

  useEffect(() => {
    if (active >= safeSlides.length) setActive(0);
  }, [active, safeSlides.length]);

  if (safeSlides.length === 0) return null;

  const goPrev = () => setActive((prev) => (prev - 1 + safeSlides.length) % safeSlides.length);
  const goNext = () => setActive((prev) => (prev + 1) % safeSlides.length);

  return (
    <div className={styles.slider} aria-label="Hot deals banner slider">
      <div className={styles.viewport}>
        {safeSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`${styles.slide} ${index === active ? styles.slideActive : ''}`}
            aria-hidden={index !== active}
          >
            <Link href={slide.href} target="_blank" rel="noopener noreferrer" className={styles.slideLink}>
              <img src={slide.image_url} alt={slide.alt} className={styles.slideImage} />
            </Link>
          </div>
        ))}
      </div>

      {total > 1 && (
        <>
          <button type="button" onClick={goPrev} className={`${styles.arrow} ${styles.prev}`} aria-label="Previous banner">
            ‹
          </button>
          <button type="button" onClick={goNext} className={`${styles.arrow} ${styles.next}`} aria-label="Next banner">
            ›
          </button>

          <div className={styles.dots}>
            {safeSlides.map((slide, index) => (
              <button
                key={`dot-${slide.id}`}
                type="button"
                className={`${styles.dot} ${index === active ? styles.dotActive : ''}`}
                onClick={() => setActive(index)}
                aria-label={`Go to banner ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
