/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    // 以前这里写的是 'tailwindcss': {}, 现在改成了下面这个：
    '@tailwindcss/postcss': {},
  },
};

export default config;