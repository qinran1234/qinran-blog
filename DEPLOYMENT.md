# Static Site Deployment

The production site is a static export. GitHub Actions builds `out/`, uploads an immutable release to the ECS server, and Caddy serves the active release. The server never runs `npm`, Next.js, or a Git checkout.

```text
push main
  -> GitHub Actions: npm ci / lint / next build
  -> SCP: /srv/kiran-blog/releases/<commit>.tar.gz
  -> SSH: unpack and switch /srv/kiran-blog/current
  -> Caddy: serve static files
```

## Requirements

- Ubuntu 24.04 LTS server
- DNS records for `kiran-ovo.me` and `www` pointing to the server
- Ports 80 and 443 open in both UFW and the cloud security group
- GitHub Actions repository secrets

The server only needs Caddy, OpenSSH and basic archive tools:

```bash
sudo apt update
sudo apt install -y caddy openssh-server tar
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

## Prepare the release host

Run the checked-in host setup script as root:

```bash
sudo bash deploy/prepare-static-host.sh
```

It creates the `site-deploy` account and these directories:

```text
/srv/kiran-blog/releases/
/srv/kiran-blog/current -> active release
```

Install the repository Caddy configuration:

```bash
sudo cp Caddyfile /etc/caddy/Caddyfile
sudo caddy validate --config /etc/caddy/Caddyfile
sudo systemctl reload caddy
```

Caddy obtains and renews HTTPS certificates after DNS is live. Before ICP filing is complete, keep public domain traffic disabled and use the IP only for internal testing.

## Configure GitHub Actions

In `Settings -> Secrets and variables -> Actions`, create:

```text
DEPLOY_HOST              # ECS public IPv4 or hostname
DEPLOY_USER              # site-deploy
DEPLOY_SSH_KEY           # private deployment key
DEPLOY_HOST_FINGERPRINT  # SHA256 fingerprint of the ECS ed25519 host key
```

The deployment public key must be in `/srv/site-deploy/.ssh/authorized_keys`. The workflow pins the server host-key fingerprint before uploading; do not disable this verification.

Push to `main`, or run `Deploy Static Site` manually from the Actions tab. A successful run creates a new directory under `releases/`, atomically updates `current`, and retains the five newest releases.

## Verify and recover

```bash
curl -I https://kiran-ovo.me
curl -I https://kiran-ovo.me/algorithms/
sudo systemctl status caddy --no-pager
sudo journalctl -u caddy -n 100 --no-pager
```

To roll back, point `current` to a retained release and reload Caddy:

```bash
sudo ln -sfn /srv/kiran-blog/releases/<COMMIT_SHA> /srv/kiran-blog/current
sudo systemctl reload caddy
```

No application restart is required because Caddy serves the files directly.