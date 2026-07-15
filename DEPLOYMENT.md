# Ubuntu Server Deployment

This deployment does not use Docker. Next.js runs directly under Node.js, `systemd` keeps the process alive, and Caddy provides HTTPS and reverse proxying.

```text
Internet :80/:443
        -> Caddy
        -> 127.0.0.1:3000
        -> Next.js production server
```

## Requirements

- Ubuntu 24.04 LTS
- 1 vCPU, 2 GB RAM, and 20 GB disk recommended
- A domain with an `A` record pointing to the server IPv4 address
- SSH key access
- Ports 80 and 443 open
- Node.js 22 LTS or newer

## 1. Prepare Ubuntu

Allow SSH before enabling the firewall:

```bash
sudo apt update
sudo apt install -y git curl ca-certificates caddy

sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

Install Node.js 22 from NodeSource after reviewing the downloaded setup script:

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x -o /tmp/nodesource_setup.sh
less /tmp/nodesource_setup.sh
sudo -E bash /tmp/nodesource_setup.sh
sudo apt install -y nodejs

node --version
npm --version
```

Create a dedicated account. It has no interactive shell and owns only the application directory:

```bash
sudo useradd --system --home /opt/qinran-blog --shell /usr/sbin/nologin qinran-blog
sudo mkdir -p /opt/qinran-blog
sudo chown qinran-blog:qinran-blog /opt/qinran-blog
```

## 2. Clone and build

For a public GitHub repository:

```bash
sudo -u qinran-blog git clone <YOUR_GITHUB_REPOSITORY_URL> /opt/qinran-blog
cd /opt/qinran-blog
sudo -u qinran-blog cp .env.example .env.production
sudo -u qinran-blog nano .env.production
```

Set the final public URL:

```dotenv
NEXT_PUBLIC_SITE_URL=https://blog.example.com
```

Install exactly the locked dependencies and build:

```bash
cd /opt/qinran-blog
sudo -u qinran-blog npm ci
sudo -u qinran-blog npm run build
```

## 3. Install the systemd service

```bash
sudo cp /opt/qinran-blog/deploy/qinran-blog.service /etc/systemd/system/qinran-blog.service
sudo systemctl daemon-reload
sudo systemctl enable --now qinran-blog
sudo systemctl status qinran-blog --no-pager
```

Verify Next.js locally on the server before configuring the domain:

```bash
curl -I http://127.0.0.1:3000
```

The port is bound to loopback only and is not exposed publicly.

## 4. Configure Caddy and HTTPS

Edit the checked-in `Caddyfile` and replace `blog.example.com` with the real domain. Then install it:

```bash
sudo cp /opt/qinran-blog/Caddyfile /etc/caddy/Caddyfile
sudo caddy validate --config /etc/caddy/Caddyfile
sudo systemctl reload caddy
sudo systemctl status caddy --no-pager
```

Caddy obtains and renews the TLS certificate automatically. DNS must already point to the server, and ports 80/443 must be reachable.

## 5. Verify the public site

```bash
curl -I https://blog.example.com
curl -I https://blog.example.com/blog
curl -I https://blog.example.com/research-trail
curl -I https://blog.example.com/sitemap.xml
```

Also check the mobile layout, theme switch, article filters, project links, and friend links in a real browser.

## Update

```bash
cd /opt/qinran-blog
sudo -u qinran-blog git pull --ff-only
sudo -u qinran-blog npm ci
sudo -u qinran-blog npm run build
sudo systemctl restart qinran-blog
sudo systemctl status qinran-blog --no-pager
```

The restart usually causes only a short interruption. For zero-downtime deployment, add a second application instance and have Caddy balance between them; that is unnecessary for an initial personal blog.

## Rollback

Record the current commit before updating:

```bash
cd /opt/qinran-blog
sudo -u qinran-blog git rev-parse HEAD
```

Return to a known stable commit and rebuild:

```bash
sudo -u qinran-blog git checkout <STABLE_COMMIT_SHA>
sudo -u qinran-blog npm ci
sudo -u qinran-blog npm run build
sudo systemctl restart qinran-blog
```

Return to the main branch before the next normal update:

```bash
sudo -u qinran-blog git switch main
```

## Logs and operations

```bash
# Follow application logs
sudo journalctl -u qinran-blog -f

# Follow Caddy logs
sudo journalctl -u caddy -f

# Restart the application
sudo systemctl restart qinran-blog

# Stop or start the application
sudo systemctl stop qinran-blog
sudo systemctl start qinran-blog

# Check listening ports
sudo ss -lntp | grep -E ':80|:443|:3000'
```

## Troubleshooting

### The service fails to start

```bash
sudo systemctl status qinran-blog --no-pager
sudo journalctl -u qinran-blog -n 100 --no-pager
sudo -u qinran-blog test -f /opt/qinran-blog/.next/BUILD_ID
```

Confirm `/usr/bin/node` and `/usr/bin/npm` exist. If Node was installed elsewhere, update `ExecStart` in `/etc/systemd/system/qinran-blog.service`, then run `sudo systemctl daemon-reload`.

### Caddy cannot obtain a certificate

- Confirm the domain `A` record points to this server.
- Confirm ports 80 and 443 are open in both UFW and the cloud firewall/security group.
- Confirm the Caddyfile contains only the domain, without `https://` or a path.
- Read `sudo journalctl -u caddy -n 100 --no-pager`.

### Metadata uses the wrong domain

Update `/opt/qinran-blog/.env.production`, rebuild, and restart:

```bash
sudo -u qinran-blog npm run build
sudo systemctl restart qinran-blog
```
