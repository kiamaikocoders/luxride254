import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { GeofenceMap } from '../components/GeofenceMap';
import {
  Search,
  Bell,
  MessageSquare,
  Settings as SettingsIcon,
  DollarSign,
  Tag,
  Bell as NotificationsIcon,
  Shield,
  Map,
  Save,
  History,
  Plus,
  Edit,
  TrendingUp,
  Users,
  Maximize2,
  Trash2,
  X,
  Calendar,
  Clock,
  Mail,
  Smartphone,
  Globe,
  FileText,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

interface PricingConfig {
  baseCurrency: string;
  distanceUnit: 'miles' | 'kilometers';
  taxRate: number;
  surgeEnabled: boolean;
  demandThreshold: number;
  minMultiplier: number;
  maxMultiplier: number;
}

interface ServiceClass {
  id: string;
  name: string;
  description: string;
  image?: string;
  baseFare: number;
  perMile: number;
  perMin: number;
  minFare: number;
}

interface GeofencePricing {
  id: string;
  name: string;
  type: 'fixed' | 'multiplier';
  value: number;
  status: 'active' | 'scheduled' | 'inactive';
  coordinates?: number[][];
  color?: string;
}

interface GeneralConfig {
  appName: string;
  supportEmail: string;
  supportPhone: string;
  timezone: string;
  language: string;
  maintenanceMode: boolean;
  apiRateLimit: number;
}

interface Promotion {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  status: 'active' | 'inactive' | 'expired';
  startDate: string;
  endDate: string;
  usageLimit?: number;
  usedCount: number;
  description: string;
}

interface NotificationTemplate {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'push';
  subject?: string;
  body: string;
  enabled: boolean;
}

interface CompliancePolicy {
  id: string;
  title: string;
  category: string;
  status: 'draft' | 'active' | 'archived';
  lastUpdated: string;
  content: string;
}

interface MapZone {
  id: string;
  name: string;
  type: 'service_area' | 'restricted' | 'priority';
  coordinates: number[][];
  status: 'active' | 'inactive';
  description?: string;
}

type SettingsTab = 'general' | 'pricing' | 'promotions' | 'notifications' | 'compliance' | 'mapzones';

export function Settings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('pricing');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [pricingConfig, setPricingConfig] = useState<PricingConfig>({
    baseCurrency: 'KES',
    distanceUnit: 'kilometers',
    taxRate: 8.5,
    surgeEnabled: true,
    demandThreshold: 50,
    minMultiplier: 1.2,
    maxMultiplier: 3.5,
  });

  const [serviceClasses, setServiceClasses] = useState<ServiceClass[]>([
    {
      id: 'standard',
      name: 'Standard',
      description: '4 Seats • Everyday rides',
      baseFare: 5.0,
      perMile: 1.25,
      perMin: 0.28,
      minFare: 7.0,
    },
    {
      id: 'premium',
      name: 'Premium',
      description: '4 Seats • Luxury vehicles',
      baseFare: 12.0,
      perMile: 2.8,
      perMin: 0.55,
      minFare: 15.0,
    },
    {
      id: 'van',
      name: 'Van / SUV',
      description: '6 Seats • Group travel',
      baseFare: 9.0,
      perMile: 2.1,
      perMin: 0.4,
      minFare: 11.0,
    },
  ]);

  const [geofences, setGeofences] = useState<GeofencePricing[]>([
    {
      id: '1',
      name: 'Downtown Airport (JKIA)',
      type: 'fixed',
      value: 5.0,
      status: 'active',
      coordinates: [
        [36.9278, -1.3192],
        [36.935, -1.315],
        [36.94, -1.325],
        [36.93, -1.33],
        [36.9278, -1.3192],
      ],
      color: '#3b82f6',
    },
    {
      id: '2',
      name: 'Stadium Events',
      type: 'multiplier',
      value: 1.5,
      status: 'scheduled',
      coordinates: [
        [36.82, -1.27],
        [36.83, -1.27],
        [36.83, -1.28],
        [36.82, -1.28],
        [36.82, -1.27],
      ],
      color: '#a855f7',
    },
  ]);

  const [generalConfig, setGeneralConfig] = useState<GeneralConfig>({
    appName: 'LuxeRide',
    supportEmail: 'support@luxeride.com',
    supportPhone: '+254 700 000 000',
    timezone: 'Africa/Nairobi',
    language: 'en',
    maintenanceMode: false,
    apiRateLimit: 1000,
  });

  const [promotions, setPromotions] = useState<Promotion[]>([
    {
      id: '1',
      code: 'WELCOME20',
      type: 'percentage',
      value: 20,
      status: 'active',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      usageLimit: 1000,
      usedCount: 342,
      description: 'Welcome discount for new users',
    },
    {
      id: '2',
      code: 'PREMIUM50',
      type: 'fixed',
      value: 50,
      status: 'active',
      startDate: '2024-01-15',
      endDate: '2024-02-15',
      usageLimit: 500,
      usedCount: 128,
      description: 'Premium package discount',
    },
  ]);

  const [notificationTemplates, setNotificationTemplates] = useState<NotificationTemplate[]>([
    {
      id: '1',
      name: 'Ride Confirmation',
      type: 'email',
      subject: 'Your ride has been confirmed',
      body: 'Hello {{user_name}},\n\nYour ride request has been confirmed. Driver {{driver_name}} will arrive shortly.\n\nPickup: {{pickup_address}}\nDestination: {{destination_address}}\n\nThank you for choosing LuxeRide!',
      enabled: true,
    },
    {
      id: '2',
      name: 'Ride Status Update',
      type: 'sms',
      body: 'Your LuxeRide driver {{driver_name}} is on the way. ETA: {{eta}} minutes.',
      enabled: true,
    },
  ]);

  const [compliancePolicies, setCompliancePolicies] = useState<CompliancePolicy[]>([
    {
      id: '1',
      title: 'Terms of Service',
      category: 'Legal',
      status: 'active',
      lastUpdated: '2024-01-15',
      content: 'Terms of service content...',
    },
    {
      id: '2',
      title: 'Privacy Policy',
      category: 'Legal',
      status: 'active',
      lastUpdated: '2024-01-10',
      content: 'Privacy policy content...',
    },
  ]);

  const [mapZones, setMapZones] = useState<MapZone[]>([
    {
      id: '1',
      name: 'Nairobi Service Area',
      type: 'service_area',
      coordinates: [
        [36.7, -1.35],
        [36.9, -1.35],
        [36.9, -1.25],
        [36.7, -1.25],
        [36.7, -1.35],
      ],
      status: 'active',
      description: 'Primary service area for Nairobi',
    },
  ]);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      // Load pricing config from database if it exists
      const { data } = await supabase.from('app_settings').select('*').eq('key', 'pricing_config').single();
      if (data?.value) {
        const config = JSON.parse(data.value);
        setPricingConfig({ ...pricingConfig, ...config });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      // Save pricing config
      await supabase.from('app_settings').upsert(
        {
          key: 'pricing_config',
          value: JSON.stringify(pricingConfig),
        },
        { onConflict: 'key' }
      );

      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const updateServiceClass = (id: string, field: keyof ServiceClass, value: any) => {
    setServiceClasses((classes) =>
      classes.map((cls) => (cls.id === id ? { ...cls, [field]: value } : cls))
    );
  };

  const updateGeofence = (id: string, field: keyof GeofencePricing, value: any) => {
    setGeofences((geofences) =>
      geofences.map((geo) => (geo.id === id ? { ...geo, [field]: value } : geo))
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-[#9dabb9]">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full relative overflow-hidden bg-[#0f151b]">
      {/* Top Header */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-[#283039] bg-[#111418] px-6 py-3 sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4 text-white">
            <div className="size-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <h2 className="text-lg font-bold leading-tight">LuxeRide Admin</h2>
          </div>
          <div className="hidden md:flex flex-col min-w-40 max-w-64">
            <div className="flex w-full items-stretch rounded-lg h-10 group">
              <div className="text-[#9dabb9] flex border-none bg-[#283039] items-center justify-center pl-4 rounded-l-lg">
                <Search className="h-5 w-5" />
              </div>
              <Input
                className="flex w-full flex-1 border-none bg-[#283039] text-white focus:ring-0 focus:ring-offset-0 placeholder:text-[#9dabb9] px-4 rounded-l-none h-10"
                placeholder="Search settings..."
              />
            </div>
          </div>
        </div>
        <div className="flex flex-1 justify-end gap-6 md:gap-8 items-center">
          <div className="hidden md:flex items-center gap-6">
            <a className="text-[#9dabb9] hover:text-primary text-sm font-medium transition-colors" href="#">
              Dashboard
            </a>
            <a className="text-[#9dabb9] hover:text-primary text-sm font-medium transition-colors" href="#">
              Rides
            </a>
            <a className="text-[#9dabb9] hover:text-primary text-sm font-medium transition-colors" href="#">
              Drivers
            </a>
            <a className="text-primary text-sm font-medium" href="#">
              Settings
            </a>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center justify-center rounded-lg size-10 bg-[#283039] text-white hover:bg-[#323b46] transition-colors">
              <Bell className="h-5 w-5" />
            </button>
            <button className="flex items-center justify-center rounded-lg size-10 bg-[#283039] text-white hover:bg-[#323b46] transition-colors">
              <MessageSquare className="h-5 w-5" />
            </button>
            <div className="bg-[#283039] rounded-full size-10 ring-2 ring-[#283039]"></div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 h-[calc(100vh-65px)] overflow-hidden">
        {/* Left Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 bg-[#111418] border-r border-[#283039] h-full overflow-y-auto">
          <div className="flex flex-col gap-4 p-4">
            <div className="flex flex-col pb-4 border-b border-[#283039]">
              <h1 className="text-white text-base font-bold leading-normal px-3">Settings Menu</h1>
              <p className="text-[#9dabb9] text-sm font-normal leading-normal px-3">Manage system parameters</p>
            </div>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => setActiveTab('general')}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'general'
                    ? 'bg-primary/10 text-primary border-l-4 border-primary'
                    : 'text-[#9dabb9] hover:bg-[#283039] hover:text-white'
                }`}
              >
                <SettingsIcon className="h-6 w-6" />
                <p>General</p>
              </button>
              <button
                onClick={() => setActiveTab('pricing')}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'pricing'
                    ? 'bg-primary/10 text-primary border-l-4 border-primary'
                    : 'text-[#9dabb9] hover:bg-[#283039] hover:text-white'
                }`}
              >
                <DollarSign className="h-6 w-6" />
                <p>Pricing & Fares</p>
              </button>
              <button
                onClick={() => setActiveTab('promotions')}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'promotions'
                    ? 'bg-primary/10 text-primary border-l-4 border-primary'
                    : 'text-[#9dabb9] hover:bg-[#283039] hover:text-white'
                }`}
              >
                <Tag className="h-6 w-6" />
                <p>Promotions</p>
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'notifications'
                    ? 'bg-primary/10 text-primary border-l-4 border-primary'
                    : 'text-[#9dabb9] hover:bg-[#283039] hover:text-white'
                }`}
              >
                <NotificationsIcon className="h-6 w-6" />
                <p>Notifications</p>
              </button>
              <button
                onClick={() => setActiveTab('compliance')}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'compliance'
                    ? 'bg-primary/10 text-primary border-l-4 border-primary'
                    : 'text-[#9dabb9] hover:bg-[#283039] hover:text-white'
                }`}
              >
                <Shield className="h-6 w-6" />
                <p>Compliance</p>
              </button>
              <button
                onClick={() => setActiveTab('mapzones')}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'mapzones'
                    ? 'bg-primary/10 text-primary border-l-4 border-primary'
                    : 'text-[#9dabb9] hover:bg-[#283039] hover:text-white'
                }`}
              >
                <Map className="h-6 w-6" />
                <p>Map Zones</p>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-y-auto bg-[#0f151b]">
          {activeTab === 'pricing' && (
            <>
              {/* Breadcrumbs */}
              <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center gap-2 text-sm text-[#9dabb9]">
                  <a className="hover:text-primary transition-colors" href="#">
                    Dashboard
                  </a>
                  <span>/</span>
                  <a className="hover:text-primary transition-colors" href="#">
                    Settings
                  </a>
                  <span>/</span>
                  <span className="text-white font-medium">Pricing & Fares</span>
                </div>
              </div>

              {/* Page Heading */}
              <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex flex-col gap-1">
                    <h1 className="text-white text-3xl font-black leading-tight">Pricing & Fares Configuration</h1>
                    <p className="text-[#9dabb9] text-base font-normal leading-normal max-w-2xl">
                      Configure base rates, surge multipliers, and cancellation policies for all vehicle types.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex items-center justify-center rounded-lg h-10 px-4 bg-transparent border border-[#3e4856] text-white hover:bg-[#283039] text-sm font-bold gap-2"
                    >
                      <History className="h-5 w-5" />
                      <span className="truncate">Audit Log</span>
                    </Button>
                    <Button
                      className="flex items-center justify-center rounded-lg h-10 px-4 bg-primary text-white hover:bg-primary/90 text-sm font-bold gap-2"
                      onClick={saveSettings}
                      disabled={saving}
                    >
                      <Save className="h-5 w-5" />
                      <span className="truncate">{saving ? 'Saving...' : 'Save Changes'}</span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Content Grid */}
              <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-6">
                {/* Global Pricing Parameters */}
                <div className="rounded-xl bg-[#1c242c] border border-[#283039] shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-[#283039] flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white">Global Pricing Parameters</h3>
                    <span className="bg-green-500/10 text-green-500 text-xs font-bold px-2 py-1 rounded border border-green-500/20 uppercase">
                      Active
                    </span>
                  </div>
                  <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col gap-2">
                      <Label className="text-sm font-medium text-[#9dabb9]">Base Currency</Label>
                      <Select
                        value={pricingConfig.baseCurrency}
                        onValueChange={(value) => setPricingConfig({ ...pricingConfig, baseCurrency: value })}
                      >
                        <SelectTrigger className="w-full bg-[#111418] border-[#283039] text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="KES">KES (KSh)</SelectItem>
                          <SelectItem value="USD">USD ($)</SelectItem>
                          <SelectItem value="EUR">EUR (€)</SelectItem>
                          <SelectItem value="GBP">GBP (£)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="text-sm font-medium text-[#9dabb9]">Distance Unit</Label>
                      <div className="flex bg-[#111418] rounded-lg p-1 w-fit">
                        <button
                          onClick={() => setPricingConfig({ ...pricingConfig, distanceUnit: 'miles' })}
                          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                            pricingConfig.distanceUnit === 'miles'
                              ? 'bg-white dark:bg-[#283039] text-[#111418] dark:text-white shadow-sm'
                              : 'text-[#9dabb9] hover:text-white'
                          }`}
                        >
                          Miles
                        </button>
                        <button
                          onClick={() => setPricingConfig({ ...pricingConfig, distanceUnit: 'kilometers' })}
                          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                            pricingConfig.distanceUnit === 'kilometers'
                              ? 'bg-white dark:bg-[#283039] text-[#111418] dark:text-white shadow-sm'
                              : 'text-[#9dabb9] hover:text-white'
                          }`}
                        >
                          Kilometers
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="text-sm font-medium text-[#9dabb9]">Tax Rate (%)</Label>
                      <Input
                        className="w-full bg-[#111418] border-[#283039] text-white"
                        type="number"
                        value={pricingConfig.taxRate}
                        onChange={(e) =>
                          setPricingConfig({ ...pricingConfig, taxRate: parseFloat(e.target.value) || 0 })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Surge Pricing Logic */}
                <div className="rounded-xl bg-[#1c242c] border border-[#283039] shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-[#283039] flex justify-between items-center bg-gradient-to-r from-transparent to-orange-500/5">
                    <div className="flex items-center gap-3">
                      <div className="bg-orange-500/10 p-2 rounded-lg text-orange-500">
                        <TrendingUp className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">Surge Pricing Logic</h3>
                        <p className="text-xs text-[#9dabb9]">Dynamic pricing adjustments based on demand</p>
                      </div>
                    </div>
                    <Switch
                      checked={pricingConfig.surgeEnabled}
                      onCheckedChange={(checked) => setPricingConfig({ ...pricingConfig, surgeEnabled: checked })}
                    />
                  </div>
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
                    <div className="flex flex-col gap-2">
                      <Label className="text-sm font-medium text-[#9dabb9]">Demand Threshold</Label>
                      <div className="flex items-center gap-2 bg-[#111418] rounded-lg px-4 py-2.5">
                        <Users className="h-5 w-5 text-[#9dabb9]" />
                        <Input
                          className="bg-transparent border-none w-full p-0 text-white focus:ring-0 text-sm flex-1"
                          type="number"
                          value={pricingConfig.demandThreshold}
                          onChange={(e) =>
                            setPricingConfig({ ...pricingConfig, demandThreshold: parseInt(e.target.value) || 0 })
                          }
                        />
                        <span className="text-xs text-[#9dabb9]">Requests/min</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="text-sm font-medium text-[#9dabb9]">Min Multiplier</Label>
                      <div className="flex items-center gap-2 bg-[#111418] rounded-lg px-4 py-2.5">
                        <span className="text-white font-bold text-sm">1.2x</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="text-sm font-medium text-[#9dabb9]">Max Multiplier Cap</Label>
                      <div className="flex items-center gap-2 bg-[#111418] rounded-lg px-4 py-2.5">
                        <Maximize2 className="h-5 w-5 text-[#9dabb9]" />
                        <Input
                          className="bg-transparent border-none w-full p-0 text-white focus:ring-0 text-sm flex-1"
                          step="0.1"
                          type="number"
                          value={pricingConfig.maxMultiplier}
                          onChange={(e) =>
                            setPricingConfig({ ...pricingConfig, maxMultiplier: parseFloat(e.target.value) || 0 })
                          }
                        />
                        <span className="text-xs text-[#9dabb9]">x Base</span>
                      </div>
                    </div>
                    <div>
                      <Button
                        variant="outline"
                        className="w-full h-[42px] rounded-lg border border-[#3e4856] text-primary hover:bg-primary/5 text-sm font-bold"
                      >
                        Configure Zones
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Service Classes */}
                <div className="space-y-4">
                  <div className="flex justify-between items-end px-1">
                    <div>
                      <h3 className="text-xl font-bold text-white">Service Classes</h3>
                      <p className="text-[#9dabb9] text-sm">Manage base fares per vehicle category.</p>
                    </div>
                    <Button
                      variant="ghost"
                      className="text-primary text-sm font-bold hover:underline flex items-center gap-1"
                    >
                      <Plus className="h-4 w-4" />
                      Add Class
                    </Button>
                  </div>

                  {serviceClasses.map((serviceClass) => (
                    <div
                      key={serviceClass.id}
                      className="flex flex-col md:flex-row items-stretch justify-between gap-6 rounded-xl bg-[#1c242c] p-4 shadow-sm border border-[#283039] group/card hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-center gap-4 min-w-[200px]">
                        <div className="size-16 rounded-lg bg-[#283039] border border-[#3e4856] flex items-center justify-center">
                          <span className="text-2xl">🚗</span>
                        </div>
                        <div>
                          <p className="text-white text-base font-bold leading-tight">{serviceClass.name}</p>
                          <p className="text-[#9dabb9] text-xs font-normal leading-normal mt-1">
                            {serviceClass.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
                        <div className="flex flex-col gap-1">
                          <Label className="text-[11px] uppercase tracking-wide font-bold text-[#9dabb9]">Base Fare</Label>
                          <div className="flex items-center text-white font-medium bg-[#111418] px-3 py-2 rounded-md">
                            <span className="text-xs mr-1">
                              {pricingConfig.baseCurrency === 'KES' ? 'KES' : '$'}
                            </span>
                            <Input
                              className="bg-transparent border-none p-0 w-full text-sm font-bold focus:ring-0 text-white"
                              type="number"
                              step="0.01"
                              value={serviceClass.baseFare}
                              onChange={(e) =>
                                updateServiceClass(serviceClass.id, 'baseFare', parseFloat(e.target.value) || 0)
                              }
                            />
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <Label className="text-[11px] uppercase tracking-wide font-bold text-[#9dabb9]">
                            Per {pricingConfig.distanceUnit === 'miles' ? 'Mile' : 'Km'}
                          </Label>
                          <div className="flex items-center text-white font-medium bg-[#111418] px-3 py-2 rounded-md">
                            <span className="text-xs mr-1">
                              {pricingConfig.baseCurrency === 'KES' ? 'KES' : '$'}
                            </span>
                            <Input
                              className="bg-transparent border-none p-0 w-full text-sm font-bold focus:ring-0 text-white"
                              type="number"
                              step="0.01"
                              value={serviceClass.perMile}
                              onChange={(e) =>
                                updateServiceClass(serviceClass.id, 'perMile', parseFloat(e.target.value) || 0)
                              }
                            />
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <Label className="text-[11px] uppercase tracking-wide font-bold text-[#9dabb9]">Per Min</Label>
                          <div className="flex items-center text-white font-medium bg-[#111418] px-3 py-2 rounded-md">
                            <span className="text-xs mr-1">
                              {pricingConfig.baseCurrency === 'KES' ? 'KES' : '$'}
                            </span>
                            <Input
                              className="bg-transparent border-none p-0 w-full text-sm font-bold focus:ring-0 text-white"
                              type="number"
                              step="0.01"
                              value={serviceClass.perMin}
                              onChange={(e) =>
                                updateServiceClass(serviceClass.id, 'perMin', parseFloat(e.target.value) || 0)
                              }
                            />
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <Label className="text-[11px] uppercase tracking-wide font-bold text-[#9dabb9]">Min Fare</Label>
                          <div className="flex items-center text-white font-medium bg-[#111418] px-3 py-2 rounded-md">
                            <span className="text-xs mr-1">
                              {pricingConfig.baseCurrency === 'KES' ? 'KES' : '$'}
                            </span>
                            <Input
                              className="bg-transparent border-none p-0 w-full text-sm font-bold focus:ring-0 text-white"
                              type="number"
                              step="0.01"
                              value={serviceClass.minFare}
                              onChange={(e) =>
                                updateServiceClass(serviceClass.id, 'minFare', parseFloat(e.target.value) || 0)
                              }
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-end">
                        <Button
                          variant="ghost"
                          className="flex size-9 cursor-pointer items-center justify-center rounded-lg bg-[#283039] text-white hover:bg-primary hover:text-white transition-all"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Active Geofence Pricing */}
                <div className="rounded-xl bg-[#1c242c] border border-[#283039] shadow-sm overflow-hidden p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex flex-[2_2_0] flex-col gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-white">Active Geofence Pricing</h3>
                        <p className="text-[#9dabb9] text-sm mt-1">Special pricing rules for specific zones.</p>
                      </div>
                      <div className="space-y-3">
                        {geofences.map((geofence) => (
                          <div
                            key={geofence.id}
                            className="flex items-center justify-between p-3 rounded-lg bg-[#111418] border-l-4 border-blue-500"
                          >
                            <div>
                              <p className="text-sm font-bold text-white">{geofence.name}</p>
                              <p className="text-xs text-[#9dabb9]">
                                {geofence.type === 'fixed'
                                  ? `Fixed Fee: ${pricingConfig.baseCurrency === 'KES' ? 'KES' : '$'}${geofence.value.toFixed(2)} surcharge`
                                  : `Multiplier: ${geofence.value}x minimum`}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  geofence.status === 'active'
                                    ? 'bg-green-500/20 text-green-500'
                                    : geofence.status === 'scheduled'
                                    ? 'bg-gray-500/20 text-gray-500'
                                    : 'bg-gray-500/20 text-gray-500'
                                }`}
                              >
                                {geofence.status.toUpperCase()}
                              </span>
                              <Button variant="ghost" className="h-8 w-8 p-0 text-[#9dabb9] hover:text-primary">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Button variant="link" className="mt-2 text-primary font-bold text-sm text-left hover:underline w-fit p-0 h-auto">
                        View All Zones
                      </Button>
                    </div>
                    <div className="flex-1 min-h-[200px] rounded-lg bg-[#283039] relative overflow-hidden group">
                      <GeofenceMap
                        geofences={geofences.map((geo) => ({
                          id: geo.id,
                          name: geo.name,
                          coordinates: geo.coordinates || [],
                          type: 'polygon',
                          color: geo.color || '#137fec',
                        }))}
                        height="200px"
                        center={[-1.2921, 36.8219]}
                        zoom={11}
                      />
                      <div className="absolute bottom-3 right-3 z-10">
                        <Button className="bg-white dark:bg-[#111418] text-[#111418] dark:text-white rounded px-3 py-1 text-xs font-bold shadow-lg">
                          Open Map Editor
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* General Tab */}
          {activeTab === 'general' && (
            <>
              <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center gap-2 text-sm text-[#9dabb9]">
                  <a className="hover:text-primary transition-colors" href="#">Dashboard</a>
                  <span>/</span>
                  <a className="hover:text-primary transition-colors" href="#">Settings</a>
                  <span>/</span>
                  <span className="text-white font-medium">General</span>
                </div>
              </div>
              <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex flex-col gap-1">
                    <h1 className="text-white text-3xl font-black leading-tight">General Settings</h1>
                    <p className="text-[#9dabb9] text-base font-normal leading-normal max-w-2xl">
                      Configure basic application settings and preferences
                    </p>
                  </div>
                  <Button
                    className="flex items-center justify-center rounded-lg h-10 px-4 bg-primary text-white hover:bg-primary/90 text-sm font-bold gap-2"
                    onClick={saveSettings}
                    disabled={saving}
                  >
                    <Save className="h-5 w-5" />
                    <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                  </Button>
                </div>
              </div>
              <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-6">
                <div className="rounded-xl bg-[#1c242c] border border-[#283039] shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-[#283039]">
                    <h3 className="text-lg font-bold text-white">Application Information</h3>
                  </div>
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <Label className="text-sm font-medium text-[#9dabb9]">Application Name</Label>
                      <Input
                        className="w-full bg-[#111418] border-[#283039] text-white"
                        value={generalConfig.appName}
                        onChange={(e) => setGeneralConfig({ ...generalConfig, appName: e.target.value })}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="text-sm font-medium text-[#9dabb9]">Timezone</Label>
                      <Select
                        value={generalConfig.timezone}
                        onValueChange={(value) => setGeneralConfig({ ...generalConfig, timezone: value })}
                      >
                        <SelectTrigger className="w-full bg-[#111418] border-[#283039] text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Africa/Nairobi">Africa/Nairobi (EAT)</SelectItem>
                          <SelectItem value="UTC">UTC</SelectItem>
                          <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="text-sm font-medium text-[#9dabb9]">Default Language</Label>
                      <Select
                        value={generalConfig.language}
                        onValueChange={(value) => setGeneralConfig({ ...generalConfig, language: value })}
                      >
                        <SelectTrigger className="w-full bg-[#111418] border-[#283039] text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="sw">Swahili</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="text-sm font-medium text-[#9dabb9]">API Rate Limit (per hour)</Label>
                      <Input
                        className="w-full bg-[#111418] border-[#283039] text-white"
                        type="number"
                        value={generalConfig.apiRateLimit}
                        onChange={(e) =>
                          setGeneralConfig({ ...generalConfig, apiRateLimit: parseInt(e.target.value) || 0 })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-[#1c242c] border border-[#283039] shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-[#283039]">
                    <h3 className="text-lg font-bold text-white">Support Contact</h3>
                  </div>
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <Label className="text-sm font-medium text-[#9dabb9]">Support Email</Label>
                      <Input
                        className="w-full bg-[#111418] border-[#283039] text-white"
                        type="email"
                        value={generalConfig.supportEmail}
                        onChange={(e) => setGeneralConfig({ ...generalConfig, supportEmail: e.target.value })}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="text-sm font-medium text-[#9dabb9]">Support Phone</Label>
                      <Input
                        className="w-full bg-[#111418] border-[#283039] text-white"
                        type="tel"
                        value={generalConfig.supportPhone}
                        onChange={(e) => setGeneralConfig({ ...generalConfig, supportPhone: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-[#1c242c] border border-[#283039] shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-[#283039] flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white">System Status</h3>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium text-white">Maintenance Mode</Label>
                        <p className="text-xs text-[#9dabb9] mt-1">
                          Enable to temporarily disable user access for maintenance
                        </p>
                      </div>
                      <Switch
                        checked={generalConfig.maintenanceMode}
                        onCheckedChange={(checked) =>
                          setGeneralConfig({ ...generalConfig, maintenanceMode: checked })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Promotions Tab */}
          {activeTab === 'promotions' && (
            <>
              <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center gap-2 text-sm text-[#9dabb9]">
                  <a className="hover:text-primary transition-colors" href="#">Dashboard</a>
                  <span>/</span>
                  <a className="hover:text-primary transition-colors" href="#">Settings</a>
                  <span>/</span>
                  <span className="text-white font-medium">Promotions</span>
                </div>
              </div>
              <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex flex-col gap-1">
                    <h1 className="text-white text-3xl font-black leading-tight">Promotion Management</h1>
                    <p className="text-[#9dabb9] text-base font-normal leading-normal max-w-2xl">
                      Create and manage promotional codes and discounts
                    </p>
                  </div>
                  <Button
                    className="flex items-center justify-center rounded-lg h-10 px-4 bg-primary text-white hover:bg-primary/90 text-sm font-bold gap-2"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Create Promotion</span>
                  </Button>
                </div>
              </div>
              <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <div className="rounded-xl bg-[#1c242c] border border-[#283039] shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-[#111418] border-b border-[#283039]">
                        <tr>
                          <th className="text-left py-3 px-4 text-sm font-bold text-white">Code</th>
                          <th className="text-left py-3 px-4 text-sm font-bold text-white">Type</th>
                          <th className="text-left py-3 px-4 text-sm font-bold text-white">Value</th>
                          <th className="text-left py-3 px-4 text-sm font-bold text-white">Usage</th>
                          <th className="text-left py-3 px-4 text-sm font-bold text-white">Status</th>
                          <th className="text-left py-3 px-4 text-sm font-bold text-white">Period</th>
                          <th className="text-right py-3 px-4 text-sm font-bold text-white">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {promotions.map((promo) => (
                          <tr key={promo.id} className="border-b border-[#283039] hover:bg-[#111418]">
                            <td className="py-3 px-4">
                              <div>
                                <p className="text-white font-bold">{promo.code}</p>
                                <p className="text-xs text-[#9dabb9]">{promo.description}</p>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <Badge className={promo.type === 'percentage' ? 'bg-blue-500/20 text-blue-500' : 'bg-green-500/20 text-green-500'}>
                                {promo.type === 'percentage' ? 'Percentage' : 'Fixed'}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <span className="text-white font-medium">
                                {promo.type === 'percentage' ? `${promo.value}%` : `KES ${promo.value}`}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className="text-[#9dabb9] text-sm">
                                {promo.usedCount} / {promo.usageLimit || '∞'}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <Badge
                                className={
                                  promo.status === 'active'
                                    ? 'bg-green-500/20 text-green-500'
                                    : promo.status === 'expired'
                                    ? 'bg-red-500/20 text-red-500'
                                    : 'bg-gray-500/20 text-gray-500'
                                }
                              >
                                {promo.status}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <div className="text-xs text-[#9dabb9]">
                                <p>{new Date(promo.startDate).toLocaleDateString()}</p>
                                <p>to {new Date(promo.endDate).toLocaleDateString()}</p>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center justify-end gap-2">
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-400">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <>
              <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center gap-2 text-sm text-[#9dabb9]">
                  <a className="hover:text-primary transition-colors" href="#">Dashboard</a>
                  <span>/</span>
                  <a className="hover:text-primary transition-colors" href="#">Settings</a>
                  <span>/</span>
                  <span className="text-white font-medium">Notifications</span>
                </div>
              </div>
              <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex flex-col gap-1">
                    <h1 className="text-white text-3xl font-black leading-tight">Notification Templates</h1>
                    <p className="text-[#9dabb9] text-base font-normal leading-normal max-w-2xl">
                      Manage email, SMS, and push notification templates
                    </p>
                  </div>
                  <Button
                    className="flex items-center justify-center rounded-lg h-10 px-4 bg-primary text-white hover:bg-primary/90 text-sm font-bold gap-2"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Create Template</span>
                  </Button>
                </div>
              </div>
              <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-6">
                {notificationTemplates.map((template) => (
                  <div key={template.id} className="rounded-xl bg-[#1c242c] border border-[#283039] shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-[#283039] flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        {template.type === 'email' && <Mail className="h-5 w-5 text-blue-500" />}
                        {template.type === 'sms' && <Smartphone className="h-5 w-5 text-green-500" />}
                        {template.type === 'push' && <Bell className="h-5 w-5 text-purple-500" />}
                        <div>
                          <h3 className="text-lg font-bold text-white">{template.name}</h3>
                          <p className="text-xs text-[#9dabb9] capitalize">{template.type} template</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={template.enabled}
                          onCheckedChange={(checked) => {
                            setNotificationTemplates((templates) =>
                              templates.map((t) => (t.id === template.id ? { ...t, enabled: checked } : t))
                            );
                          }}
                        />
                        <Badge className={template.enabled ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-500'}>
                          {template.enabled ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-6 space-y-4">
                      {template.subject && (
                        <div className="flex flex-col gap-2">
                          <Label className="text-sm font-medium text-[#9dabb9]">Subject</Label>
                          <Input
                            className="w-full bg-[#111418] border-[#283039] text-white"
                            value={template.subject}
                            onChange={(e) => {
                              setNotificationTemplates((templates) =>
                                templates.map((t) => (t.id === template.id ? { ...t, subject: e.target.value } : t))
                              );
                            }}
                          />
                        </div>
                      )}
                      <div className="flex flex-col gap-2">
                        <Label className="text-sm font-medium text-[#9dabb9]">Message Body</Label>
                        <Textarea
                          className="w-full bg-[#111418] border-[#283039] text-white min-h-[120px]"
                          value={template.body}
                          onChange={(e) => {
                            setNotificationTemplates((templates) =>
                              templates.map((t) => (t.id === template.id ? { ...t, body: e.target.value } : t))
                            );
                          }}
                        />
                        <p className="text-xs text-[#9dabb9]">
                          Use {'{'}{'{'}variable_name{'}'}{'}'} for dynamic content
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Compliance Tab */}
          {activeTab === 'compliance' && (
            <>
              <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center gap-2 text-sm text-[#9dabb9]">
                  <a className="hover:text-primary transition-colors" href="#">Dashboard</a>
                  <span>/</span>
                  <a className="hover:text-primary transition-colors" href="#">Settings</a>
                  <span>/</span>
                  <span className="text-white font-medium">Compliance</span>
                </div>
              </div>
              <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex flex-col gap-1">
                    <h1 className="text-white text-3xl font-black leading-tight">Compliance & Policies</h1>
                    <p className="text-[#9dabb9] text-base font-normal leading-normal max-w-2xl">
                      Manage legal documents, policies, and compliance requirements
                    </p>
                  </div>
                  <Button
                    className="flex items-center justify-center rounded-lg h-10 px-4 bg-primary text-white hover:bg-primary/90 text-sm font-bold gap-2"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Add Policy</span>
                  </Button>
                </div>
              </div>
              <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-4">
                {compliancePolicies.map((policy) => (
                  <div key={policy.id} className="rounded-xl bg-[#1c242c] border border-[#283039] shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-[#283039] flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">{policy.title}</h3>
                          <div className="flex items-center gap-3 mt-1">
                            <Badge className="bg-blue-500/20 text-blue-500">{policy.category}</Badge>
                            <span className="text-xs text-[#9dabb9]">
                              Last updated: {new Date(policy.lastUpdated).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          className={
                            policy.status === 'active'
                              ? 'bg-green-500/20 text-green-500'
                              : policy.status === 'draft'
                              ? 'bg-yellow-500/20 text-yellow-500'
                              : 'bg-gray-500/20 text-gray-500'
                          }
                        >
                          {policy.status}
                        </Badge>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="p-6">
                      <Textarea
                        className="w-full bg-[#111418] border-[#283039] text-white min-h-[150px]"
                        value={policy.content}
                        onChange={(e) => {
                          setCompliancePolicies((policies) =>
                            policies.map((p) => (p.id === policy.id ? { ...p, content: e.target.value } : p))
                          );
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Map Zones Tab */}
          {activeTab === 'mapzones' && (
            <>
              <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center gap-2 text-sm text-[#9dabb9]">
                  <a className="hover:text-primary transition-colors" href="#">Dashboard</a>
                  <span>/</span>
                  <a className="hover:text-primary transition-colors" href="#">Settings</a>
                  <span>/</span>
                  <span className="text-white font-medium">Map Zones</span>
                </div>
              </div>
              <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex flex-col gap-1">
                    <h1 className="text-white text-3xl font-black leading-tight">Map Zone Management</h1>
                    <p className="text-[#9dabb9] text-base font-normal leading-normal max-w-2xl">
                      Define service areas, restricted zones, and priority zones on the map
                    </p>
                  </div>
                  <Button
                    className="flex items-center justify-center rounded-lg h-10 px-4 bg-primary text-white hover:bg-primary/90 text-sm font-bold gap-2"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Add Zone</span>
                  </Button>
                </div>
              </div>
              <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-6">
                <div className="rounded-xl bg-[#1c242c] border border-[#283039] shadow-sm overflow-hidden p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex flex-[2_2_0] flex-col gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-white">Service Zones</h3>
                        <p className="text-[#9dabb9] text-sm mt-1">Manage operational zones and boundaries.</p>
                      </div>
                      <div className="space-y-3">
                        {mapZones.map((zone) => (
                          <div
                            key={zone.id}
                            className="flex items-center justify-between p-4 rounded-lg bg-[#111418] border border-[#283039]"
                          >
                            <div className="flex items-center gap-4">
                              <div
                                className={`p-2 rounded-lg ${
                                  zone.type === 'service_area'
                                    ? 'bg-blue-500/10'
                                    : zone.type === 'restricted'
                                    ? 'bg-red-500/10'
                                    : 'bg-green-500/10'
                                }`}
                              >
                                <Map
                                  className={`h-5 w-5 ${
                                    zone.type === 'service_area'
                                      ? 'text-blue-500'
                                      : zone.type === 'restricted'
                                      ? 'text-red-500'
                                      : 'text-green-500'
                                  }`}
                                />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-white">{zone.name}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge
                                    className={
                                      zone.type === 'service_area'
                                        ? 'bg-blue-500/20 text-blue-500'
                                        : zone.type === 'restricted'
                                        ? 'bg-red-500/20 text-red-500'
                                        : 'bg-green-500/20 text-green-500'
                                    }
                                  >
                                    {zone.type.replace('_', ' ')}
                                  </Badge>
                                  <Badge
                                    className={
                                      zone.status === 'active'
                                        ? 'bg-green-500/20 text-green-500'
                                        : 'bg-gray-500/20 text-gray-500'
                                    }
                                  >
                                    {zone.status}
                                  </Badge>
                                </div>
                                {zone.description && (
                                  <p className="text-xs text-[#9dabb9] mt-1">{zone.description}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-400">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex-1 min-h-[400px] rounded-lg bg-[#283039] relative overflow-hidden">
                      <GeofenceMap
                        geofences={mapZones.map((zone) => ({
                          id: zone.id,
                          name: zone.name,
                          coordinates: zone.coordinates,
                          type: 'polygon',
                          color:
                            zone.type === 'service_area'
                              ? '#3b82f6'
                              : zone.type === 'restricted'
                              ? '#ef4444'
                              : '#10b981',
                        }))}
                        height="400px"
                        center={[-1.2921, 36.8219]}
                        zoom={11}
                      />
                      <div className="absolute bottom-3 right-3 z-10">
                        <Button className="bg-white dark:bg-[#111418] text-[#111418] dark:text-white rounded px-3 py-1 text-xs font-bold shadow-lg">
                          Open Map Editor
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
