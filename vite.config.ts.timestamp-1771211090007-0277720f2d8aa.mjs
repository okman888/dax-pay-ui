// vite.config.ts
import { defineApplicationConfig } from "file:///E:/projects/pay/dax-pay-ui/internal/vite-config/dist/index.mjs";
var vite_config_default = defineApplicationConfig({
  overrides: {
    optimizeDeps: {
      include: [
        "echarts/core",
        "echarts/charts",
        "echarts/components",
        "echarts/renderers",
        "qrcode",
        "@iconify/iconify",
        "ant-design-vue/es/locale/zh_CN"
      ]
    },
    server: {
      open: false,
      // 项目启动后，自动打开
      host: true,
      port: 3300,
      proxy: {
        // 运营管理端
        "/server": {
          target: "http://127.0.0.1:9999",
          changeOrigin: true,
          ws: true,
          rewrite: (path) => path.replace(new RegExp(`^/server`), "")
        },
        // 商户端
        "/merchant": {
          target: "http://127.0.0.1:9999",
          changeOrigin: true,
          ws: true,
          rewrite: (path) => path.replace(new RegExp(`^/merchant`), "")
        }
      },
      warmup: {
        clientFiles: ["./index.html", "./src/{views,components}/*"]
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxwcm9qZWN0c1xcXFxwYXlcXFxcZGF4LXBheS11aVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRTpcXFxccHJvamVjdHNcXFxccGF5XFxcXGRheC1wYXktdWlcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0U6L3Byb2plY3RzL3BheS9kYXgtcGF5LXVpL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQXBwbGljYXRpb25Db25maWcgfSBmcm9tICdAdmJlbi92aXRlLWNvbmZpZydcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQXBwbGljYXRpb25Db25maWcoe1xuICBvdmVycmlkZXM6IHtcbiAgICBvcHRpbWl6ZURlcHM6IHtcbiAgICAgIGluY2x1ZGU6IFtcbiAgICAgICAgJ2VjaGFydHMvY29yZScsXG4gICAgICAgICdlY2hhcnRzL2NoYXJ0cycsXG4gICAgICAgICdlY2hhcnRzL2NvbXBvbmVudHMnLFxuICAgICAgICAnZWNoYXJ0cy9yZW5kZXJlcnMnLFxuICAgICAgICAncXJjb2RlJyxcbiAgICAgICAgJ0BpY29uaWZ5L2ljb25pZnknLFxuICAgICAgICAnYW50LWRlc2lnbi12dWUvZXMvbG9jYWxlL3poX0NOJyxcbiAgICAgIF0sXG4gICAgfSxcbiAgICBzZXJ2ZXI6IHtcbiAgICAgIG9wZW46IGZhbHNlLCAvLyBcdTk4NzlcdTc2RUVcdTU0MkZcdTUyQThcdTU0MEVcdUZGMENcdTgxRUFcdTUyQThcdTYyNTNcdTVGMDBcbiAgICAgIGhvc3Q6IHRydWUsXG4gICAgICBwb3J0OiAzMzAwLFxuICAgICAgcHJveHk6IHtcbiAgICAgICAgLy8gXHU4RkQwXHU4NDI1XHU3QkExXHU3NDA2XHU3QUVGXG4gICAgICAgICcvc2VydmVyJzoge1xuICAgICAgICAgIHRhcmdldDogJ2h0dHA6Ly8xMjcuMC4wLjE6OTk5OScsXG4gICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICAgIHdzOiB0cnVlLFxuICAgICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UobmV3IFJlZ0V4cChgXi9zZXJ2ZXJgKSwgJycpLFxuICAgICAgICB9LFxuICAgICAgICAvLyBcdTU1NDZcdTYyMzdcdTdBRUZcbiAgICAgICAgJy9tZXJjaGFudCc6IHtcbiAgICAgICAgICB0YXJnZXQ6ICdodHRwOi8vMTI3LjAuMC4xOjk5OTknLFxuICAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgICB3czogdHJ1ZSxcbiAgICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKG5ldyBSZWdFeHAoYF4vbWVyY2hhbnRgKSwgJycpLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIHdhcm11cDoge1xuICAgICAgICBjbGllbnRGaWxlczogWycuL2luZGV4Lmh0bWwnLCAnLi9zcmMve3ZpZXdzLGNvbXBvbmVudHN9LyonXSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXdRLFNBQVMsK0JBQStCO0FBRWhULElBQU8sc0JBQVEsd0JBQXdCO0FBQUEsRUFDckMsV0FBVztBQUFBLElBQ1QsY0FBYztBQUFBLE1BQ1osU0FBUztBQUFBLFFBQ1A7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBQ0EsUUFBUTtBQUFBLE1BQ04sTUFBTTtBQUFBO0FBQUEsTUFDTixNQUFNO0FBQUEsTUFDTixNQUFNO0FBQUEsTUFDTixPQUFPO0FBQUE7QUFBQSxRQUVMLFdBQVc7QUFBQSxVQUNULFFBQVE7QUFBQSxVQUNSLGNBQWM7QUFBQSxVQUNkLElBQUk7QUFBQSxVQUNKLFNBQVMsQ0FBQyxTQUFTLEtBQUssUUFBUSxJQUFJLE9BQU8sVUFBVSxHQUFHLEVBQUU7QUFBQSxRQUM1RDtBQUFBO0FBQUEsUUFFQSxhQUFhO0FBQUEsVUFDWCxRQUFRO0FBQUEsVUFDUixjQUFjO0FBQUEsVUFDZCxJQUFJO0FBQUEsVUFDSixTQUFTLENBQUMsU0FBUyxLQUFLLFFBQVEsSUFBSSxPQUFPLFlBQVksR0FBRyxFQUFFO0FBQUEsUUFDOUQ7QUFBQSxNQUNGO0FBQUEsTUFDQSxRQUFRO0FBQUEsUUFDTixhQUFhLENBQUMsZ0JBQWdCLDRCQUE0QjtBQUFBLE1BQzVEO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
