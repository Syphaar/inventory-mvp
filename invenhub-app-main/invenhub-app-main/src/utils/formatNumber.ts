/**
 * Number & Currency Formatting Utilities
 *
 * This module provides functions for formatting numbers, currency, and percentages
 * Used throughout the application for consistent display of financial and numeric data
 *
 * Functions:
 * - formatCurrency(value): Format number as USD currency ($1,000.00)
 * - formatNumber(value): Format with thousands separator (1,000)
 * - formatDecimal(value): Format with fixed decimal places (1,000.00)
 * - formatPercent(value): Format as percentage (50%)
 *
 * All functions use Intl.NumberFormat for proper localization
 */

/**
 * Format a number as USD currency
 *
 * @param value The number to format
 * @returns Formatted currency string (e.g., "$1,234.56")
 *
 * @example
 * formatCurrency(1234.5) // "$1,234.50"
 * formatCurrency(0) // "$0.00"
 */
export function formatCurrency(value: number): string {
  if (typeof value !== "number") {
    return "$0.00";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format a number with thousands separator
 *
 * @param value The number to format
 * @returns Formatted number string (e.g., "1,234")
 *
 * @example
 * formatNumber(1234) // "1,234"
 * formatNumber(1000000) // "1,000,000"
 */
export function formatNumber(value: number): string {
  if (typeof value !== "number") {
    return "0";
  }

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format a number with fixed decimal places
 *
 * @param value The number to format
 * @param decimals Number of decimal places (default: 2)
 * @returns Formatted number string (e.g., "1,234.50")
 *
 * @example
 * formatDecimal(1234.5) // "1,234.50"
 * formatDecimal(1234.567, 3) // "1,234.567"
 */
export function formatDecimal(value: number, decimals: number = 2): string {
  if (typeof value !== "number") {
    return "0.00";
  }

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format a number as percentage
 *
 * @param value The decimal value to format (0.5 = 50%)
 * @param decimals Number of decimal places (default: 1)
 * @returns Formatted percentage string (e.g., "50.0%")
 *
 * @example
 * formatPercent(0.5) // "50.0%"
 * formatPercent(0.123) // "12.3%"
 */
export function formatPercent(value: number, decimals: number = 1): string {
  if (typeof value !== "number") {
    return "0.0%";
  }

  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}
