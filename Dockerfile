# node镜像
FROM node as build-stage
RUN echo "-------------------- web environment configuration --------------------"

# 指定接下来的工作路径为/app  - 类似于cd命令
WORKDIR /app
# 拷贝前端项目 当前目录下的所有文件到app目录下(./指当前所有的代码路径 .指上一步cd到app的路径)
COPY ./ .

# 设置淘宝npm镜像
RUN npm install -g cnpm --registry=https://registry.npmmirror.com
# 安装依赖
RUN npm install

# 打包 - 目的：丢到nginx下跑
RUN npm run build

# 前端项目运行命令
CMD ["npm","run","serve"]

# ======================== 上：npm打包  下：nginx运行 ========================
# nginx镜像
FROM nginx:1.15.3-alpine as production-stage


# 拷贝前端vue项目打包后生成的文件到nginx下运行
COPY --from=build-stage /app/dist /usr/share/nginx/html

# 暴露nginx默认端口80
EXPOSE 80

# 注：CMD不同于RUN，CMD用于指定在容器启动时所要执行的命令，而RUN用于指定镜像构建时所要执行的命令。
#    RUN指令创建的中间镜像会被缓存，并会在下次构建中使用。如果不想使用这些缓存镜像，可以在构建时指定--no-cache参数，如：docker build --no-cache

# 使用daemon off的方式将nginx运行在前台保证镜像不至于退出
CMD ["nginx", "-g", "daemon off;"]
