
import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';
import { Copy, Download, FileText } from 'lucide-react';

const InstallationManual = () => {
  const manualText = `# Manual de Instalação do Sistema de Rastreamento Veicular no Ubuntu 22.04

## Requisitos de Sistema
- Ubuntu Server 22.04 LTS
- 4GB RAM mínimo (8GB recomendado)
- 50GB de espaço em disco
- Conexão com a internet

## 1. Atualização do Sistema

\`\`\`bash
sudo apt update
sudo apt upgrade -y
\`\`\`

## 2. Instalação de Dependências

\`\`\`bash
sudo apt install -y curl wget git build-essential nodejs npm
\`\`\`

## 3. Instalação do Node.js e NPM

\`\`\`bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
\`\`\`

Verifique a instalação:
\`\`\`bash
node -v
npm -v
\`\`\`

## 4. Instalação do Banco de Dados PostgreSQL

\`\`\`bash
sudo apt install -y postgresql postgresql-contrib
\`\`\`

Configure o PostgreSQL:
\`\`\`bash
sudo -i -u postgres
createuser --interactive
# Crie um usuário 'trackadmin' com permissões de superuser
createdb trackingdb
exit
\`\`\`

## 5. Configuração do Banco de Dados

\`\`\`bash
sudo -u postgres psql
ALTER USER trackadmin WITH PASSWORD 'sua_senha_segura';
\\q
\`\`\`

## 6. Clonando o Repositório

\`\`\`bash
git clone https://github.com/sua-empresa/sistema-rastreamento.git
cd sistema-rastreamento
\`\`\`

## 7. Instalação de Dependências do Projeto

\`\`\`bash
npm install
\`\`\`

## 8. Configuração de Variáveis de Ambiente

Crie um arquivo .env:
\`\`\`bash
cp .env.example .env
nano .env
\`\`\`

Configure as seguintes variáveis:
\`\`\`
DB_USER=trackadmin
DB_PASSWORD=sua_senha_segura
DB_NAME=trackingdb
DB_HOST=localhost
DB_PORT=5432
API_KEY=sua_chave_api_whatsapp
\`\`\`

## 9. Inicialização do Banco de Dados

\`\`\`bash
npm run migrate
npm run seed
\`\`\`

## 10. Compilação do Projeto

\`\`\`bash
npm run build
\`\`\`

## 11. Configuração do PM2 para Execução em Background

\`\`\`bash
sudo npm install pm2 -g
pm2 start npm --name "tracking-system" -- start
pm2 startup
pm2 save
\`\`\`

## 12. Configuração do Nginx como Proxy Reverso

\`\`\`bash
sudo apt install -y nginx
sudo nano /etc/nginx/sites-available/tracking-system
\`\`\`

Adicione a seguinte configuração:
\`\`\`
server {
    listen 80;
    server_name seu-dominio.com www.seu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
\`\`\`

Ative o site e reinicie o Nginx:
\`\`\`bash
sudo ln -s /etc/nginx/sites-available/tracking-system /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
\`\`\`

## 13. Configuração do SSL com Certbot

\`\`\`bash
sudo apt install -y python3-certbot-nginx
sudo certbot --nginx -d seu-dominio.com -d www.seu-dominio.com
\`\`\`

## 14. Verificação da Instalação

Acesse seu site em https://seu-dominio.com e faça login com as credenciais padrão:

- Email: admin@example.com
- Senha: admin123

IMPORTANTE: Altere a senha padrão após o primeiro login!

## 15. Configuração de Backups

\`\`\`bash
sudo mkdir /var/backups/tracking-system
sudo nano /etc/cron.daily/backup-tracking-db
\`\`\`

Adicione o seguinte script:
\`\`\`bash
#!/bin/bash
BACKUP_DIR="/var/backups/tracking-system"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
sudo -u postgres pg_dump trackingdb > "$BACKUP_DIR/trackingdb_$TIMESTAMP.sql"
find $BACKUP_DIR -name "trackingdb_*.sql" -mtime +7 -delete
\`\`\`

Torne o script executável:
\`\`\`bash
sudo chmod +x /etc/cron.daily/backup-tracking-db
\`\`\`

## Suporte e Manutenção

Para qualquer dúvida ou suporte, entre em contato:
- Email: suporte@sua-empresa.com
- Telefone: (00) 0000-0000`;

  const handleCopy = () => {
    navigator.clipboard.writeText(manualText);
    toast.success('Manual copiado para a área de transferência');
  };
  
  const handleDownload = () => {
    const blob = new Blob([manualText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'manual_instalacao_ubuntu.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Manual baixado com sucesso');
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
            onClick={handleCopy}
            className="flex items-center gap-2"
          >
            <Copy size={16} />
            <span>Copiar</span>
          </Button>
          <Button 
            size="sm" 
            onClick={handleDownload}
            className="flex items-center gap-2"
          >
            <Download size={16} />
            <span>Baixar</span>
          </Button>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-subtle overflow-hidden">
        <Textarea 
          className="font-mono text-sm h-[600px] p-4 resize-none" 
          value={manualText} 
          readOnly 
        />
      </div>
      
      <p className="text-sm text-muted-foreground">
        Este manual contém as instruções para instalar o sistema de rastreamento veicular em um servidor Ubuntu 22.04.
        Para qualquer dúvida adicional, entre em contato com o suporte.
      </p>
    </div>
  );
};

export default InstallationManual;
