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
    if (reg_id) {
      try {
        await base44.asServiceRole.entities.Registration.update(reg_id, { status: "approved" });
      } catch (e) {
        console.error('Registration update failed:', e.message);
      }
    }

    // Send email invitation
    const emailBody = `שלום ${reg_full_name},\n\nהבקשה שלך אושרה!\n\nכניסה: https://app2class.base44.app\nאימייל: ${reg_email}\n\nצוות App2Class`;
    
    try {
      const emailRes = await base44.asServiceRole.integrations.Core.SendEmail({
        to: reg_email,
        subject: 'הזמנה להצטרף ל-App2Class',
        body: emailBody
      });
      console.log('Email sent:', emailRes);
    } catch (e) {
      console.error('Email send failed:', e.message);
      throw e;
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Approve error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});