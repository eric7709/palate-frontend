module.exports = {
  theme: {
    extend: {
      animation: {
        shimmer: 'shimmer 0.8s ease-in-out',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
};