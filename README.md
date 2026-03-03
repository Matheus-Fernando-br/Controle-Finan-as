# Controle de Finanças

App de controle financeiro pessoal com login (Supabase), dashboard e API.

## Stack
FrontEnd: React + Vite (Vercel)  
BackEnd: Node.js + Express (Render)  
Auth/DB: Supabase

## Como rodar local
BackEnd:
- `cd BackEnd`
- `npm install`
- crie `BackEnd/.env` e preencha `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY`
- `npm run dev`

FrontEnd:
- `cd FrontEnd`
- `npm install`
- crie `FrontEnd/.env` e preencha `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_API_URL`
- `npm run dev`

## Deploy
- Render: subir o BackEnd e configurar as variáveis de ambiente.
- Vercel: subir o FrontEnd e configurar as variáveis de ambiente.