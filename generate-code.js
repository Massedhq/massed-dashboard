import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    const { code, use_limit, expiry_date, created_by, label } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }

    await sql`
      INSERT INTO invites (code, use_limit, expiry_date, label, uses_remaining)
      VALUES (
        ${code.toUpperCase()},
        ${use_limit || 1},
        ${expiry_date || null},
        ${label || code},
        ${use_limit || 1}
      )
      ON CONFLICT (code) DO NOTHING
    `;

    return res.status(200).json({ success: true, code: code.toUpperCase() });

  } catch (error) {
    console.error('Generate code error:', error);
    return res.status(500).json({ error: 'Failed to generate code' });
  }
}
