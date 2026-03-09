import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { reg_id, reg_email, reg_full_name, reg_role } = await req.json();

    // Update registration status to approved
    await base44.asServiceRole.entities.Registration.update(reg_id, { status: "approved" });

    // Send email with invitation link
    const inviteLink = `${new URL(req.url).origin}/auth/invite?email=${encodeURIComponent(reg_email)}&role=${encodeURIComponent(reg_role)}`;
    
    await base44.asServiceRole.integrations.Core.SendEmail({
      to: reg_email,
      subject: 'הזמנה להצטרף ל-App2Class',
      body: `שלום ${reg_full_name},\n\nהבקשה שלך אושרה! בואנו להגדיר את הסיסמה שלך:\n\n${inviteLink}\n\nצוות App2Class`
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});