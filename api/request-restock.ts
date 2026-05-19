import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Configurar CORS se necessário
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { customer_name, customer_email, product_id, product_name, product_sku } = req.body;

  if (!customer_name || !customer_email || !product_id || !product_name) {
    return res.status(400).json({ error: 'Campos obrigatórios em falta no corpo da requisição.' });
  }

  const brevoApiKey = process.env.BREVO_API_KEY;

  if (!brevoApiKey) {
    console.error('Configuração do Brevo ausente: BREVO_API_KEY não foi encontrada.');
    return res.status(500).json({ error: 'Erro de configuração do servidor (Brevo).' });
  }

  // Email para o Administrador
  const adminEmailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #5c1d24;">Novo Pedido de Reposição de Stock</h2>
      <p>O cliente <strong>${customer_name}</strong> (${customer_email}) demonstrou interesse num produto atualmente esgotado.</p>
      
      <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #d4af37; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #333;">Detalhes do Produto:</h3>
        <p style="margin: 5px 0;"><strong>Produto:</strong> ${product_name}</p>
        <p style="margin: 5px 0;"><strong>Referência (SKU):</strong> ${product_sku || 'N/A'}</p>
        <p style="margin: 5px 0;"><strong>ID:</strong> ${product_id}</p>
      </div>
      
      <p>Pode contactar diretamente o cliente pelo email acima caso tenha previsão de chegada do produto ou pretenda recomendar uma alternativa.</p>
    </div>
  `;

  // Email para o Cliente
  const customerEmailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #5c1d24;">Recebemos o seu pedido!</h2>
      <p>Olá ${customer_name},</p>
      <p>Obrigado pelo seu interesse no produto <strong>${product_name}</strong>.</p>
      <p>Registámos o seu pedido de notificação. Assim que o artigo voltar a estar disponível no nosso stock, entraremos em contacto consigo através deste email.</p>
      <br>
      <p style="font-size: 14px; color: #5c1d24; font-weight: 500;">Com os melhores cumprimentos,<br>Socalcos - Vinhos & Gourmet</p>
    </div>
  `;

  try {
    // 1. Enviar Email para a Socalcos
    const adminResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': brevoApiKey,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: {
          name: "Loja Online Socalcos",
          email: "socalcosvinhosegourmet@gmail.com"
        },
        to: [
          {
            email: "socalcosvinhosegourmet@gmail.com",
            name: "Socalcos Administrador"
          }
        ],
        replyTo: {
          email: customer_email,
          name: customer_name
        },
        subject: `🚨 Pedido de Stock: ${product_name}`,
        htmlContent: adminEmailHtml
      })
    });

    if (!adminResponse.ok) {
      throw new Error(`Brevo API returned status ${adminResponse.status} for Admin Email`);
    }

    // 2. Enviar Email Cortesia para o Cliente
    const customerResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': brevoApiKey,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: {
          name: "Socalcos - Vinhos e Gourmet",
          email: "socalcosvinhosegourmet@gmail.com"
        },
        to: [
          {
            email: customer_email,
            name: customer_name
          }
        ],
        subject: `Pedido de Notificação de Stock: ${product_name}`,
        htmlContent: customerEmailHtml
      })
    });

    if (!customerResponse.ok) {
      console.warn('Failed to send courtesy email to customer, but admin email was sent.');
    }

    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Error sending restock request email:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
