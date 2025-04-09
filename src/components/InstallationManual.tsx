import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from 'sonner';
import { Copy, Download, FileText, Info, FolderTree, Terminal, Database, Server, Shield } from 'lucide-react';

const InstallationManual = () => {
  const [activeTab, setActiveTab] = useState('ubuntu');
  
  const ubuntuManualText = `# Manual de Instalação Completo do Sistema de Rastreamento Veicular no Ubuntu 22.04

## Requisitos de Sistema
- Ubuntu Server 22.04 LTS
- 4GB RAM mínimo (8GB recomendado)
- 50GB de espaço em disco
- Conexão com a internet estável

## 1. Preparação do Servidor Ubuntu

### 1.1. Atualização do Sistema

\`\`\`bash
# Atualize a lista de pacotes e instale atualizações
sudo apt update
sudo apt upgrade -y

# Instale pacotes essenciais
sudo apt install -y software-properties-common apt-transport-https ca-certificates curl gnupg lsb-release
\`\`\`

### 1.2. Configuração de Timezone e Locale

\`\`\`bash
# Configure o timezone
sudo timedatectl set-timezone America/Sao_Paulo

# Configure o locale
sudo locale-gen pt_BR.UTF-8
sudo update-locale LANG=pt_BR.UTF-8 LC_ALL=pt_BR.UTF-8
\`\`\`

## 2. Instalação de Dependências Principais

### 2.1. Instalação do Servidor Web (Nginx)

\`\`\`bash
# Instale o Nginx
sudo apt install -y nginx

# Habilite e inicie o serviço
sudo systemctl enable nginx
sudo systemctl start nginx

# Configure o firewall (se estiver ativo)
sudo ufw allow 'Nginx Full'
\`\`\`

### 2.2. Instalação do PHP 8.1

\`\`\`bash
# Adicione repositório do PHP
sudo add-apt-repository ppa:ondrej/php -y
sudo apt update

# Instale PHP e extensões necessárias
sudo apt install -y php8.1 php8.1-cli php8.1-fpm php8.1-mysql php8.1-pgsql php8.1-gd php8.1-curl php8.1-mbstring php8.1-xml php8.1-bcmath php8.1-intl php8.1-zip php8.1-soap

# Verifique a instalação
php -v
\`\`\`

### 2.3. Instalação do Node.js (para componentes frontend)

\`\`\`bash
# Instale o Node.js na versão LTS
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verifique a instalação
node -v
npm -v

# Instale o PM2 para gerenciamento de processos
sudo npm install -g pm2
\`\`\`

## 3. Instalação e Configuração do Banco de Dados

### 3.1. Instalação do PostgreSQL

\`\`\`bash
# Instale PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Verifique a instalação
sudo systemctl status postgresql

# Inicie e habilite o serviço
sudo systemctl enable postgresql
sudo systemctl start postgresql
\`\`\`

### 3.2. Configuração do Banco de Dados

\`\`\`bash
# Acesse o shell do PostgreSQL
sudo -i -u postgres

# Crie um usuário para o sistema de rastreamento
createuser --pwprompt trackadmin
# Digite a senha quando solicitado (use uma senha segura)

# Crie o banco de dados
createdb --owner=trackadmin trackingdb

# Saia do shell PostgreSQL
exit

# Configure as permissões do usuário
sudo -u postgres psql -c "ALTER USER trackadmin WITH SUPERUSER;"
\`\`\`

### 3.3. Importação da Estrutura do Banco de Dados

\`\`\`bash
# A partir do diretório do projeto
cd /caminho/para/sistema-rastreamento

# Importe o esquema do banco de dados
sudo -u postgres psql trackingdb < src/utils/database.sql

# Verifique se as tabelas foram criadas
sudo -u postgres psql -c "\\c trackingdb"
sudo -u postgres psql -c "\\dt"
\`\`\`

## 4. Configuração do Sistema de Rastreamento

### 4.1. Clone do Repositório

\`\`\`bash
# Clone o repositório do sistema (substitua pela URL real do seu repositório)
sudo apt install -y git
cd /var/www
sudo git clone https://github.com/sua-empresa/sistema-rastreamento.git
cd sistema-rastreamento

# Configure as permissões
sudo chown -R www-data:www-data /var/www/sistema-rastreamento
sudo chmod -R 755 /var/www/sistema-rastreamento
\`\`\`

### 4.2. Configuração do Frontend

\`\`\`bash
# Instale as dependências do frontend
cd /var/www/sistema-rastreamento
sudo npm install

# Compile os assets para produção
sudo npm run build

# Configure o PM2 para servir a aplicação
sudo pm2 start npm --name "tracking-frontend" -- run preview
sudo pm2 startup
sudo pm2 save
\`\`\`

### 4.3. Configuração de Variáveis de Ambiente

\`\`\`bash
# Crie o arquivo de variáveis de ambiente
cd /var/www/sistema-rastreamento
sudo cp .env.example .env
sudo nano .env
\`\`\`

Adicione as seguintes variáveis (ajuste conforme necessário):

\`\`\`
# Configurações do Banco de Dados
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USER=trackadmin
DB_PASSWORD=sua_senha_segura
DB_NAME=trackingdb

# Configurações da API
API_PORT=3000
API_SECRET=sua_chave_secreta_da_api

# Configurações do WhatsApp
WHATSAPP_API_URL=https://whatsapp-api-url
WHATSAPP_API_TOKEN=seu_token_whatsapp
\`\`\`

### 4.4. Configuração do Nginx como Proxy Reverso

\`\`\`bash
# Crie um arquivo de configuração para o site
sudo nano /etc/nginx/sites-available/tracking-system
\`\`\`

Adicione a seguinte configuração:

\`\`\`
server {
    listen 80;
    server_name seu-dominio.com www.seu-dominio.com;
    root /var/www/sistema-rastreamento/dist;
    index index.html;

    # Frontend estático
    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "public, max-age=3600";
    }

    # API backend
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Configurações para upload de arquivos grandes
    client_max_body_size 20M;

    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg)$ {
        expires 30d;
        add_header Cache-Control "public, max-age=2592000";
    }

    # Segurança - evitar acesso a arquivos ocultos
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }

    # Logs
    access_log /var/log/nginx/tracking-access.log;
    error_log /var/log/nginx/tracking-error.log;
}
\`\`\`

Ative o site e reinicie o Nginx:

\`\`\`bash
sudo ln -s /etc/nginx/sites-available/tracking-system /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
\`\`\`

## 5. Configuração de SSL (HTTPS)

### 5.1. Instalação do Certbot

\`\`\`bash
# Instale o Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtenha e configure o certificado SSL
sudo certbot --nginx -d seu-dominio.com -d www.seu-dominio.com

# Configure a renovação automática
sudo systemctl status certbot.timer
\`\`\`

## 6. Configuração do Sistema de Backup

### 6.1. Instalação do Script de Backup

\`\`\`bash
# Crie o diretório de backups
sudo mkdir -p /var/backups/tracking_system

# Configure as permissões
sudo chown -R postgres:postgres /var/backups/tracking_system
\`\`\`

### 6.2. Configuração do Script de Backup

\`\`\`bash
# Copie o script de backup para os scripts de cron diários
sudo cp /var/www/sistema-rastreamento/src/utils/backup_database.sh /etc/cron.daily/backup-tracking-db

# Torne o script executável
sudo chmod +x /etc/cron.daily/backup-tracking-db

# Teste o script (opcional)
sudo /etc/cron.daily/backup-tracking-db
\`\`\`

## 7. Configuração de Segurança

### 7.1. Configuração do Firewall

\`\`\`bash
# Ative o UFW
sudo apt install -y ufw
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Permita SSH, HTTP e HTTPS
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https

# Ative o firewall
sudo ufw enable
\`\`\`

### 7.2. Configuração de Segurança Adicional

\`\`\`bash
# Instale o fail2ban para proteger contra ataques de força bruta
sudo apt install -y fail2ban

# Configure o fail2ban
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo nano /etc/fail2ban/jail.local

# Reinicie o fail2ban
sudo systemctl restart fail2ban
\`\`\`

## 8. Inicialização e Verificação do Sistema

### 8.1. Inicialização dos Serviços

\`\`\`bash
# Verifique se todos os serviços estão ativos
sudo systemctl status nginx
sudo systemctl status postgresql
sudo pm2 status

# Reinicie os serviços se necessário
sudo systemctl restart nginx
sudo systemctl restart postgresql
sudo pm2 restart all
\`\`\`

### 8.2. Verificação do Sistema

Acesse seu site em \`https://seu-dominio.com\` e faça login com as credenciais padrão:

- Email: admin@example.com
- Senha: admin123

**IMPORTANTE**: Altere a senha padrão após o primeiro login!

## 9. Estrutura de Diretórios

O sistema segue a seguinte estrutura de diretórios:

\`\`\`
/var/www/sistema-rastreamento/
├── dist/                    # Arquivos estáticos compilados (gerados por 'npm run build')
├── node_modules/            # Dependências do Node.js
├── public/                  # Arquivos públicos
├── src/                     # Código-fonte
│   ├── components/          # Componentes React
│   ├── contexts/            # Contextos React
│   ├── hooks/               # Hooks personalizados
│   ├── lib/                 # Bibliotecas e utilitários
│   ├── pages/               # Páginas da aplicação
│   └── utils/               # Utilitários e scripts
│       ├── migrations/      # Scripts de migração do banco de dados
│       ├── database.sql     # Esquema do banco de dados
│       ├── db_connection.php # Conexão com o banco de dados
│       ├── db_migration.php # Gerenciador de migrações
│       └── backup_database.sh # Script de backup
├── .env                     # Variáveis de ambiente (você precisa criar)
├── .env.example             # Exemplo de variáveis de ambiente
├── index.html               # Arquivo HTML principal
├── package.json             # Configuração do projeto Node.js
├── README.md                # Documentação do projeto
├── tailwind.config.ts       # Configuração do Tailwind CSS
└── vite.config.ts           # Configuração do Vite
\`\`\`

## 10. Logs e Monitoramento

### 10.1. Logs do Sistema

\`\`\`bash
# Logs do Nginx
sudo tail -f /var/log/nginx/tracking-access.log
sudo tail -f /var/log/nginx/tracking-error.log

# Logs do PostgreSQL
sudo tail -f /var/log/postgresql/postgresql-14-main.log

# Logs da aplicação Node.js
pm2 logs tracking-frontend
\`\`\`

### 10.2. Monitoramento do Sistema

\`\`\`bash
# Instale utilidades de monitoramento
sudo apt install -y htop

# Monitore o uso de recursos
htop
\`\`\`

## 11. Manutenção e Atualizações

### 11.1. Atualizando o Sistema

\`\`\`bash
# Atualize o sistema operacional
sudo apt update
sudo apt upgrade -y

# Atualize o código do aplicativo
cd /var/www/sistema-rastreamento
sudo git pull

# Instale/atualize dependências
sudo npm install

# Recompile os assets
sudo npm run build

# Reinicie o serviço
sudo pm2 restart tracking-frontend
\`\`\`

### 11.2. Executando Migrações do Banco de Dados

\`\`\`bash
# Execute migrações
cd /var/www/sistema-rastreamento
php src/utils/db_migration.php migrate
\`\`\`

## Suporte e Manutenção

Para qualquer dúvida ou suporte, entre em contato:
- Email: suporte@sua-empresa.com
- Telefone: (00) 0000-0000
- Horário de atendimento: Segunda a Sexta, das 8h às 18h`;
  
  const dockerManualText = `# Manual de Instalação do Sistema de Rastreamento Veicular com Docker

## Requisitos de Sistema
- Qualquer sistema operacional com Docker e Docker Compose instalados
- 4GB RAM mínimo (8GB recomendado)
- 50GB de espaço em disco
- Conexão com a internet

## 1. Instalação do Docker e Docker Compose

### Ubuntu/Debian:
\`\`\`bash
# Instale o Docker
sudo apt update
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
sudo apt update
sudo apt install -y docker-ce

# Instale o Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.21.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Adicione seu usuário ao grupo docker
sudo usermod -aG docker \${USER}
su - \${USER}

# Verifique as instalações
docker --version
docker-compose --version
\`\`\`

## 2. Estrutura de Diretórios e Arquivos

Crie a seguinte estrutura de arquivos:

\`\`\`
projeto-rastreamento/
├── docker-compose.yml
├── .env
├── nginx/
│   └── default.conf
├── php/
│   └── Dockerfile
└── postgres/
    └── init.sql
\`\`\`

## 3. Configuração dos Arquivos Docker

### 3.1. Arquivo docker-compose.yml

\`\`\`yaml
version: '3.8'

services:
  nginx:
    image: nginx:alpine
    container_name: tracking_nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/default.conf:/etc/nginx/conf.d/default.conf
      - ./:/var/www/html
      - ./nginx/certbot/conf:/etc/letsencrypt
      - ./nginx/certbot/www:/var/www/certbot
    depends_on:
      - php
    networks:
      - tracking_network
    restart: unless-stopped

  php:
    build:
      context: ./php
    container_name: tracking_php
    volumes:
      - ./:/var/www/html
    depends_on:
      - postgres
    networks:
      - tracking_network
    restart: unless-stopped

  postgres:
    image: postgres:14
    container_name: tracking_postgres
    environment:
      POSTGRES_DB: \${DB_NAME}
      POSTGRES_USER: \${DB_USER}
      POSTGRES_PASSWORD: \${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./postgres/init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"
    networks:
      - tracking_network
    restart: unless-stopped

  node:
    image: node:18-alpine
    container_name: tracking_node
    working_dir: /app
    volumes:
      - ./:/app
    command: sh -c "npm install && npm run build && npm run preview"
    ports:
      - "3000:3000"
    networks:
      - tracking_network
    restart: unless-stopped

networks:
  tracking_network:
    driver: bridge

volumes:
  postgres_data:
\`\`\`

### 3.2. Arquivo .env

\`\`\`
# Configurações do Banco de Dados
DB_NAME=trackingdb
DB_USER=trackadmin
DB_PASSWORD=sua_senha_segura
DB_HOST=postgres

# Configurações da Aplicação
APP_URL=http://localhost
APP_ENV=production

# Configurações do WhatsApp
WHATSAPP_API_URL=https://whatsapp-api-url
WHATSAPP_API_TOKEN=seu_token_whatsapp
\`\`\`

### 3.3. Arquivo nginx/default.conf

\`\`\`nginx
server {
    listen 80;
    server_name localhost;
    root /var/www/html/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://node:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location ~ \\.php$ {
        fastcgi_pass php:9000;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
\`\`\`

### 3.4. Arquivo php/Dockerfile

\`\`\`dockerfile
FROM php:8.1-fpm

# Instale extensões PHP necessárias
RUN apt-get update && apt-get install -y \
    libpq-dev \
    libzip-dev \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
    pdo \
    pdo_pgsql \
    pgsql \
    gd \
    zip

# Configure o PHP para produção
RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"

# Aumente os limites de upload e tempo de execução
RUN echo "upload_max_filesize = 20M" >> "$PHP_INI_DIR/php.ini" \
    && echo "post_max_size = 20M" >> "$PHP_INI_DIR/php.ini" \
    && echo "max_execution_time = 300" >> "$PHP_INI_DIR/php.ini"

WORKDIR /var/www/html
\`\`\`

### 3.5. Arquivo postgres/init.sql

Este arquivo deve conter o mesmo conteúdo do arquivo database.sql do projeto.

## 4. Execução do Projeto com Docker

\`\`\`bash
# Na pasta raiz do projeto
docker-compose up -d

# Verifique se os containers estão rodando
docker-compose ps

# Verifique os logs
docker-compose logs -f
\`\`\`

## 5. Configuração de SSL com Docker

\`\`\`bash
# Instale o certbot no host
sudo apt install -y certbot

# Obtenha certificados
sudo certbot certonly --webroot -w ./nginx/certbot/www -d seu-dominio.com -d www.seu-dominio.com

# Copie os certificados para o diretório do Docker
sudo cp -L /etc/letsencrypt/live/seu-dominio.com/fullchain.pem ./nginx/certbot/conf/
sudo cp -L /etc/letsencrypt/live/seu-dominio.com/privkey.pem ./nginx/certbot/conf/

# Atualize a configuração do Nginx para HTTPS
# Edite o arquivo nginx/default.conf para incluir o bloco de servidor HTTPS

# Reinicie o container do Nginx
docker-compose restart nginx
\`\`\`

## 6. Comandos Úteis

### 6.1. Gerenciamento dos Containers

\`\`\`bash
# Iniciar os serviços
docker-compose up -d

# Parar os serviços
docker-compose down

# Reiniciar um serviço específico
docker-compose restart [nome_do_serviço]

# Ver logs de um serviço específico
docker-compose logs -f [nome_do_serviço]
\`\`\`

### 6.2. Gerenciamento do Banco de Dados

\`\`\`bash
# Acessar o banco de dados
docker-compose exec postgres psql -U trackadmin -d trackingdb

# Executar backup do banco de dados
docker-compose exec postgres pg_dump -U trackadmin trackingdb > backup_$(date +%Y%m%d).sql

# Restaurar backup
cat backup.sql | docker-compose exec -T postgres psql -U trackadmin -d trackingdb
\`\`\`

### 6.3. Executando Comandos do Projeto

\`\`\`bash
# Executar comandos npm
docker-compose exec node npm run [comando]

# Executar scripts PHP
docker-compose exec php php [script.php]
\`\`\`

## 7. Atualizações e Manutenção

\`\`\`bash
# Atualizar as imagens dos containers
docker-compose pull

# Recriar os containers com as novas imagens
docker-compose up -d --build

# Limpar volumes não utilizados
docker volume prune
\`\`\`

## Suporte e Manutenção

Para qualquer dúvida ou suporte, entre em contato:
- Email: suporte@sua-empresa.com
- Telefone: (00) 0000-0000`;

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Manual copiado para a área de transferência');
  };
  
  const handleDownload = (text, filename) => {
    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Manual baixado com sucesso');
  };
  
  const getActiveManualText = () => {
    switch(activeTab) {
      case 'ubuntu': return ubuntuManualText;
      case 'docker': return dockerManualText;
      default: return ubuntuManualText;
    }
  };
  
  const getDownloadFilename = () => {
    switch(activeTab) {
      case 'ubuntu': return 'manual_instalacao_ubuntu_22_04.md';
      case 'docker': return 'manual_instalacao_docker.md';
      default: return 'manual_instalacao.md';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="h-6 w-6 text-blue-500" />
          <h2 className="text-2xl font-semibold tracking-tight">Manual de Instalação</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleCopy(getActiveManualText())}
            className="flex items-center gap-2"
          >
            <Copy size={16} />
            <span>Copiar</span>
          </Button>
          <Button 
            size="sm" 
            onClick={() => handleDownload(getActiveManualText(), getDownloadFilename())}
            className="flex items-center gap-2"
          >
            <Download size={16} />
            <span>Baixar</span>
          </Button>
        </div>
      </div>
      
      <Card className="bg-white">
        <CardContent className="p-4">
          <Tabs defaultValue="ubuntu" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="ubuntu" className="flex items-center gap-2">
                <Server size={16} />
                <span>Ubuntu 22.04</span>
              </TabsTrigger>
              <TabsTrigger value="docker" className="flex items-center gap-2">
                <FolderTree size={16} />
                <span>Docker</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="ubuntu" className="space-y-4">
              <div className="rounded-md bg-amber-50 border border-amber-200 p-4 mb-4">
                <div className="flex gap-2">
                  <Info size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-800">Dica de Instalação</h4>
                    <p className="text-sm text-amber-700">
                      Este manual é para instalação completa em servidor Ubuntu 22.04 LTS. O manual inclui todos os passos necessários para configurar o ambiente de produção, incluindo banco de dados, servidor web e configurações de segurança.
                    </p>
                  </div>
                </div>
              </div>
              
              <Textarea 
                className="font-mono text-sm h-[500px] p-4 resize-none" 
                value={ubuntuManualText} 
                readOnly 
              />
            </TabsContent>
            
            <TabsContent value="docker" className="space-y-4">
              <div className="rounded-md bg-blue-50 border border-blue-200 p-4 mb-4">
                <div className="flex gap-2">
                  <Info size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800">Docker & Docker Compose</h4>
                    <p className="text-sm text-blue-700">
                      Esta versão do manual utiliza Docker e Docker Compose para uma instalação simplificada e portável. Ideal para ambientes de desenvolvimento e produção com configuração padronizada.
                    </p>
                  </div>
                </div>
              </div>
              
              <Textarea 
                className="font-mono text-sm h-[500px] p-4 resize-none" 
                value={dockerManualText} 
                readOnly 
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border rounded-xl flex flex-col items-center text-center">
          <Terminal size={24} className="text-blue-500 mb-2" />
          <h3 className="font-medium">Comandos Completos</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Todos os comandos necessários para instalação e configuração do sistema.
          </p>
        </div>
        
        <div className="p-4 border rounded-xl flex flex-col items-center text-center">
          <Database size={24} className="text-blue-500 mb-2" />
          <h3 className="font-medium">Configuração do Banco</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Instruções detalhadas para configuração do PostgreSQL e importação do esquema.
          </p>
        </div>
        
        <div className="p-4 border rounded-xl flex flex-col items-center text-center">
          <Shield size={24} className="text-blue-500 mb-2" />
          <h3 className="font-medium">Segurança e Backups</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Procedimentos para configurar firewall, SSL e rotinas de backup automático.
          </p>
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground">
        Este manual contém as instruções completas para instalar o sistema de rastreamento veicular em produção.
        Para qualquer dúvida adicional, entre em contato com o suporte técnico.
      </p>
    </div>
  );
};

export default InstallationManual;
