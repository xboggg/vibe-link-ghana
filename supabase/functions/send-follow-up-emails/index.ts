import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Order {
  id: string;
  client_name: string;
  client_email: string;
  event_title: string;
  event_type: string;
  event_date: string | null;
  package_name: string;
  total_price: number;
  order_status: string;
  payment_status: string;
  created_at: string;
  updated_at: string;
}

type FollowUpType = 
  | "payment_reminder_3_days"
  | "payment_reminder_7_days"
  | "inactive_order_5_days"
  | "draft_review_reminder"
  | "completion_thank_you";

const followUpConfig: Record<FollowUpType, { 
  subject: string; 
  emoji: string;
  daysSinceCondition: number;
}> = {
  payment_reminder_3_days: {
    subject: "Friendly Reminder: Complete Your Payment",
    emoji: "💳",
    daysSinceCondition: 3,
  },
  payment_reminder_7_days: {
    subject: "Your Order is Waiting - Payment Needed",
    emoji: "⏰",
    daysSinceCondition: 7,
  },
  inactive_order_5_days: {
    subject: "We Miss You! Your Order Awaits",
    emoji: "👋",
    daysSinceCondition: 5,
  },
  draft_review_reminder: {
    subject: "Your Draft is Ready for Review!",
    emoji: "👀",
    daysSinceCondition: 2,
  },
  completion_thank_you: {
    subject: "Thank You for Choosing VibeLink Ghana!",
    emoji: "🎉",
    daysSinceCondition: 1,
  },
};

