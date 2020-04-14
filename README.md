# house-inspection

## INSTALL

## Add domain resolution

Edit `/etc/hosts`, add new line `127.0.0.1 dev.house-inspection.com` with administator rights.

## Init Database

- create database user `house-inspection`

Reference `docs/db/create_db_user.sql`. Login MySQL command line first, then run sql script below:

```
create user 'houseinspection'@'%' identified by '123456';
grant all on houseinspection.* to 'house-inspection'@'%';
```

- import init sql

init sql script reference `docs/db/init.sql`. Jump to git project folder, login MySQL command line, then run sql script below:


```
source docs/db/init.sql
```

## Create virtual host

Rederence `docs/nginx.conf`. Here is the virtual host configure for me:

```
server {
    listen       80;
    server_name dev.house-inspection.com;

    access_log /Users/eric/work/logs/dev.house-inspection.com.access.log;
    error_log  /Users/eric/work/logs/dev.house-inspection.com.error.log;

    root /Users/eric/work/priv/house-inspection/website;
    index  index.php index.html index.htm;

    location / {
        if (!-e $request_filename) {
            rewrite ^/(.*)$ /index.php?$1 last;
            break;
        }
    }

    location /adm/ {
        if (!-e $request_filename) {
            rewrite ^/(.*)$ /adm/index.php?$1 last;
            break;
        }
    }

    location ~ \.php$ {
        root           html;
        fastcgi_pass   127.0.0.1:9000;
        fastcgi_index  index.php;
        fastcgi_param  SCRIPT_FILENAME /Users/eric/work/priv/house-inspection/website$fastcgi_script_name;
        include        fastcgi_params;
    }
}

```
