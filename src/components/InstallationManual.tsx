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

### 2.1. Instalação do Servidor Web (Apache)

\`\`\`bash
# Instale o Apache
sudo apt install -y apache2

# Habilite e inicie o serviço
sudo systemctl enable apache2
sudo systemctl start apache2

# Configure o firewall (se estiver ativo)
sudo ufw allow 'Apache Full'
\`\`\`

### 2.2. Instalação do PHP 8.1

\`\`\`bash
# Adicione repositório do PHP
sudo add-apt-repository ppa:ondrej/php -y
sudo apt update

# Instale PHP e extensões necessárias
sudo apt install -y php8.1 libapache2-mod-php8.1 php8.1-cli php8.1-mysql php8.1-pgsql php8.1-gd php8.1-curl php8.1-mbstring php8.1-xml php8.1-bcmath php8.1-intl php8.1-zip php8.1-soap

# Verifique a instalação
php -v

# Configure o PHP para o Apache
sudo nano /etc/php/8.1/apache2/php.ini
\`\`\`

Atualize os seguintes valores no php.ini:

\`\`\`
upload_max_filesize = 20M
post_max_size = 20M
max_execution_time = 300
memory_limit = 256M
\`\`\`

Reinicie o Apache após configurar o PHP:

\`\`\`bash
sudo systemctl restart apache2
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

### 3.1. Instalação do MySQL

\`\`\`bash
# Instale MySQL
sudo apt install -y mysql-server

# Inicie e habilite o serviço
sudo systemctl enable mysql
sudo systemctl start mysql

# Configure a segurança do MySQL
sudo mysql_secure_installation
\`\`\`

### 3.2. Configuração do Banco de Dados

\`\`\`bash
# Acesse o shell do MySQL
sudo mysql

# Crie um banco de dados para o sistema de rastreamento
CREATE DATABASE trackingdb;

# Crie um usuário para o sistema de rastreamento
CREATE USER 'trackuser'@'localhost' IDENTIFIED BY 'senha_segura';

# Conceda privilégios ao usuário
GRANT ALL PRIVILEGES ON trackingdb.* TO 'trackuser'@'localhost';
FLUSH PRIVILEGES;

# Saia do shell MySQL
EXIT;
\`\`\`

### 3.3. Importação da Estrutura do Banco de Dados

\`\`\`bash
# A partir do diretório do projeto
cd /var/www/html/sistema-rastreamento

# Importe o esquema do banco de dados
mysql -u trackuser -p trackingdb < src/utils/database.sql

# Verifique se as tabelas foram criadas
mysql -u trackuser -p -e "USE trackingdb; SHOW TABLES;"
\`\`\`

## 4. Configuração do Sistema de Rastreamento

### 4.1. Clone do Repositório

\`\`\`bash
# Clone o repositório do sistema (substitua pela URL real do seu repositório)
sudo apt install -y git
cd /var/www/html
sudo git clone https://github.com/sua-empresa/sistema-rastreamento.git
cd sistema-rastreamento

# Configure as permissões
sudo chown -R www-data:www-data /var/www/html/sistema-rastreamento
sudo chmod -R 755 /var/www/html/sistema-rastreamento
\`\`\`

### 4.2. Configuração do Frontend

\`\`\`bash
# Instale as dependências do frontend
cd /var/www/html/sistema-rastreamento
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
cd /var/www/html/sistema-rastreamento
sudo cp .env.example .env
sudo nano .env
\`\`\`

Adicione as seguintes variáveis (ajuste conforme necessário):

\`\`\`
# Configurações do Banco de Dados
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USER=trackuser
DB_PASSWORD=senha_segura
DB_NAME=trackingdb

# Configurações da API
API_PORT=3000
API_SECRET=sua_chave_secreta_da_api

# Configurações do WhatsApp
WHATSAPP_API_URL=https://whatsapp-api-url
WHATSAPP_API_TOKEN=seu_token_whatsapp
\`\`\`

### 4.4. Configuração do Apache como Virtual Host

\`\`\`bash
# Crie um arquivo de configuração para o site
sudo nano /etc/apache2/sites-available/tracking-system.conf
\`\`\`

Adicione a seguinte configuração:

\`\`\`
<VirtualHost *:80>
    ServerName seu-dominio.com
    ServerAlias www.seu-dominio.com
    ServerAdmin webmaster@localhost
    DocumentRoot /var/www/html/sistema-rastreamento/dist

    <Directory /var/www/html/sistema-rastreamento/dist>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
        
        # Para roteamento SPA (Single Page Application)
        <IfModule mod_rewrite.c>
            RewriteEngine On
            RewriteBase /
            RewriteRule ^index\.html$ - [L]
            RewriteCond %{REQUEST_FILENAME} !-f
            RewriteCond %{REQUEST_FILENAME} !-d
            RewriteRule . /index.html [L]
        </IfModule>
    </Directory>

    # API backend via proxy
    ProxyRequests Off
    ProxyPreserveHost On
    ProxyVia Full

    <Location /api>
        ProxyPass http://localhost:3000
        ProxyPassReverse http://localhost:3000
    </Location>

    # Configurações para upload de arquivos grandes
    <IfModule mod_proxy.c>
        ProxyTimeout 600
        ProxyBadHeader Ignore
    </IfModule>

    # Logs
    ErrorLog \${APACHE_LOG_DIR}/tracking-error.log
    CustomLog \${APACHE_LOG_DIR}/tracking-access.log combined
</VirtualHost>
\`\`\`

Ative o site e os módulos necessários, depois reinicie o Apache:

\`\`\`bash
# Habilite módulos necessários
sudo a2enmod rewrite
sudo a2enmod proxy
sudo a2enmod proxy_http

# Ative o site
sudo a2ensite tracking-system.conf

# Verifique a configuração
sudo apache2ctl configtest

# Reinicie o Apache
sudo systemctl restart apache2
\`\`\`

## 5. Configuração de SSL (HTTPS)

### 5.1. Instalação do Certbot

\`\`\`bash
# Instale o Certbot
sudo apt install -y certbot python3-certbot-apache

# Obtenha e configure o certificado SSL
sudo certbot --apache -d seu-dominio.com -d www.seu-dominio.com

# Configure a renovação automática
sudo systemctl status certbot.timer
\`\`\`

## 6. Configuração do Sistema de Backup

### 6.1. Instalação do Script de Backup

\`\`\`bash
# Crie o diretório de backups
sudo mkdir -p /var/backups/tracking_system

# Configure as permissões
sudo chown -R www-data:www-data /var/backups/tracking_system
\`\`\`

### 6.2. Configuração do Script de Backup

\`\`\`bash
# Crie o script de backup
sudo nano /etc/cron.daily/backup-tracking-db
\`\`\`

Adicione o seguinte conteúdo:

\`\`\`bash
#!/bin/bash
DATE=\$(date +%Y-%m-%d)
BACKUP_DIR="/var/backups/tracking_system"

# Backup do banco de dados
mysqldump -u trackuser -p'senha_segura' trackingdb > \$BACKUP_DIR/trackingdb_\$DATE.sql

# Comprima o backup
gzip -f \$BACKUP_DIR/trackingdb_\$DATE.sql

# Remova backups com mais de 30 dias
find \$BACKUP_DIR -name "trackingdb_*.sql.gz" -type f -mtime +30 -delete

# Backup dos arquivos do site
tar -czf \$BACKUP_DIR/tracking_files_\$DATE.tar.gz -C /var/www/html sistema-rastreamento

# Remova backups de arquivos com mais de 7 dias
find \$BACKUP_DIR -name "tracking_files_*.tar.gz" -type f -mtime +7 -delete
\`\`\`

Torne o script executável:

\`\`\`bash
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
sudo ufw allow 'Apache Full'

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

### 7.3. Hardening do Apache

\`\`\`bash
# Edite o arquivo de configuração principal do Apache
sudo nano /etc/apache2/conf-available/security.conf
\`\`\`

Atualize as seguintes configurações:

\`\`\`
# Desabilitar exposição de informações do servidor
ServerTokens Prod
ServerSignature Off

# Desabilitar rastreamento de links simbólicos
<Directory />
    Options -Indexes -FollowSymLinks
    AllowOverride None
    Require all denied
</Directory>

# Prevenção contra clickjacking
Header always append X-Frame-Options SAMEORIGIN
\`\`\`

Ative as configurações e reinicie o Apache:

\`\`\`bash
sudo a2enmod headers
sudo systemctl restart apache2
\`\`\`

## 8. Inicialização e Verificação do Sistema

### 8.1. Inicialização dos Serviços

\`\`\`bash
# Verifique se todos os serviços estão ativos
sudo systemctl status apache2
sudo systemctl status mysql
sudo pm2 status

# Reinicie os serviços se necessário
sudo systemctl restart apache2
sudo systemctl restart mysql
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
/var/www/html/sistema-rastreamento/
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
# Logs do Apache
sudo tail -f /var/log/apache2/tracking-access.log
sudo tail -f /var/log/apache2/tracking-error.log

# Logs do MySQL
sudo tail -f /var/log/mysql/error.log

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
cd /var/www/html/sistema-rastreamento
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
cd /var/www/html/sistema-rastreamento
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
├── apache/
│   └── vhost.conf
├── php/
│   └── Dockerfile
└── mysql/
    └── init.sql
\`\`\`

## 3. Configuração dos Arquivos Docker

### 3.1. Arquivo docker-compose.yml

\`\`\`yaml
version: '3.8'

services:
  apache:
    image: httpd:2.4-alpine
    container_name: tracking_apache
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./apache/vhost.conf:/usr/local/apache2/conf/extra/vhost.conf
      - ./:/var/www/html
      - ./apache/certbot/conf:/etc/letsencrypt
      - ./apache/certbot/www:/var/www/certbot
    depends_on:
      - php
    networks:
      - tracking_network
    restart: unless-stopped
    command: sh -c "echo 'Include conf/extra/vhost.conf' >> /usr/local/apache2/conf/httpd.conf && httpd-foreground"

  php:
    build:
      context: ./php
    container_name: tracking_php
    volumes:
      - ./:/var/www/html
    depends_on:
      - mysql
    networks:
      - tracking_network
    restart: unless-stopped

  mysql:
    image: mysql:8.0
    container_name: tracking_mysql
    environment:
      MYSQL_DATABASE: \${DB_NAME}
      MYSQL_USER: \${DB_USER}
      MYSQL_PASSWORD: \${DB_PASSWORD}
      MYSQL_ROOT_PASSWORD: \${DB_ROOT_PASSWORD}
    volumes:
      - mysql_data:/var/lib/mysql
      - ./mysql/init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "3306:3306"
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
  mysql_data:
\`\`\`

### 3.2. Arquivo .env

\`\`\`
# Configurações do Banco de Dados
DB_NAME=trackingdb
DB_USER=trackuser
DB_PASSWORD=senha_segura
DB_ROOT_PASSWORD=root_senha_segura
DB_HOST=mysql

# Configurações da Aplicação
APP_URL=http://localhost
APP_ENV=production

# Configurações do WhatsApp
WHATSAPP_API_URL=https://whatsapp-api-url
WHATSAPP_API_TOKEN=seu_token_whatsapp
\`\`\`

### 3.3. Arquivo apache/vhost.conf

\`\`\`apache
LoadModule proxy_module modules/mod_proxy.so
LoadModule proxy_http_module modules/mod_proxy_http.so
LoadModule rewrite_module modules/mod_rewrite.so

<VirtualHost *:80>
    ServerName localhost
    DocumentRoot /var/www/html/dist
    
    <Directory /var/www/html/dist>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
        
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
    
    ProxyRequests Off
    ProxyPreserveHost On
    
    <Location /api>
        ProxyPass http://node:3000
        ProxyPassReverse http://node:3000
    </Location>
    
    ErrorLog /var/log/apache2/tracking-error.log
    CustomLog /var/log/apache2/tracking-access.log combined
</VirtualHost>
\`\`\`

### 3.4. Arquivo php/Dockerfile

\`\`\`dockerfile
FROM php:8.1-apache

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
    pdo_mysql \
    mysqli \
    gd \
    zip

# Configure o PHP para produção
RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"

# Aumente os limites de upload e tempo de execução
RUN echo "upload_max_filesize = 20M" >> "$PHP_INI_DIR/php.ini" \
    && echo "post_max_size = 20M" >> "$PHP_INI_DIR/php.ini" \
    && echo "max_execution_time = 300" >> "$PHP_INI_DIR/php.ini"

# Ative os módulos do Apache
RUN a2enmod rewrite proxy proxy_http

WORKDIR /var/www/html
\`\`\`

### 3.5. Arquivo mysql/init.sql

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
sudo certbot certonly --webroot -w ./apache/certbot/www -d seu-dominio.com -d www.seu-dominio.com

# Copie os certificados para o diretório do Docker
sudo cp -L /etc/letsencrypt/live/seu-dominio.com/fullchain.pem ./apache/certbot/conf/
sudo cp -L /etc/letsencrypt/live/seu-dominio.com/privkey.pem ./apache/certbot/conf/

# Atualize a configuração do Apache para HTTPS
# Edite o arquivo apache/vhost.conf para incluir o bloco de servidor HTTPS

# Reinicie o container do Apache
docker-compose restart apache
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
docker-compose exec mysql mysql -u trackuser -p trackingdb

# Executar backup do banco de dados
docker-compose exec mysql mysqldump -u trackuser -p trackingdb > backup_$(date +%Y%m%d).sql

# Restaurar backup
cat backup.sql | docker-compose exec -T mysql mysql -u trackuser -p trackingdb
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
                <span>Ubuntu 22.04 com Apache</span>
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
                      Este manual é para instalação completa em servidor Ubuntu 22.04 LTS com Apache e PHP 8.1. O manual inclui todos os passos necessários para configurar o ambiente de produção, incluindo banco de dados, servidor web e configurações de segurança.
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
                      Esta versão do manual utiliza Docker e Docker Compose para uma instalação simplificada e portável. Configuramos Apache ao invés de Nginx para compatibilidade com aplicações PHP tradicionais.
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
            Instruções detalhadas para configuração do MySQL e importação do esquema.
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