const getFollowUpEmailHtml = (order: Order, followUpType: FollowUpType): string => {
  const config = followUpConfig[followUpType];
  
  const ctaButton = followUpType === "completion_thank_you" 
    ? `<a href="https://vibelinkgh.com/portfolio" style="display: inline-block; background: linear-gradient(135deg, #6B46C1 0%, #D4AF37 100%); color: #ffffff; text-decoration: none; padding: 16px 36px; border-radius: 10px; font-weight: 600; font-size: 16px;">View Our Portfolio</a>`
    : `<a href="https://wa.me/233245817973" style="display: inline-block; background: linear-gradient(135deg, #25D366 0%, #128C7E 100%); color: #ffffff; text-decoration: none; padding: 16px 36px; border-radius: 10px; font-weight: 600; font-size: 16px;">💬 Contact Us on WhatsApp</a>`;

  let messageContent = "";
  
  switch (followUpType) {
    case "payment_reminder_3_days":
      messageContent = `
        <p style="margin: 0 0 20px 0; color: #555555; font-size: 16px; line-height: 1.7;">
          We noticed that your order for <strong style="color: #6B46C1;">${order.event_title}</strong> is still awaiting payment. 
          To ensure we can start working on your beautiful design, please complete your deposit payment at your earliest convenience.
        </p>
        <div style="background-color: #fff3cd; border-radius: 12px; padding: 20px; margin: 25px 0; border-left: 4px solid #ffc107;">
          <h3 style="margin: 0 0 10px 0; color: #856404; font-size: 16px;">💰 Payment Details</h3>
          <p style="margin: 0; color: #856404; font-size: 14px;">
            <strong>Total Amount:</strong> GHS ${order.total_price.toLocaleString()}<br>
            <strong>Deposit Required (50%):</strong> GHS ${(order.total_price / 2).toLocaleString()}<br>
            <strong>Package:</strong> ${order.package_name}
          </p>
        </div>
        <p style="margin: 0 0 20px 0; color: #555555; font-size: 15px; line-height: 1.6;">
          Once we receive your deposit, our design team will immediately begin crafting your invitation!
        </p>
      `;
      break;
      
    case "payment_reminder_7_days":
      messageContent = `
        <p style="margin: 0 0 20px 0; color: #555555; font-size: 16px; line-height: 1.7;">
          It's been a week since you placed your order for <strong style="color: #6B46C1;">${order.event_title}</strong>. 
          We're excited to bring your vision to life, but we need your deposit to get started!
        </p>
        <div style="background-color: #ffe6e6; border-radius: 12px; padding: 20px; margin: 25px 0; border-left: 4px solid #e74c3c;">
          <h3 style="margin: 0 0 10px 0; color: #c0392b; font-size: 16px;">⚠️ Order On Hold</h3>
          <p style="margin: 0; color: #c0392b; font-size: 14px;">
            Your order will remain on hold until payment is received. Don't miss out on having the perfect invitation for your special day!
          </p>
        </div>
        <p style="margin: 0 0 20px 0; color: #555555; font-size: 15px; line-height: 1.6;">
          If you have any questions or need assistance with payment, please don't hesitate to reach out!
        </p>
      `;
      break;
      
    case "inactive_order_5_days":
      messageContent = `
        <p style="margin: 0 0 20px 0; color: #555555; font-size: 16px; line-height: 1.7;">
          We noticed your order for <strong style="color: #6B46C1;">${order.event_title}</strong> hasn't had any activity recently. 
          Is everything okay? We're here to help!
        </p>
        <div style="background-color: #e8f4fd; border-radius: 12px; padding: 20px; margin: 25px 0; border-left: 4px solid #3b82f6;">
          <h3 style="margin: 0 0 10px 0; color: #1e40af; font-size: 16px;">📋 Your Order Summary</h3>
          <p style="margin: 0; color: #1e40af; font-size: 14px;">
            <strong>Event:</strong> ${order.event_title}<br>
            <strong>Package:</strong> ${order.package_name}<br>
            <strong>Status:</strong> ${order.order_status.replace(/_/g, ' ').charAt(0).toUpperCase() + order.order_status.replace(/_/g, ' ').slice(1)}
          </p>
        </div>
        <p style="margin: 0 0 20px 0; color: #555555; font-size: 15px; line-height: 1.6;">
          If you need to make any changes or have questions, we'd love to hear from you!
        </p>
      `;
      break;
      
    case "draft_review_reminder":
      messageContent = `
        <p style="margin: 0 0 20px 0; color: #555555; font-size: 16px; line-height: 1.7;">
          Your draft design for <strong style="color: #6B46C1;">${order.event_title}</strong> has been ready for review for a couple of days now. 
          We'd love to hear your thoughts!
        </p>
        <div style="background-color: #f3e8ff; border-radius: 12px; padding: 20px; margin: 25px 0; border-left: 4px solid #8b5cf6;">
          <h3 style="margin: 0 0 10px 0; color: #6b21a8; font-size: 16px;">👀 Awaiting Your Feedback</h3>
          <p style="margin: 0; color: #6b21a8; font-size: 14px;">
            Please review your draft and let us know if you'd like any changes. We want to make sure it's perfect for your special occasion!
          </p>
        </div>
        <p style="margin: 0 0 20px 0; color: #555555; font-size: 15px; line-height: 1.6;">
          Once you approve the design, we'll finalize everything and get it ready for delivery!
        </p>
      `;
      break;
      
    case "completion_thank_you":
      messageContent = `
        <p style="margin: 0 0 20px 0; color: #555555; font-size: 16px; line-height: 1.7;">
          We hope you're thrilled with your invitation for <strong style="color: #6B46C1;">${order.event_title}</strong>! 
          It was our pleasure to be part of your special occasion.
        </p>
        <div style="background-color: #d4edda; border-radius: 12px; padding: 20px; margin: 25px 0; border-left: 4px solid #28a745;">
          <h3 style="margin: 0 0 10px 0; color: #155724; font-size: 16px;">⭐ We'd Love Your Feedback!</h3>
          <p style="margin: 0; color: #155724; font-size: 14px;">
            Your experience matters to us. If you loved our work, please consider recommending us to friends and family who might need beautiful event stationery!
          </p>
        </div>
        <p style="margin: 0 0 20px 0; color: #555555; font-size: 15px; line-height: 1.6;">
          Thank you for choosing VibeLink Ghana. We wish you a wonderful celebration! 🎉
        </p>
      `;
      break;
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${config.subject}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);">
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #6B46C1 0%, #D4AF37 100%); padding: 40px 30px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">
                    ✨ VibeLink Ghana
                  </h1>
                  <p style="margin: 12px 0 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">
                    Your Event. Our Vibe.
                  </p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <div style="text-align: center; margin-bottom: 25px;">
                    <span style="font-size: 50px;">${config.emoji}</span>
                  </div>
                  
                  <h2 style="margin: 0 0 25px 0; color: #333333; font-size: 22px; text-align: center;">
                    Hi ${order.client_name}!
                  </h2>
                  
                  ${messageContent}
                  
                  <!-- CTA Button -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                    <tr>
                      <td align="center">
                        ${ctaButton}
                      </td>
                    </tr>
                  </table>
                  
                  <p style="margin: 30px 0 0 0; color: #888888; font-size: 13px; line-height: 1.6; text-align: center;">
                    Order ID: #${order.id.substring(0, 8).toUpperCase()}
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #1a1a2e; padding: 30px; text-align: center;">
                  <p style="margin: 0 0 10px 0; color: #D4AF37; font-size: 18px; font-weight: bold;">
                    VibeLink Ghana
                  </p>
                  <p style="margin: 0 0 10px 0; color: rgba(255,255,255,0.7); font-size: 13px;">
                    Premium Event Stationery & Digital Invitations
                  </p>
                  <p style="margin: 0; color: rgba(255,255,255,0.5); font-size: 12px;">
                    © ${new Date().getFullYear()} VibeLink Ghana. All rights reserved.
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
};

