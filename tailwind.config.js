import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

const brandPrimary = {
    50: '#f5f3ff',
    100: '#ede9fe',
    200: '#ddd6fe',
    300: '#c4b5fd',
    400: '#a78bfa',
    500: '#8b5cf6',
    600: '#7c3aed',
    700: '#6d28d9',
    800: '#5b21b6',
    900: '#4c1d95',
    950: '#2e1065',
};

const brandAccent = {
    50: '#f0f7ff',
    100: '#dcecff',
    200: '#bedbff',
    300: '#95c3ff',
    400: '#5fa0ff',
    500: '#2d7ee5',
    600: '#1f64b8',
    700: '#1c5798',
    800: '#1b487a',
    900: '#1a3d64',
    950: '#122944',
};

const brandSuccess = {
    50: '#ecfdf3',
    100: '#d1fadf',
    200: '#a6f4c5',
    300: '#6ce9a6',
    400: '#32d583',
    500: '#12b76a',
    600: '#039855',
    700: '#027a48',
    800: '#05603a',
    900: '#054f31',
    950: '#022c1c',
};

const brandWarning = {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    950: '#451a03',
};

const brandDanger = {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    950: '#450a0a',
};

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                primary: brandPrimary,
                accent: brandAccent,
                success: brandSuccess,
                warning: brandWarning,
                danger: brandDanger,
                info: brandAccent,
                orange: brandPrimary,
                secondary: brandAccent,
                neutral: {
                    50: '#f8fafc',
                    100: '#eef2f6',
                    200: '#e1e7ee',
                    300: '#cfd8e3',
                    400: '#9aa7b7',
                    500: '#66748a',
                    600: '#4e5970',
                    700: '#3c465b',
                    800: '#31394a',
                    900: '#2b3140',
                    950: '#171b26',
                },
            },
        },
    },

    plugins: [forms, require('tailwind-scrollbar-hide')],
};
