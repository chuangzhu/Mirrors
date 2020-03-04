FROM nginx:mainline-alpine

LABEL maintainer="AUTUMN"

RUN apk update && \
    apk add ca-certificates nghttp2-libs && \
    update-ca-certificates && \
    apk add --update tzdata && \
    rm -rf /var/cache/apk/*

ENV TZ=Asia/Shanghai

COPY . /usr/local/mirrors

WORKDIR /usr/local/mirrors

RUN cp nginx.vh.conf /etc/nginx/conf.d/default.conf && chmod 644 /etc/nginx/conf.d/default.conf ;\
    nginx -t ;\
    mkdir web && \
    cp -r static/ web/ && \
    cp index.html web ;\
    mkdir -p storage/repos

# forward error logs to docker log collector
RUN ln -sf /dev/stderr /var/log/nginx/error.log
