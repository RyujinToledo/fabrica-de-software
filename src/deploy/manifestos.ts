/**
 * Manifestos de producao (TASK-010, PRD-006, RF-018).
 * Funcoes puras: recebem parametros e devolvem texto.
 * Segredo nunca entra aqui; so nomes de variaveis.
 */

export interface Destino {
	dominio: string;
	versaoImagem: string;
	senhaBancoEmArquivo?: never;
}

export function gerarCompose(destino: Destino): string {
	return [
		"services:",
		"  app:",
		`    image: fabrica/app:${destino.versaoImagem}`,
		'    user: "node:node"',
		"    cap_drop: [ALL]",
		"    security_opt: [no-new-privileges:true]",
		"    read_only: true",
		"    cpus: 1.5",
		"    mem_limit: 1g",
		"    pids_limit: 100",
		"    restart: unless-stopped",
		"    env_file: [.env]",
		"    depends_on: [db, cache]",
		"  db:",
		"    image: postgres:16",
		"    restart: unless-stopped",
		"    env_file: [.env]",
		"    volumes: [dados-postgres:/var/lib/postgresql/data]",
		"  cache:",
		"    image: valkey/valkey:8",
		"    restart: unless-stopped",
		"    command: [valkey-server, --requirepass, ${VALKEY_PASS}]",
		"  borda:",
		"    image: nginx:1.27",
		"    restart: unless-stopped",
		"    ports: ['80:80', '443:443']",
		"    volumes: [./nginx.conf:/etc/nginx/conf.d/app.conf:ro, ./tls:/etc/nginx/tls:ro]",
		"volumes:",
		"  dados-postgres:",
		"",
	].join("\n");
}

export function gerarNginxTls(dominio: string): string {
	return [
		"server {",
		"  listen 80;",
		`  server_name ${dominio};`,
		"  return 301 https://$host$request_uri;",
		"}",
		"server {",
		"  listen 443 ssl;",
		"  http2 on;",
		`  server_name ${dominio};`,
		"  ssl_certificate /etc/nginx/tls/cert.pem;",
		"  ssl_certificate_key /etc/nginx/tls/chave.pem;",
		"  ssl_protocols TLSv1.3;",
		"  ssl_prefer_server_ciphers off;",
		"  add_header Strict-Transport-Security 'max-age=63072000' always;",
		"  add_header X-Content-Type-Options nosniff always;",
		"  add_header X-Frame-Options DENY always;",
		"  add_header Referrer-Policy no-referrer always;",
		"  location / {",
		"    proxy_pass http://app:3000;",
		"    proxy_set_header Host $host;",
		"    proxy_set_header X-Forwarded-Proto $scheme;",
		"  }",
		"}",
		"",
	].join("\n");
}

export function gerarCoraza(): string {
	return [
		"SecRuleEngine On",
		"SecRequestBodyAccess On",
		"Include /etc/coraza/crs/crs-setup.conf.example",
		"Include /etc/coraza/crs/rules/*.conf",
		"",
	].join("\n");
}

export function gerarFail2ban(): string {
	return [
		"[nginx-http-auth]",
		"enabled = true",
		"maxretry = 5",
		"findtime = 600",
		"bantime = 3600",
		"",
		"[nginx-limit-req]",
		"enabled = true",
		"maxretry = 10",
		"findtime = 60",
		"bantime = 600",
		"",
	].join("\n");
}

export function gerarSystemd(nome: string): string {
	return [
		"[Unit]",
		`Description=Fabrica ${nome}`,
		"After=network.target",
		"",
		"[Service]",
		"User=node",
		"WorkingDirectory=/srv/fabrica",
		"EnvironmentFile=/srv/fabrica/.env",
		"ExecStart=/usr/bin/node dist/principal.js",
		"Restart=on-failure",
		"MemoryMax=1G",
		"CPUQuota=150%",
		"NoNewPrivileges=true",
		"",
		"[Install]",
		"WantedBy=multi-user.target",
		"",
	].join("\n");
}

export function gerarEnvExample(): string {
	return [
		"# Copie para .env e preencha fora do repositorio. Nunca commite o .env.",
		"NODE_ENV=production",
		"PORT=3000",
		"DATABASE_URL=",
		"VALKEY_URL=",
		"BETTER_AUTH_SECRET=",
		"ADMIN_EMAIL=",
		"",
	].join("\n");
}
