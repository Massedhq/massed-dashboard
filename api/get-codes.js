import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  try {
    const sql = neon(process.env.DATABASE_URL);

    const result = await sql`
      SELECT 
        code,
        label,
        use_limit,
        uses_remaining,
        expiry_date
      FROM invites
      ORDER BY code DESC
    `;

    return res.status(200).json(result);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch codes' });
  }
}