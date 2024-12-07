import { getLocale, getRequestConfig } from 'next-intl/server';
import { Formats } from 'next-intl';

/**
 * THis is mainly for internalization purposes
 *
 * We load all different dictionaries based on the current locale
 */
export default getRequestConfig(async () => {
  const locale = await getLocale(); // Static locale, can be dynamic if needed

  // Dynamically import messages based on the locale
  const messages = await import(`./messages/${locale}.json`).then(
    (mod) => mod.default
  );

  return { locale, messages };
});

/**
 * Purpose is to have a uniform format in the app. In addition, each format statically typed.
 * const format = useFormatter()
 *
 * format.dateTime(new Date(), 'unknown')
 */
export const formats = {
  dateTime: {
    // Here we will define all time formats to use throughout our app
    /**
     * E.g 2-13-2024
     */
    short: {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      formatMatcher: 'best fit'
    },
    /**
     * E.g Monday 23 April 2025
     */

    full: {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      formatMatcher: 'best fit'
    }
  },
  number: {
    precise: {
      maximumFractionDigits: 5
    }
  },
  list: {
    enumeration: {
      style: 'long',
      type: 'conjunction'
    }
  }
} satisfies Formats;

// ...
