import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				primary: ['var(--font-family-primary)'],
				secondary: ['var(--font-family-secondary)'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				luxe: {
					'dark-primary': 'hsl(var(--luxe-dark-primary))',
					'gold-accent': 'hsl(var(--luxe-gold-accent))',
					'white-primary': 'hsl(var(--luxe-white-primary))',
					'gray-secondary': 'hsl(var(--luxe-gray-secondary))',
					'dark-outline': 'hsl(var(--luxe-dark-outline))',
					'gold-star': 'hsl(var(--luxe-gold-star))',
					'gray-footer': 'hsl(var(--luxe-gray-footer))',
					'dark-social': 'hsl(var(--luxe-dark-social))',
					'black-text': 'hsl(var(--luxe-black-text))',
				}
			},
			boxShadow: {
				'luxe-card': 'var(--shadow-card)',
				'luxe-button-hover': 'var(--shadow-button-hover)',
				'luxe-gold-glow': 'var(--shadow-gold-glow)',
			},
			backgroundImage: {
				'gradient-hero-overlay': 'var(--gradient-hero-overlay)',
				'gradient-card-subtle': 'var(--gradient-card-subtle)',
				'gradient-gold': 'var(--gradient-gold)',
			},
			spacing: {
				'luxe-xs': 'var(--spacing-xs)',
				'luxe-sm': 'var(--spacing-sm)',
				'luxe-md': 'var(--spacing-md)',
				'luxe-lg': 'var(--spacing-lg)',
				'luxe-xl': 'var(--spacing-xl)',
				'luxe-xxl': 'var(--spacing-xxl)',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
