#!/usr/bin/env bash
set -euo pipefail

id site-deploy >/dev/null 2>&1 || useradd --system --create-home --home-dir /srv/site-deploy --shell /bin/bash site-deploy
install -d -o site-deploy -g site-deploy -m 755 /srv/kiran-blog
install -d -o site-deploy -g site-deploy -m 755 /srv/kiran-blog/releases