const handler = async (req: Request): Promise<Response> => {
  console.log("send-follow-up-emails function called");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const now = new Date();
    const results: { type: string; sent: number; errors: number }[] = [];

    // 1. Payment reminder - 3 days (pending payment, order created 3+ days ago)
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    const { data: paymentReminder3Orders } = await supabase
      .from("orders")
      .select("*")
      .eq("payment_status", "pending")
      .neq("order_status", "cancelled")
      .lt("created_at", threeDaysAgo.toISOString());

    let sent3Day = 0, errors3Day = 0;
    for (const order of paymentReminder3Orders || []) {
      // Check if already sent this type of follow-up
      const { data: existingLog } = await supabase
        .from("follow_up_logs")
        .select("id")
        .eq("order_id", order.id)
        .eq("follow_up_type", "payment_reminder_3_days")
        .single();

      if (!existingLog) {
        try {
          await resend.emails.send({
            from: "VibeLink Ghana <orders@itdeshop.com>",
            to: [order.client_email],
            subject: `${followUpConfig.payment_reminder_3_days.emoji} ${followUpConfig.payment_reminder_3_days.subject} - ${order.event_title}`,
            html: getFollowUpEmailHtml(order, "payment_reminder_3_days"),
          });

          await supabase.from("follow_up_logs").insert({
            order_id: order.id,
            follow_up_type: "payment_reminder_3_days",
            success: true,
          });
          sent3Day++;
        } catch (error: any) {
          await supabase.from("follow_up_logs").insert({
            order_id: order.id,
            follow_up_type: "payment_reminder_3_days",
            success: false,
            error_message: error.message,
          });
          errors3Day++;
        }
      }
    }
    results.push({ type: "payment_reminder_3_days", sent: sent3Day, errors: errors3Day });

    // 2. Payment reminder - 7 days
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const { data: paymentReminder7Orders } = await supabase
      .from("orders")
      .select("*")
      .eq("payment_status", "pending")
      .neq("order_status", "cancelled")
      .lt("created_at", sevenDaysAgo.toISOString());

    let sent7Day = 0, errors7Day = 0;
    for (const order of paymentReminder7Orders || []) {
      const { data: existingLog } = await supabase
        .from("follow_up_logs")
        .select("id")
        .eq("order_id", order.id)
        .eq("follow_up_type", "payment_reminder_7_days")
        .single();

      if (!existingLog) {
        try {
          await resend.emails.send({
            from: "VibeLink Ghana <orders@itdeshop.com>",
            to: [order.client_email],
            subject: `${followUpConfig.payment_reminder_7_days.emoji} ${followUpConfig.payment_reminder_7_days.subject} - ${order.event_title}`,
            html: getFollowUpEmailHtml(order, "payment_reminder_7_days"),
          });

          await supabase.from("follow_up_logs").insert({
            order_id: order.id,
            follow_up_type: "payment_reminder_7_days",
            success: true,
          });
          sent7Day++;
        } catch (error: any) {
          await supabase.from("follow_up_logs").insert({
            order_id: order.id,
            follow_up_type: "payment_reminder_7_days",
            success: false,
            error_message: error.message,
          });
          errors7Day++;
        }
      }
    }
    results.push({ type: "payment_reminder_7_days", sent: sent7Day, errors: errors7Day });

    // 3. Draft review reminder - 2 days since draft_ready
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
    const { data: draftReminderOrders } = await supabase
      .from("orders")
      .select("*")
      .eq("order_status", "draft_ready")
      .lt("updated_at", twoDaysAgo.toISOString());

    let sentDraft = 0, errorsDraft = 0;
    for (const order of draftReminderOrders || []) {
      const { data: existingLog } = await supabase
        .from("follow_up_logs")
        .select("id")
        .eq("order_id", order.id)
        .eq("follow_up_type", "draft_review_reminder")
        .single();

      if (!existingLog) {
        try {
          await resend.emails.send({
            from: "VibeLink Ghana <orders@itdeshop.com>",
            to: [order.client_email],
            subject: `${followUpConfig.draft_review_reminder.emoji} ${followUpConfig.draft_review_reminder.subject} - ${order.event_title}`,
            html: getFollowUpEmailHtml(order, "draft_review_reminder"),
          });

          await supabase.from("follow_up_logs").insert({
            order_id: order.id,
            follow_up_type: "draft_review_reminder",
            success: true,
          });
          sentDraft++;
        } catch (error: any) {
          await supabase.from("follow_up_logs").insert({
            order_id: order.id,
            follow_up_type: "draft_review_reminder",
            success: false,
            error_message: error.message,
          });
          errorsDraft++;
        }
      }
    }
    results.push({ type: "draft_review_reminder", sent: sentDraft, errors: errorsDraft });

    // 4. Completion thank you - 1 day after completion
    const oneDayAgo = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);
    const { data: completedOrders } = await supabase
      .from("orders")
      .select("*")
      .eq("order_status", "completed")
      .lt("updated_at", oneDayAgo.toISOString());

    let sentThankYou = 0, errorsThankYou = 0;
    for (const order of completedOrders || []) {
      const { data: existingLog } = await supabase
        .from("follow_up_logs")
        .select("id")
        .eq("order_id", order.id)
        .eq("follow_up_type", "completion_thank_you")
        .single();

      if (!existingLog) {
        try {
          await resend.emails.send({
            from: "VibeLink Ghana <orders@itdeshop.com>",
            to: [order.client_email],
            subject: `${followUpConfig.completion_thank_you.emoji} ${followUpConfig.completion_thank_you.subject}`,
            html: getFollowUpEmailHtml(order, "completion_thank_you"),
          });

          await supabase.from("follow_up_logs").insert({
            order_id: order.id,
            follow_up_type: "completion_thank_you",
            success: true,
          });
          sentThankYou++;
        } catch (error: any) {
          await supabase.from("follow_up_logs").insert({
            order_id: order.id,
            follow_up_type: "completion_thank_you",
            success: false,
            error_message: error.message,
          });
          errorsThankYou++;
        }
      }
    }
    results.push({ type: "completion_thank_you", sent: sentThankYou, errors: errorsThankYou });

    console.log("Follow-up emails processing complete:", results);

    return new Response(
      JSON.stringify({ 
        success: true, 
        results,
        totalSent: results.reduce((sum, r) => sum + r.sent, 0),
        totalErrors: results.reduce((sum, r) => sum + r.errors, 0),
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-follow-up-emails function:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
