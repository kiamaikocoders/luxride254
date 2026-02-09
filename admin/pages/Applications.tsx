import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Search,
  FileText,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Eye,
  Car,
  UserCog,
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
} from 'lucide-react';
import { formatDate } from '../utils/format';
import { useAdminAuth } from '../hooks/useAdminAuth';

interface CarOwnerApplication {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_year: number;
  mileage_km?: number;
  location: string;
  vehicle_condition?: string;
  availability?: string;
  expectations?: string;
  document_paths: string[];
  vehicle_images?: string[];
  status: string;
  created_at: string;
}

interface ChauffeurApplication {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  years_experience?: number;
  license_number?: string;
  license_category?: string;
  languages?: string;
  availability?: string;
  why_luxeride?: string;
  salary_expectations?: string;
  document_paths: string[];
  profile_photo?: string;
  documents_categorized?: {
    license_front?: string[];
    license_back?: string[];
    cv?: string[];
    passport?: string[];
  };
  status: string;
  created_at: string;
}

interface CorporateApplication {
  id: number;
  company_name: string;
  industry?: string;
  employees_range?: string;
  primary_location?: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  services_required?: string[];
  billing_preference?: string;
  current_provider?: string;
  special_requirements?: string;
  expectations?: string;
  document_paths: string[];
  status: string;
  created_at: string;
}

type ApplicationType = 'all' | 'car_owner' | 'chauffeur' | 'corporate';
type ApplicationStatus = 'all' | 'pending' | 'under_review' | 'approved' | 'rejected';

interface UnifiedApplication {
  id: string;
  type: 'car_owner' | 'chauffeur' | 'corporate';
  data: CarOwnerApplication | ChauffeurApplication | CorporateApplication;
  created_at: string;
  status: string;
}

