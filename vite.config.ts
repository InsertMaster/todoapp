import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/todoapp/',
  server: {
    host: true, // 监听所有网络接口，允许局域网内其他设备访问
  },
});
