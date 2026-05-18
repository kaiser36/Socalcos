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

  const { customer_name, customer_email, total, items, order_id } = req.body;

  if (!customer_name || !customer_email || !items || !order_id) {
    return res.status(400).json({ error: 'Campos obrigatórios em falta no corpo da requisição.' });
  }

  const brevoApiKey = process.env.BREVO_API_KEY;

  if (!brevoApiKey) {
    console.error('Configuração do Brevo ausente: BREVO_API_KEY não foi encontrada.');
    return res.status(500).json({ error: 'Erro de configuração do servidor (Brevo).' });
  }

  // Formatador de preço em Euros
  const formatPrice = (val: number) => 
    new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(val);

  // Construir a tabela de produtos em HTML
  const itemsHtml = items.map((item: any) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eeeeee; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; color: #1a1a1a; line-height: 1.4;">
        ${item.name}
      </td>
      <td align="center" style="padding: 12px; border-bottom: 1px solid #eeeeee; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; color: #4a4a4a;">
        ${item.quantity}
      </td>
      <td align="right" style="padding: 12px; border-bottom: 1px solid #eeeeee; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; color: #1a1a1a; font-weight: 600; text-align: right;">
        ${formatPrice(item.price * item.quantity)}
      </td>
    </tr>
  `).join('');

  // Template de Email HTML premium com design elegante
  const emailHtml = `
    <!DOCTYPE html>
    <html lang="pt">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Pedido de Encomenda #${order_id} - Socalcos</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #faf9f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #faf9f6; padding: 40px 10px;">
        <tr>
          <td align="center">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border: 1px solid #eaeaea; border-radius: 4px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
              
              <!-- Cabeçalho Elegante (Bordô Premium da Socalcos) -->
              <tr>
                <td style="background-color: #5c1d24; padding: 45px 20px; text-align: center; border-bottom: 4px solid #d4af37;">
                  <h1 style="color: #ffffff; margin: 0; font-family: 'Times New Roman', Times, Georgia, serif; font-size: 32px; font-weight: normal; letter-spacing: 4px; text-transform: uppercase;">
                    Socalcos
                  </h1>
                  <p style="color: #d4af37; margin: 8px 0 0 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; text-transform: uppercase; letter-spacing: 4px; font-weight: 700;">
                    Vinhos & Gourmet
                  </p>
                </td>
              </tr>

              <!-- Conteúdo Principal -->
              <tr>
                <td style="padding: 40px 30px; background-color: #ffffff;">
                  <h2 style="font-family: 'Times New Roman', Times, Georgia, serif; font-size: 22px; color: #1a1a1a; margin-top: 0; margin-bottom: 20px; font-weight: normal; border-bottom: 1px solid #f0edeb; padding-bottom: 15px;">
                    Olá ${customer_name},
                  </h2>
                  <p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 15px; color: #4a4a4a; line-height: 1.6; margin-bottom: 20px;">
                    Agradecemos a sua preferência na <strong>Socalcos - Vinhos e Gourmet</strong>!
                  </p>
                  <p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 15px; color: #4a4a4a; line-height: 1.6; margin-bottom: 30px;">
                    Recebemos o pedido da sua encomenda (referência: <strong>#${order_id}</strong>) com sucesso. 
                    Neste momento, a nossa equipa está a <strong>validar o stock disponível e a calcular os portes de envio exatos</strong>. 
                    Entraremos em contacto muito brevemente por email ou telefone para confirmar tudo e fornecer as informações finais para pagamento e envio.
                  </p>

                  <!-- Aviso de Pagamento e Stock -->
                  <div style="background-color: #fbf8f2; border-left: 3px solid #d4af37; padding: 15px 20px; margin-bottom: 35px; border-radius: 2px;">
                    <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; color: #7c5e10; line-height: 1.5; font-weight: 500;">
                      <strong>Importante:</strong> Não necessita de efetuar qualquer pagamento agora. Aguarde pelo nosso contacto direto com a confirmação final da encomenda.
                    </p>
                  </div>

                  <!-- Tabela do Resumo da Encomenda -->
                  <h3 style="font-family: 'Times New Roman', Times, Georgia, serif; font-size: 16px; color: #5c1d24; border-bottom: 1px solid #5c1d24; padding-bottom: 8px; margin-top: 0; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">
                    Resumo do Pedido #${order_id}
                  </h3>
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 35px; border-collapse: collapse;">
                    <thead>
                      <tr style="background-color: #fcfbfa;">
                        <th align="left" style="padding: 10px 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; color: #7a7a7a; text-transform: uppercase; font-weight: bold; border-bottom: 2px solid #eaeaea;">Artigo</th>
                        <th align="center" style="padding: 10px 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; color: #7a7a7a; text-transform: uppercase; font-weight: bold; border-bottom: 2px solid #eaeaea; width: 60px;">Qtd</th>
                        <th align="right" style="padding: 10px 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; color: #7a7a7a; text-transform: uppercase; font-weight: bold; border-bottom: 2px solid #eaeaea; text-align: right; width: 100px;">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${itemsHtml}
                      <tr>
                        <td colspan="2" align="right" style="padding: 18px 12px 10px 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; color: #4a4a4a; font-weight: 500; text-align: right;">
                          Subtotal dos Artigos:
                        </td>
                        <td align="right" style="padding: 18px 12px 10px 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; color: #1a1a1a; font-weight: 600; text-align: right;">
                          ${formatPrice(total)}
                        </td>
                      </tr>
                      <tr>
                        <td colspan="2" align="right" style="padding: 5px 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; color: #4a4a4a; font-weight: 500; text-align: right;">
                          Portes de Envio:
                        </td>
                        <td align="right" style="padding: 5px 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; color: #7a7a7a; font-style: italic; text-align: right;">
                          A calcular
                        </td>
                      </tr>
                      <tr>
                        <td colspan="2" align="right" style="padding: 12px 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; font-weight: bold; color: #1a1a1a; border-top: 1px solid #eaeaea; text-align: right;">
                          Total Estimado (c/ IVA):
                        </td>
                        <td align="right" style="padding: 12px 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 16px; font-weight: bold; color: #5c1d24; border-top: 1px solid #eaeaea; text-align: right;">
                          ${formatPrice(total)}
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <!-- Mensagem de Rodapé -->
                  <p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; color: #5c1d24; font-weight: 500; margin-bottom: 5px;">
                    Com os nossos melhores cumprimentos,
                  </p>
                  <p style="font-family: 'Times New Roman', Times, Georgia, serif; font-size: 18px; color: #1a1a1a; margin: 0; font-style: italic;">
                    Socalcos - Vinhos & Gourmet
                  </p>
                </td>
              </tr>

              <!-- Rodapé Menor (Informações Legais / Contactos) -->
              <tr>
                <td style="background-color: #faf9f6; padding: 25px 30px; text-align: center; border-top: 1px solid #eaeaea;">
                  <p style="margin: 0 0 8px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; color: #8a8a8a; line-height: 1.5;">
                    Socalcos Vinhos & Gourmet &copy; 2026. Todos os direitos reservados.
                  </p>
                  <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 10px; color: #b0b0b0;">
                    Este email é um aviso de receção automático. Por favor, não responda diretamente para endereços automáticos não monitorizados.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
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
        bcc: [
          {
            email: "socalcosvinhosegourmet@gmail.com",
            name: "Socalcos Administrador"
          }
        ],
        replyTo: {
          email: "socalcosvinhosegourmet@gmail.com",
          name: "Socalcos Vinhos e Gourmet"
        },
        subject: `Confirmação de Pedido #${order_id} - Socalcos`,
        htmlContent: emailHtml
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Brevo API Error:', errorText);
      throw new Error(`Brevo API returned status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return res.status(200).json({ success: true, messageId: data.messageId });
  } catch (error: any) {
    console.error('Error sending email:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
