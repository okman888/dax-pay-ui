# DaxPay WEB端

## 简绍
vite5 + vue3.4 + vben admin2 + antd vue4 搭建

## 系统环境要求

| 环境   | 版本        | 备注                       |
|------|-----------|--------------------------|
| Node | >=18.12.0 | 推荐使用20.9.0+              |
| pnpm | >=9.0.2+	 | 低版本会导致 pnpm-lock.yaml 失效 |

## 项目启动
```shell
# 安装项目依赖
pnpm install
# 启动项目(运营端)
pnpm run dev:admin
# 启动项目(商户端)
pnpm run dev:merchant
# 构建打包(运营端)
pnpm build:admin
# 构建打包(商户端)
pnpm build:merchant
```

## License

Apache License Version 2.0
