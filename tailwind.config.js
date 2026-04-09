/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{html,ts}"
    ],
    theme: {
        extend: {
            colors: {
                border: "var(--border)",
                input: "var(--input)",
                ring: "var(--ring)",
                background: "var(--background)",
                foreground: "var(--foreground)",
                primary: {
                    DEFAULT: "var(--primary)",
                    foreground: "var(--primary-foreground)",
                },
                secondary: {
                    DEFAULT: "var(--secondary)",
                    foreground: "var(--secondary-foreground)",
                },
                destructive: {
                    DEFAULT: "var(--destructive)",
                    foreground: "var(--destructive-foreground)",
                },
                muted: {
                    DEFAULT: "var(--muted)",
                    foreground: "var(--muted-foreground)",
                },
                accent: {
                    DEFAULT: "var(--accent)",
                    foreground: "var(--accent-foreground)",
                },
                popover: {
                    DEFAULT: "var(--popover)",
                    foreground: "var(--popover-foreground)",
                },
                card: {
                    DEFAULT: "var(--card)",
                    foreground: "var(--card-foreground)",
                },
                sidebar: {
                    DEFAULT: "var(--sidebar)",
                    foreground: "var(--sidebar-foreground)",
                    primary: "var(--sidebar-primary)",
                    "primary-foreground": "var(--sidebar-primary-foreground)",
                    accent: "var(--sidebar-accent)",
                    "accent-foreground": "var(--sidebar-accent-foreground)",
                    border: "var(--sidebar-border)",
                    ring: "var(--sidebar-ring)",
                },
                // Custom App Colors
                important: "#e2001a",
                informative: "#007a91", // Changed to color hex for Tailwind JIT to work reliably without CSS vars
                recalled: "#666666",
                'input-background': "var(--input-background)",
                'switch-background': "var(--switch-background)",
                unicredit: {
                    primary: '#007a91',
                    'primary-hover': '#006577',
                    'primary-light': '#e7f8fb',
                    text: '#262626',
                    'text-secondary': '#666666',
                    'text-muted': '#909090',
                    gray: '#e6e6e6',
                    'gray-divider': '#ccc',
                    'gray-light': '#eee',
                    'gray-lighter': '#f5f5f5',
                    'ooo-bg': '#FCE4EC',
                    'ooo-text': '#E91E63',
                    error: '#e2001a',
                }
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            fontFamily: {
                sans: ['UniCredit', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