export function Applications() {
  const { user } = useAdminAuth();
  const [applications, setApplications] = useState<UnifiedApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<ApplicationType>('all');
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus>('all');
  const [selectedApplication, setSelectedApplication] = useState<UnifiedApplication | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reviewNote, setReviewNote] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [documentUrls, setDocumentUrls] = useState<{ [key: string]: string }>({});
  const [vehicleImageUrls, setVehicleImageUrls] = useState<{ [key: string]: string }>({});
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string>('');
  const [categorizedDocUrls, setCategorizedDocUrls] = useState<{ [category: string]: { [path: string]: string } }>({});

  useEffect(() => {
    fetchApplications();

    // Set up real-time subscriptions
    const carOwnerChannel = supabase
      .channel('car_owner_applications_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'car_owner_applications' }, () => {
        fetchApplications();
      })
      .subscribe();

    const chauffeurChannel = supabase
      .channel('chauffeur_applications_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chauffeur_applications' }, () => {
        fetchApplications();
      })
      .subscribe();

    const corporateChannel = supabase
      .channel('corporate_applications_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'corporate_account_applications' }, () => {
        fetchApplications();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(carOwnerChannel);
      supabase.removeChannel(chauffeurChannel);
      supabase.removeChannel(corporateChannel);
    };
  }, []);

      useEffect(() => {
    if (selectedApplication) {
      loadDocumentUrls(selectedApplication);
      // Reset all image/document URLs when application changes
      setVehicleImageUrls({});
      setProfilePhotoUrl('');
      setCategorizedDocUrls({});
    }
  }, [selectedApplication]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const [carOwnerRes, chauffeurRes, corporateRes] = await Promise.all([
        supabase.from('car_owner_applications').select('*').order('created_at', { ascending: false }),
        supabase.from('chauffeur_applications').select('*').order('created_at', { ascending: false }),
        supabase.from('corporate_account_applications').select('*').order('created_at', { ascending: false }),
      ]);

      const allApplications: UnifiedApplication[] = [
        ...(carOwnerRes.data || []).map((app) => ({
          id: `car_owner_${app.id}`,
          type: 'car_owner' as const,
          data: app as CarOwnerApplication,
          created_at: app.created_at,
          status: app.status || 'pending',
        })),
        ...(chauffeurRes.data || []).map((app) => ({
          id: `chauffeur_${app.id}`,
          type: 'chauffeur' as const,
          data: app as ChauffeurApplication,
          created_at: app.created_at,
          status: app.status || 'pending',
        })),
        ...(corporateRes.data || []).map((app) => ({
          id: `corporate_${app.id}`,
          type: 'corporate' as const,
          data: app as CorporateApplication,
          created_at: app.created_at,
          status: app.status || 'pending',
        })),
      ];

      setApplications(allApplications);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDocumentUrls = async (application: UnifiedApplication) => {
    const paths = application.data.document_paths || [];
    const urls: { [key: string]: string } = {};

    for (const path of paths) {
      try {
        const { data, error } = await supabase.storage.from('applications').createSignedUrl(path, 3600);
        if (!error && data) {
          urls[path] = data.signedUrl;
        }
      } catch (err) {
        console.error(`Error generating signed URL for ${path}:`, err);
      }
    }

    setDocumentUrls(urls);

    // Load vehicle images for car owner applications
    if (application.type === 'car_owner') {
      const vehicleImages = (application.data as CarOwnerApplication).vehicle_images || [];
      const vehicleUrls: { [key: string]: string } = {};

      for (const path of vehicleImages) {
        try {
          const { data, error } = await supabase.storage.from('applications').createSignedUrl(path, 3600);
          if (!error && data) {
            vehicleUrls[path] = data.signedUrl;
          }
        } catch (err) {
          console.error(`Error generating signed URL for vehicle image ${path}:`, err);
        }
      }

      setVehicleImageUrls(vehicleUrls);
    }

    // Load profile photo and categorized documents for chauffeur applications
    if (application.type === 'chauffeur') {
      const chauffeurData = application.data as ChauffeurApplication;
      
      // Load profile photo
      if (chauffeurData.profile_photo) {
        try {
          const { data, error } = await supabase.storage.from('applications').createSignedUrl(chauffeurData.profile_photo, 3600);
          if (!error && data) {
            setProfilePhotoUrl(data.signedUrl);
          }
        } catch (err) {
          console.error(`Error generating signed URL for profile photo:`, err);
        }
      }

      // Load categorized documents
      if (chauffeurData.documents_categorized) {
        const categorized: { [category: string]: { [path: string]: string } } = {};
        
        for (const [category, paths] of Object.entries(chauffeurData.documents_categorized)) {
          if (paths && Array.isArray(paths)) {
            categorized[category] = {};
            for (const path of paths) {
              try {
                const { data, error } = await supabase.storage.from('applications').createSignedUrl(path, 3600);
                if (!error && data) {
                  categorized[category][path] = data.signedUrl;
                }
              } catch (err) {
                console.error(`Error generating signed URL for ${category} document ${path}:`, err);
              }
            }
          }
        }
        
        setCategorizedDocUrls(categorized);
      }
    }
  };

  const updateApplicationStatus = async (newStatus: 'under_review' | 'approved' | 'rejected') => {
    if (!selectedApplication || !user) return;

    setUpdatingStatus(true);
    try {
      const tableName =
        selectedApplication.type === 'car_owner'
          ? 'car_owner_applications'
          : selectedApplication.type === 'chauffeur'
          ? 'chauffeur_applications'
          : 'corporate_account_applications';

      const applicationId = selectedApplication.data.id;

      const updateData: any = {
        status: newStatus,
      };
      
      // Add review notes if provided (this field may not exist in all tables)
      if (reviewNote) {
        updateData.review_notes = reviewNote;
      }

      const { error } = await supabase.from(tableName).update(updateData).eq('id', applicationId);

      if (error) throw error;

      setDialogOpen(false);
      setReviewNote('');
      setSelectedApplication(null);
      fetchApplications();
    } catch (error) {
      console.error('Error updating application status:', error);
      alert('Failed to update application status. Please try again.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getFilteredApplications = () => {
    return applications.filter((app) => {
      const matchesType = typeFilter === 'all' || app.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
      const matchesSearch =
        !searchQuery ||
        (app.type === 'car_owner' &&
          ((app.data as CarOwnerApplication).full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (app.data as CarOwnerApplication).email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (app.data as CarOwnerApplication).vehicle_make?.toLowerCase().includes(searchQuery.toLowerCase()))) ||
        (app.type === 'chauffeur' &&
          ((app.data as ChauffeurApplication).full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (app.data as ChauffeurApplication).email?.toLowerCase().includes(searchQuery.toLowerCase()))) ||
        (app.type === 'corporate' &&
          ((app.data as CorporateApplication).company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (app.data as CorporateApplication).contact_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (app.data as CorporateApplication).contact_name?.toLowerCase().includes(searchQuery.toLowerCase())));

      return matchesType && matchesStatus && matchesSearch;
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500/20 text-green-500 border-green-500/30">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500/20 text-red-500 border-red-500/30">Rejected</Badge>;
      case 'under_review':
        return <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">Under Review</Badge>;
      default:
        return <Badge className="bg-blue-500/20 text-blue-500 border-blue-500/30">Pending</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'car_owner':
        return <Car className="h-5 w-5" />;
      case 'chauffeur':
        return <UserCog className="h-5 w-5" />;
      case 'corporate':
        return <Building2 className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'car_owner':
        return 'Car Owner';
      case 'chauffeur':
        return 'Chauffeur';
      case 'corporate':
        return 'Corporate';
      default:
        return type;
    }
  };

  const filteredApplications = getFilteredApplications();
  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === 'pending' || !a.status).length,
    under_review: applications.filter((a) => a.status === 'under_review').length,
    approved: applications.filter((a) => a.status === 'approved').length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center text-[#9dabb9]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p>Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#0f151b]">
      {/* Header */}
      <div className="w-full border-b border-[#283039] bg-[#111418] px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-white text-3xl font-black tracking-tight">Applications</h1>
            <p className="text-[#9dabb9] text-base font-normal leading-normal max-w-2xl">
              Review and manage all application submissions
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="w-full max-w-[1400px] mx-auto space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="rounded-xl bg-[#1c242c] border border-[#283039] p-4">
              <p className="text-[#9dabb9] text-sm font-medium mb-1">Total</p>
              <p className="text-white text-2xl font-bold">{stats.total}</p>
            </div>
            <div className="rounded-xl bg-[#1c242c] border border-[#283039] p-4">
              <p className="text-[#9dabb9] text-sm font-medium mb-1">Pending</p>
              <p className="text-blue-500 text-2xl font-bold">{stats.pending}</p>
            </div>
            <div className="rounded-xl bg-[#1c242c] border border-[#283039] p-4">
              <p className="text-[#9dabb9] text-sm font-medium mb-1">Under Review</p>
              <p className="text-yellow-500 text-2xl font-bold">{stats.under_review}</p>
            </div>
            <div className="rounded-xl bg-[#1c242c] border border-[#283039] p-4">
              <p className="text-[#9dabb9] text-sm font-medium mb-1">Approved</p>
              <p className="text-green-500 text-2xl font-bold">{stats.approved}</p>
            </div>
            <div className="rounded-xl bg-[#1c242c] border border-[#283039] p-4">
              <p className="text-[#9dabb9] text-sm font-medium mb-1">Rejected</p>
              <p className="text-red-500 text-2xl font-bold">{stats.rejected}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#9dabb9]" />
              <Input
                placeholder="Search by name, email, company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[#1c242c] border-[#283039] text-white placeholder:text-[#9dabb9]"
              />
            </div>
            <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as ApplicationType)}>
              <SelectTrigger className="w-full md:w-[180px] bg-[#1c242c] border-[#283039] text-white">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="car_owner">Car Owner</SelectItem>
                <SelectItem value="chauffeur">Chauffeur</SelectItem>
                <SelectItem value="corporate">Corporate</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as ApplicationStatus)}>
              <SelectTrigger className="w-full md:w-[180px] bg-[#1c242c] border-[#283039] text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Applications Table */}
          <div className="rounded-xl bg-[#1c242c] border border-[#283039] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#111418] border-b border-[#283039]">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-bold text-white">Type</th>
                    <th className="text-left py-3 px-4 text-sm font-bold text-white">Applicant</th>
                    <th className="text-left py-3 px-4 text-sm font-bold text-white">Contact</th>
                    <th className="text-left py-3 px-4 text-sm font-bold text-white">Submitted</th>
                    <th className="text-left py-3 px-4 text-sm font-bold text-white">Status</th>
                    <th className="text-right py-3 px-4 text-sm font-bold text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-[#9dabb9]">
                        No applications found
                      </td>
                    </tr>
                  ) : (
                    filteredApplications.map((app) => {
                      const name =
                        app.type === 'car_owner'
                          ? (app.data as CarOwnerApplication).full_name
                          : app.type === 'chauffeur'
                          ? (app.data as ChauffeurApplication).full_name
                          : (app.data as CorporateApplication).contact_name;
                      const email =
                        app.type === 'car_owner'
                          ? (app.data as CarOwnerApplication).email
                          : app.type === 'chauffeur'
                          ? (app.data as ChauffeurApplication).email
                          : (app.data as CorporateApplication).contact_email;
                      const phone =
                        app.type === 'car_owner'
                          ? (app.data as CarOwnerApplication).phone
                          : app.type === 'chauffeur'
                          ? (app.data as ChauffeurApplication).phone
                          : (app.data as CorporateApplication).contact_phone;

                      return (
                        <tr key={app.id} className="border-b border-[#283039] hover:bg-[#111418] transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className="text-primary">{getTypeIcon(app.type)}</div>
                              <span className="text-white text-sm font-medium">{getTypeLabel(app.type)}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div>
                              <p className="text-white font-medium">{name}</p>
                              {app.type === 'corporate' && (
                                <p className="text-[#9dabb9] text-xs">
                                  {(app.data as CorporateApplication).company_name}
                                </p>
                              )}
                              {app.type === 'car_owner' && (
                                <p className="text-[#9dabb9] text-xs">
                                  {(app.data as CarOwnerApplication).vehicle_make}{' '}
                                  {(app.data as CarOwnerApplication).vehicle_model}
                                </p>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-sm">
                              <p className="text-white">{email}</p>
                              <p className="text-[#9dabb9]">{phone}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-[#9dabb9] text-sm">{formatDate(app.created_at)}</span>
                          </td>
                          <td className="py-3 px-4">{getStatusBadge(app.status || 'pending')}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 text-primary hover:text-primary hover:bg-primary/10"
                                onClick={() => {
                                  setSelectedApplication(app);
                                  setDialogOpen(true);
                                }}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Application Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-[#1c242c] border-[#283039] text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Application Details</DialogTitle>
            <DialogDescription className="text-[#9dabb9]">
              Review application and update status
            </DialogDescription>
          </DialogHeader>

          {selectedApplication && (
            <div className="space-y-6">
              {/* Application Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    {getTypeIcon(selectedApplication.type)}
                    {getTypeLabel(selectedApplication.type)} Application
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-[#9dabb9]" />
                      <span className="text-[#9dabb9]">Submitted:</span>
                      <span className="text-white">{formatDate(selectedApplication.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-[#9dabb9]">Status:</span>
                      {getStatusBadge(selectedApplication.status || 'pending')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Application Details */}
              <div className="border-t border-[#283039] pt-4">
                <h4 className="text-white font-bold mb-4">Application Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedApplication.type === 'car_owner' && (
                    <>
                      <div>
                        <p className="text-[#9dabb9] text-sm">Full Name</p>
                        <p className="text-white">{(selectedApplication.data as CarOwnerApplication).full_name}</p>
                      </div>
                      <div>
                        <p className="text-[#9dabb9] text-sm">Email</p>
                        <p className="text-white">{(selectedApplication.data as CarOwnerApplication).email}</p>
                      </div>
                      <div>
                        <p className="text-[#9dabb9] text-sm">Phone</p>
                        <p className="text-white">{(selectedApplication.data as CarOwnerApplication).phone}</p>
                      </div>
                      <div>
                        <p className="text-[#9dabb9] text-sm">Location</p>
                        <p className="text-white">{(selectedApplication.data as CarOwnerApplication).location}</p>
                      </div>
                      <div>
                        <p className="text-[#9dabb9] text-sm">Vehicle</p>
                        <p className="text-white">
                          {(selectedApplication.data as CarOwnerApplication).vehicle_year}{' '}
                          {(selectedApplication.data as CarOwnerApplication).vehicle_make}{' '}
                          {(selectedApplication.data as CarOwnerApplication).vehicle_model}
                        </p>
                      </div>
                      {(selectedApplication.data as CarOwnerApplication).expectations && (
                        <div className="md:col-span-2">
                          <p className="text-[#9dabb9] text-sm">Expectations</p>
                          <p className="text-white">{(selectedApplication.data as CarOwnerApplication).expectations}</p>
                        </div>
                      )}
                    </>
                  )}

                  {selectedApplication.type === 'chauffeur' && (
                    <>
                      <div>
                        <p className="text-[#9dabb9] text-sm">Full Name</p>
                        <p className="text-white">{(selectedApplication.data as ChauffeurApplication).full_name}</p>
                      </div>
                      <div>
                        <p className="text-[#9dabb9] text-sm">Email</p>
                        <p className="text-white">{(selectedApplication.data as ChauffeurApplication).email}</p>
                      </div>
                      <div>
                        <p className="text-[#9dabb9] text-sm">Phone</p>
                        <p className="text-white">{(selectedApplication.data as ChauffeurApplication).phone}</p>
                      </div>
                      {(selectedApplication.data as ChauffeurApplication).years_experience && (
                        <div>
                          <p className="text-[#9dabb9] text-sm">Years of Experience</p>
                          <p className="text-white">
                            {(selectedApplication.data as ChauffeurApplication).years_experience}
                          </p>
                        </div>
                      )}
                      {(selectedApplication.data as ChauffeurApplication).license_number && (
                        <div>
                          <p className="text-[#9dabb9] text-sm">License Number</p>
                          <p className="text-white">
                            {(selectedApplication.data as ChauffeurApplication).license_number}
                          </p>
                        </div>
                      )}
                      {(selectedApplication.data as ChauffeurApplication).why_luxeride && (
                        <div className="md:col-span-2">
                          <p className="text-[#9dabb9] text-sm">Why LuxeRide</p>
                          <p className="text-white">{(selectedApplication.data as ChauffeurApplication).why_luxeride}</p>
                        </div>
                      )}
                    </>
                  )}

                  {selectedApplication.type === 'corporate' && (
                    <>
                      <div>
                        <p className="text-[#9dabb9] text-sm">Company Name</p>
                        <p className="text-white">{(selectedApplication.data as CorporateApplication).company_name}</p>
                      </div>
                      <div>
                        <p className="text-[#9dabb9] text-sm">Contact Name</p>
                        <p className="text-white">{(selectedApplication.data as CorporateApplication).contact_name}</p>
                      </div>
                      <div>
                        <p className="text-[#9dabb9] text-sm">Contact Email</p>
                        <p className="text-white">{(selectedApplication.data as CorporateApplication).contact_email}</p>
                      </div>
                      <div>
                        <p className="text-[#9dabb9] text-sm">Contact Phone</p>
                        <p className="text-white">{(selectedApplication.data as CorporateApplication).contact_phone}</p>
                      </div>
                      {(selectedApplication.data as CorporateApplication).expectations && (
                        <div className="md:col-span-2">
                          <p className="text-[#9dabb9] text-sm">Expectations</p>
                          <p className="text-white">{(selectedApplication.data as CorporateApplication).expectations}</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Profile Photo for Chauffeur */}
              {selectedApplication.type === 'chauffeur' && profilePhotoUrl && (
                <div className="border-t border-[#283039] pt-4">
                  <h4 className="text-white font-bold mb-4">Profile Photo</h4>
                  <div className="flex gap-4">
                    <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-[#283039]">
                      <img
                        src={profilePhotoUrl}
                        alt="Profile"
                        className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => window.open(profilePhotoUrl, '_blank')}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-[#9dabb9] text-sm mb-2">Click image to view full size</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(profilePhotoUrl, '_blank')}
                        className="border-[#283039] text-white hover:bg-[#111418]"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Vehicle Images for Car Owner */}
              {selectedApplication.type === 'car_owner' && 
               (selectedApplication.data as CarOwnerApplication).vehicle_images && 
               (selectedApplication.data as CarOwnerApplication).vehicle_images!.length > 0 && (
                <div className="border-t border-[#283039] pt-4">
                  <h4 className="text-white font-bold mb-4">Vehicle Photos</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {(selectedApplication.data as CarOwnerApplication).vehicle_images!.map((path, index) => (
                      <div
                        key={index}
                        className="relative aspect-video rounded-lg overflow-hidden border border-[#283039] group cursor-pointer"
                        onClick={() => vehicleImageUrls[path] && window.open(vehicleImageUrls[path], '_blank')}
                      >
                        {vehicleImageUrls[path] ? (
                          <img
                            src={vehicleImageUrls[path]}
                            alt={`Vehicle ${index + 1}`}
                            className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                          />
                        ) : (
                          <div className="w-full h-full bg-[#111418] flex items-center justify-center">
                            <FileText className="h-8 w-8 text-[#9dabb9]" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <Download className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Categorized Documents for Chauffeur */}
              {selectedApplication.type === 'chauffeur' && 
               (selectedApplication.data as ChauffeurApplication).documents_categorized && (
                <div className="border-t border-[#283039] pt-4">
                  <h4 className="text-white font-bold mb-4">Required Documents</h4>
                  <div className="space-y-4">
                    {Object.entries((selectedApplication.data as ChauffeurApplication).documents_categorized || {}).map(([category, paths]) => {
                      if (!paths || paths.length === 0) return null;
                      
                      const categoryLabels: { [key: string]: string } = {
                        license_front: 'License (Front)',
                        license_back: 'License (Back)',
                        cv: 'CV / Resume',
                        passport: 'Passport Photo',
                      };

                      return (
                        <div key={category} className="space-y-2">
                          <h5 className="text-white font-medium text-sm">{categoryLabels[category] || category}</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {paths.map((path, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-[#111418] rounded-lg border border-[#283039]"
                              >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                                  <div className="min-w-0">
                                    <p className="text-white text-sm font-medium truncate">
                                      {path.split('/').pop() || `${categoryLabels[category]} ${index + 1}`}
                                    </p>
                                    <p className="text-[#9dabb9] text-xs">Click to view</p>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    const urls = categorizedDocUrls[category];
                                    if (urls && urls[path]) {
                                      window.open(urls[path], '_blank');
                                    }
                                  }}
                                  className="text-primary hover:text-primary hover:bg-primary/10 flex-shrink-0 ml-2"
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* General Documents (for backward compatibility and other document types) */}
              {selectedApplication.data.document_paths && selectedApplication.data.document_paths.length > 0 && (
                <div className="border-t border-[#283039] pt-4">
                  <h4 className="text-white font-bold mb-4">Additional Documents</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedApplication.data.document_paths.map((path, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-[#111418] rounded-lg border border-[#283039]"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-primary" />
                          <div>
                            <p className="text-white text-sm font-medium">
                              {path.split('/').pop() || `Document ${index + 1}`}
                            </p>
                            <p className="text-[#9dabb9] text-xs">Click to download</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (documentUrls[path]) {
                              window.open(documentUrls[path], '_blank');
                            }
                          }}
                          className="text-primary hover:text-primary hover:bg-primary/10"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Review Actions */}
              {selectedApplication.status !== 'approved' && selectedApplication.status !== 'rejected' && (
                <div className="border-t border-[#283039] pt-4">
                  <h4 className="text-white font-bold mb-4">Review & Decision</h4>
                  <Textarea
                    placeholder="Add review notes (optional)..."
                    value={reviewNote}
                    onChange={(e) => setReviewNote(e.target.value)}
                    className="mb-4 bg-[#111418] border-[#283039] text-white placeholder:text-[#9dabb9] min-h-[100px]"
                  />
                  <div className="flex gap-3">
                    <Button
                      onClick={() => updateApplicationStatus('under_review')}
                      disabled={updatingStatus}
                      className="flex-1 bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30 border border-yellow-500/30"
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Mark Under Review
                    </Button>
                    <Button
                      onClick={() => updateApplicationStatus('approved')}
                      disabled={updatingStatus}
                      className="flex-1 bg-green-500/20 text-green-500 hover:bg-green-500/30 border border-green-500/30"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => updateApplicationStatus('rejected')}
                      disabled={updatingStatus}
                      className="flex-1 bg-red-500/20 text-red-500 hover:bg-red-500/30 border border-red-500/30"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="border-[#283039] text-white">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

