import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Mail, 
  Eye, 
  MousePointer, 
  Send, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  TrendingUp,
  Users,
  RefreshCw
} from "lucide-react";

interface Campaign {
  id: string;
  subject: string;
  status: string;
  scheduled_at: string | null;
  sent_at: string | null;
  total_recipients: number;
  sent_count: number;
  failed_count: number;
  open_count: number;
  click_count: number;
  created_at: string;
}

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ReactNode }> = {
  draft: { label: "Draft", variant: "secondary", icon: <Clock className="h-3 w-3" /> },
  scheduled: { label: "Scheduled", variant: "outline", icon: <Clock className="h-3 w-3" /> },
  sending: { label: "Sending", variant: "default", icon: <Send className="h-3 w-3 animate-pulse" /> },
  sent: { label: "Sent", variant: "default", icon: <CheckCircle className="h-3 w-3" /> },
  failed: { label: "Failed", variant: "destructive", icon: <AlertCircle className="h-3 w-3" /> },
};

export const CampaignAnalytics = () => {
  const { data: campaigns = [], isLoading, refetch } = useQuery({
    queryKey: ["newsletter-campaigns"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("newsletter_campaigns")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Campaign[];
    },
  });

  // Calculate overall stats
  const totalCampaigns = campaigns.length;
  const totalSent = campaigns.reduce((sum, c) => sum + c.sent_count, 0);
  const totalOpens = campaigns.reduce((sum, c) => sum + c.open_count, 0);
  const totalClicks = campaigns.reduce((sum, c) => sum + c.click_count, 0);
  const avgOpenRate = totalSent > 0 ? (totalOpens / totalSent) * 100 : 0;
  const avgClickRate = totalOpens > 0 ? (totalClicks / totalOpens) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Campaign Analytics</h2>
          <p className="text-muted-foreground">Track newsletter performance and engagement</p>
        </div>
        <Button variant="outline" onClick={() => refetch()} size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Campaigns</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCampaigns}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Emails Sent</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSent.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Open Rate</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgOpenRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">{totalOpens.toLocaleString()} opens</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Click Rate</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgClickRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">{totalClicks.toLocaleString()} clicks</p>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns Table */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign History</CardTitle>
          <CardDescription>All newsletter campaigns and their performance</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : campaigns.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No campaigns yet</p>
              <p className="text-sm">Send your first newsletter to see analytics here</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sent</TableHead>
                  <TableHead>Opens</TableHead>
                  <TableHead>Clicks</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((campaign) => {
                  const openRate = campaign.sent_count > 0 
                    ? (campaign.open_count / campaign.sent_count) * 100 
                    : 0;
                  const clickRate = campaign.open_count > 0 
                    ? (campaign.click_count / campaign.open_count) * 100 
                    : 0;
                  const status = statusConfig[campaign.status] || statusConfig.draft;

                  return (
                    <TableRow key={campaign.id}>
                      <TableCell>
                        <div className="max-w-[200px]">
                          <p className="font-medium truncate">{campaign.subject}</p>
                          <p className="text-xs text-muted-foreground">
                            {campaign.total_recipients} recipients
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={status.variant} className="gap-1">
                          {status.icon}
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <span className="font-medium">{campaign.sent_count}</span>
                          {campaign.failed_count > 0 && (
                            <span className="text-xs text-destructive ml-1">
                              ({campaign.failed_count} failed)
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{campaign.open_count}</span>
                            <span className="text-xs text-muted-foreground">({openRate.toFixed(1)}%)</span>
                          </div>
                          <Progress value={openRate} className="h-1" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{campaign.click_count}</span>
                            <span className="text-xs text-muted-foreground">({clickRate.toFixed(1)}%)</span>
                          </div>
                          <Progress value={clickRate} className="h-1" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {campaign.sent_at 
                            ? format(new Date(campaign.sent_at), "MMM d, yyyy")
                            : campaign.scheduled_at
                            ? format(new Date(campaign.scheduled_at), "MMM d, yyyy")
                            : format(new Date(campaign.created_at), "MMM d, yyyy")}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {campaign.sent_at 
                            ? format(new Date(campaign.sent_at), "h:mm a")
                            : campaign.scheduled_at
                            ? `Scheduled: ${format(new Date(campaign.scheduled_at), "h:mm a")}`
                            : "Draft"}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};