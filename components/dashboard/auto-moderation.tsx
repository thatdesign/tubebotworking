"use client";

import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

export function AutoModeration() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">AI Moderation</h2>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable AI Moderation</Label>
              <p className="text-sm text-muted-foreground">
                Automatically moderate comments using AI
              </p>
            </div>
            <Switch />
          </div>
          
          <div className="space-y-2">
            <Label>Sensitivity Level</Label>
            <Slider
              defaultValue={[50]}
              max={100}
              step={1}
            />
            <p className="text-sm text-muted-foreground">
              Adjust how strictly the AI moderates comments
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Spam Detection</h2>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-detect Spam</Label>
              <p className="text-sm text-muted-foreground">
                Automatically flag potential spam comments
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Block Known Spammers</Label>
              <p className="text-sm text-muted-foreground">
                Automatically block users with spam history
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </Card>
    </div>
  );
}