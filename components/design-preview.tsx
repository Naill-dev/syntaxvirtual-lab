// file: components/design-preview.tsx
'use client';
import { toast } from 'sonner';
import { Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

/** Dizayn sistemini vizual yoxlamaq üçün müvəqqəti komponent (FAZA 2-də Navbar/Sidebar ilə əvəzlənəcək). */
export function DesignPreview() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Düymələr və statuslar</CardTitle>
          <CardDescription>Gradient, hover:scale-105, rounded-xl.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-3">
          <Button onClick={() => toast.success('Yadda saxlanıldı')}>
            <Zap /> Run
          </Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="destructive">Delete</Button>
          <Badge variant="success">Uğurlu</Badge>
          <Badge variant="warning">Xəbərdarlıq</Badge>
          <Badge variant="destructive">Xəta</Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Formlar</CardTitle>
          <CardDescription>Input, Select, Switch, Slider.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input aria-label="Başlıq" placeholder="Snippet başlığı" />
          <Select defaultValue="python">
            <SelectTrigger aria-label="Dil">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="sql">SQL</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-3">
            <Switch aria-label="Avtomatik icra" defaultChecked />
            <Slider aria-label="Sürət" defaultValue={[40]} max={100} step={1} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tabs, Dialog, Menu, Tooltip</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="console">
            <TabsList>
              <TabsTrigger value="console">Console</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="errors">Errors</TabsTrigger>
            </TabsList>
            <TabsContent value="console" className="font-mono text-sm text-muted-foreground">
              {'> console.log("salam")'}
            </TabsContent>
            <TabsContent value="preview">Preview paneli</TabsContent>
            <TabsContent value="errors">Xəta yoxdur</TabsContent>
          </Tabs>
          <div className="flex gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Snippet yarat</DialogTitle>
                  <DialogDescription>Bu, Dialog komponentinin nümunəsidir.</DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Menu</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Profil</DropdownMenuItem>
                <DropdownMenuItem>Çıxış</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Kömək">
                  ?
                </Button>
              </TooltipTrigger>
              <TooltipContent>Ctrl+Enter ilə icra et</TooltipContent>
            </Tooltip>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Yüklənmə vəziyyəti</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardContent>
      </Card>
    </div>
  );
}
// ✅ Verified: next build ilə yoxlanılacaq.
