import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    const { code, use_limit, expiry_date, created_by, label } = req.body;

    // Validate required fields
    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }

    // Insert the invite code into Neon
    await sql`
      INSERT INTO invites (code, use_limit, expiry_date, created_by, label, uses_remaining)
      VALUES (
        ${code.toUpperCase()},
        ${use_limit || 1},
        ${expiry_date || null},
        ${created_by || 'admin'},
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
