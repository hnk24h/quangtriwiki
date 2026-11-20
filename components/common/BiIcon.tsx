import React from 'react';

const EMOJI_TO_BI: Record<string, string> = {
  '🏛️': 'bi-bank',
  '🏛': 'bi-bank',
  '⚔️': 'bi-shield-shaded',
  '⚔': 'bi-shield-shaded',
  '🕊️': 'bi-peace',
  '🕊': 'bi-peace',
  '🌊': 'bi-water',
  '☁️': 'bi-cloud',
  '☁': 'bi-cloud',
  '🌲': 'bi-tree',
  '🏝️': 'bi-umbrella',
  '🏝': 'bi-umbrella',
  '🌿': 'bi-flower1',
  '🏖️': 'bi-sun',
  '🏖': 'bi-sun',
  '🦇': 'bi-moon-stars',
  '⛰️': 'bi-triangle',
  '⛰': 'bi-triangle',
  '🏔️': 'bi-triangle-fill',
  '🏔': 'bi-triangle-fill',
  '♨️': 'bi-droplet-half',
  '♨': 'bi-droplet-half',
  '🧭': 'bi-compass',
  '💦': 'bi-droplet',
  '💨': 'bi-wind',
  '🚆': 'bi-train-front',
  '✈️': 'bi-airplane',
  '✈': 'bi-airplane',
  '⛴️': 'bi-tsunami',
  '⛴': 'bi-tsunami',
  '🏍️': 'bi-bicycle',
  '🏍': 'bi-bicycle',
  '📍': 'bi-geo-alt-fill',
  '🍲': 'bi-cup-hot',
  '🏕️': 'bi-tent',
  '🏕': 'bi-tent',
  '🏨': 'bi-building',
  '⛽': 'bi-fuel-pump',
  '🚨': 'bi-exclamation-triangle-fill',
  '📞': 'bi-telephone-fill',
  '💡': 'bi-lightbulb',
  '🌤️': 'bi-cloud-sun',
  '🌤': 'bi-cloud-sun',
  '☀️': 'bi-sun',
  '☀': 'bi-sun',
  '🌧️': 'bi-cloud-rain',
  '🌧': 'bi-cloud-rain',
  '⛈️': 'bi-cloud-lightning-rain',
  '⛈': 'bi-cloud-lightning-rain',
  '🌫️': 'bi-cloud-fog2',
  '🌫': 'bi-cloud-fog2',
  '⛅': 'bi-cloud-sun',
};

interface BiIconProps {
  icon?: string;
  fallback?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function BiIcon({
  icon,
  fallback = 'bi-compass',
  className = '',
  style,
}: BiIconProps) {
  const raw = (icon || '').trim();
  const biClass = raw.startsWith('bi-')
    ? raw
    : EMOJI_TO_BI[raw] || fallback;

  return <i className={`bi ${biClass} ${className}`.trim()} style={style} aria-hidden="true" />;
}
