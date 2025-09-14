import React, { useEffect, useState } from "react";
import AdminSidebar from "../components/ui/AdminSidebar";
import { supabase } from "../lib/supabaseClient";
import clsx from "clsx";
import ManageUsers from "./ManageUsers";
import ManageDrivers from "./ManageDrivers";
import ManageVehicles from "./ManageVehicles";
import Bookings from "./Bookings";
import Earnings from "./Earnings";
import Feedback from "./Feedback";
import Approvals from "./Approvals";
import AdminApplications from "./AdminApplications";

// DashboardCard Component
interface DashboardCardProps {
  icon: string;
  color: string;
  label: string;
  value: number;
  subtitle: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ icon, color, label, value, subtitle }) => {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    indigo: "bg-indigo-100 text-indigo-600",
    purple: "bg-purple-100 text-purple-600",
    pink: "bg-pink-100 text-pink-600",
    red: "bg-red-100 text-red-600",
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={clsx("p-3 rounded-lg", colorClasses[color as keyof typeof colorClasses])}>
          <span className="material-icons">{icon}</span>
        </div>
        <span className="text-sm text-gray-500">{subtitle}</span>
      </div>
      <h3 className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</h3>
      <p className="text-sm text-gray-600 mt-1">{label}</p>
    </div>
  );
};

// Main Dashboard Content Component
const DashboardContent: React.FC = () => {
  // Types
  type Activity = {
    id: string;
    icon: string;
    color: string;
    user: string;
    action: string;
    time: string;
  };
  
  type Vehicle = {
    id: string;
    name: string;
    owner: string;
    driver: string;
    status: string;
    amenities: string;
    last_maintenance: string;
  };

  type Application = {
    id: string;
    type: string;
    status: string;
    applicant_name: string;
    email: string;
    phone: string;
    documents?: any;
    created_at: string;
  };
  
  // State
  const [activityLogs, setActivityLogs] = useState<Activity[]>([]);
  const [applications, setApplications] = useState({ carOwner: 0, chauffeur: 0, corporate: 0 });
  const [partners, setPartners] = useState<Vehicle[]>([]);
  const [stats, setStats] = useState({ 
    users: 0, 
    drivers: 0, 
    vehicles: 0, 
    trips: 0, 
    payments: 0, 
    feedback: 0 
  });
  const [recentApplications, setRecentApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all data
  const fetchDashboardData = async () => {
    try {
      // Dashboard metrics with proper count queries
      const [usersRes, driversRes, vehiclesRes, tripsRes, paymentsRes, feedbackRes] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("drivers").select("*", { count: "exact", head: true }),
        supabase.from("vehicles").select("*", { count: "exact", head: true }),
        supabase.from("bookings").select("*", { count: "exact", head: true }),
        supabase.from("payments").select("*", { count: "exact", head: true }),
        supabase.from("feedback").select("*", { count: "exact", head: true })
      ]);

      setStats({
        users: usersRes.count || 0,
        drivers: driversRes.count || 0,
        vehicles: vehiclesRes.count || 0,
        trips: tripsRes.count || 0,
        payments: paymentsRes.count || 0,
        feedback: feedbackRes.count || 0,
      });

      // Partner Portal - Vehicles with driver info
      const { data: vehicleData } = await supabase
        .from("vehicles")
        .select(`
          id,
          make,
          model,
          year,
          license_plate,
          status,
          amenities,
          last_maintenance,
          driver_id
        `)
        .order("created_at", { ascending: false })
        .limit(10);

      if (vehicleData) {
        const formattedVehicles = vehicleData.map((v: any) => ({
          id: v.id,
          name: `${v.make || ''} ${v.model || ''} ${v.year || ''}`.trim() || 'Unknown Vehicle',
          owner: "LuxRide Fleet",
          driver: v.driver_id || "Unassigned",
          status: v.status || "Inactive",
          amenities: v.amenities || "Standard",
          last_maintenance: v.last_maintenance ? new Date(v.last_maintenance).toLocaleDateString() : "N/A"
        }));
        setPartners(formattedVehicles);
      }

      // Applications count
      const [carOwnerApps, chauffeurApps, corporateApps] = await Promise.all([
        supabase.from("partner_applications").select("*", { count: "exact", head: true }).eq("type", "car_owner").eq("status", "pending"),
        supabase.from("driver_applications").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("corporate_accounts").select("*", { count: "exact", head: true }).eq("status", "pending")
      ]);

      setApplications({
        carOwner: carOwnerApps.count || 0,
        chauffeur: chauffeurApps.count || 0,
        corporate: corporateApps.count || 0,
      });

      // Recent applications with documents
      const { data: recentApps } = await supabase
        .from("partner_applications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      if (recentApps) {
        setRecentApplications(recentApps);
      }

      // Activity Logs - Create from recent bookings
      const { data: recentBookings } = await supabase
        .from("bookings")
        .select(`
          id,
          status,
          created_at,
          user_id
        `)
        .order("created_at", { ascending: false })
        .limit(10);

      if (recentBookings) {
        const activities = recentBookings.map((booking: any) => ({
          id: booking.id,
          icon: booking.status === "completed" ? "check_circle" : "schedule",
          color: booking.status === "completed" ? "green" : "blue",
          user: "User",
          action: `Booking ${booking.status}`,
          time: new Date(booking.created_at).toLocaleTimeString()
        }));
        setActivityLogs(activities);
      }

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Set up realtime subscriptions
  useEffect(() => {
    fetchDashboardData();

    // Realtime subscription for new applications
    const applicationsChannel = supabase
      .channel('applications-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'partner_applications' },
        () => {
          fetchDashboardData();
        }
      )
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'driver_applications' },
        () => {
          fetchDashboardData();
        }
      )
      .subscribe();

    // Realtime subscription for vehicles
    const vehiclesChannel = supabase
      .channel('vehicles-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'vehicles' },
        () => {
          fetchDashboardData();
        }
      )
      .subscribe();

    // Realtime subscription for bookings
    const bookingsChannel = supabase
      .channel('bookings-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'bookings' },
        () => {
          fetchDashboardData();
        }
      )
      .subscribe();

    // Cleanup subscriptions
    return () => {
      supabase.removeChannel(applicationsChannel);
      supabase.removeChannel(vehiclesChannel);
      supabase.removeChannel(bookingsChannel);
    };
  }, []);

  // Handle document view
  const handleViewDocument = (docUrl: string) => {
    window.open(docUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Real-time overview of your platform</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            Live Updates
          </div>
          <button className="flex items-center bg-white px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50">
            <span className="material-icons mr-2 text-yellow-500">light_mode</span>
            Light Mode
          </button>
          <div className="relative">
            <button className="p-2 bg-white rounded-full shadow-sm">
              <span className="material-icons text-gray-600">notifications</span>
            </button>
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
          </div>
          <img 
            alt="user photo" 
            className="w-10 h-10 rounded-full" 
            src="/placeholder.svg" 
          />
        </div>
      </header>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <DashboardCard icon="people" color="blue" label="Total Users" value={stats.users} subtitle="Active users" />
        <DashboardCard icon="sports_motorsports" color="green" label="Active Drivers" value={stats.drivers} subtitle="Verified" />
        <DashboardCard icon="directions_car" color="indigo" label="Vehicles" value={stats.vehicles} subtitle="In fleet" />
        <DashboardCard icon="map" color="purple" label="Total Trips" value={stats.trips} subtitle="All time" />
        <DashboardCard icon="payment" color="pink" label="Payments" value={stats.payments} subtitle="Processed" />
        <DashboardCard icon="feedback" color="red" label="Feedback" value={stats.feedback} subtitle="Reviews" />
      </div>

      {/* Applications Alert */}
      {(applications.carOwner > 0 || applications.chauffeur > 0 || applications.corporate > 0) && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="material-icons text-yellow-400">info</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                You have <strong>{applications.carOwner + applications.chauffeur + applications.corporate}</strong> pending applications:
                {applications.carOwner > 0 && ` ${applications.carOwner} car owner,`}
                {applications.chauffeur > 0 && ` ${applications.chauffeur} chauffeur,`}
                {applications.corporate > 0 && ` ${applications.corporate} corporate`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Applications with Documents */}
      {recentApplications.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-bold mb-4">Recent Applications</h2>
          <div className="space-y-4">
            {recentApplications.map((app) => (
              <div key={app.id} className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{app.applicant_name}</p>
                    <p className="text-sm text-gray-600">{app.email} • {app.phone}</p>
                    <p className="text-xs text-gray-500">Applied: {new Date(app.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      app.status === 'approved' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {app.status}
                    </span>
                    {app.documents && (
                      <button
                        onClick={() => handleViewDocument(app.documents)}
                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                      >
                        <span className="material-icons text-sm mr-1">description</span>
                        View Docs
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Partner Portal */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Partner Portal</h2>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
            <span className="material-icons mr-2">add</span>
            Add Partner
          </button>
        </div>
        <div className="relative flex items-center mb-4">
          <span className="material-icons absolute left-3 text-gray-400">search</span>
          <input 
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
            placeholder="Search cars, owners, drivers..." 
            type="text" 
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-500 uppercase text-sm border-b">
                <th className="py-3 px-4">Vehicle</th>
                <th className="py-3 px-4">Owner</th>
                <th className="py-3 px-4">Driver</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Amenities</th>
                <th className="py-3 px-4">Last Maintenance</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {partners.length > 0 ? (
                partners.map((car) => (
                  <tr key={car.id} className="border-t hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{car.name}</td>
                    <td className="py-3 px-4">{car.owner}</td>
                    <td className="py-3 px-4">{car.driver}</td>
                    <td className="py-3 px-4">
                      <span className={car.status === "Active" 
                        ? "bg-green-100 text-green-800 py-1 px-3 rounded-full text-xs font-semibold" 
                        : "bg-gray-100 text-gray-800 py-1 px-3 rounded-full text-xs font-semibold"}>
                        {car.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">{car.amenities}</td>
                    <td className="py-3 px-4">{car.last_maintenance}</td>
                    <td className="py-3 px-4">
                      <button className="text-blue-600 hover:text-blue-800">
                        <span className="material-icons text-sm">edit</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="border-t">
                  <td className="text-center py-10 text-gray-500" colSpan={7}>
                    <span className="material-icons text-4xl mb-2">directions_car</span>
                    <p>No vehicles registered yet</p>
                    <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                      Add First Vehicle
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

// User type definition
interface User {
  id: string;
  email: string;
  full_name?: string;
  role?: string;
  created_at: string;
}

// Driver type definition
interface Driver {
  id: string;
  full_name: string;
  email: string;
  license_number?: string;
  vehicle_id?: string;
  status?: string;
  rating?: number;
  total_trips?: number;
  created_at: string;
}

// Users Management Content
const UsersContent: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      setUsers(data || []);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  return (
    <>
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Manage Users</h1>
          <p className="text-gray-600 mt-2">View and manage platform users</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
          <span className="material-icons mr-2">person_add</span>
          Add User
        </button>
      </header>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="relative flex items-center mb-4">
          <span className="material-icons absolute left-3 text-gray-400">search</span>
          <input className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Search users..." type="text" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-500 uppercase text-sm border-b">
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Joined</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-8">Loading...</td></tr>
              ) : users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id} className="border-t hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{user.full_name || 'N/A'}</td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">
                      <span className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full text-xs font-semibold">
                        {user.role || 'user'}
                      </span>
                    </td>
                    <td className="py-3 px-4">{new Date(user.created_at).toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      <span className="bg-green-100 text-green-800 py-1 px-3 rounded-full text-xs font-semibold">Active</span>
                    </td>
                    <td className="py-3 px-4">
                      <button className="text-blue-600 hover:text-blue-800 mr-2">
                        <span className="material-icons text-sm">edit</span>
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        <span className="material-icons text-sm">block</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={6} className="text-center py-8 text-gray-500">No users found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

// Drivers Management Content
const DriversContent: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrivers = async () => {
      const { data } = await supabase.from('drivers').select('*').order('created_at', { ascending: false });
      setDrivers(data || []);
      setLoading(false);
    };
    fetchDrivers();
  }, []);

  return (
    <>
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Manage Drivers</h1>
          <p className="text-gray-600 mt-2">Manage driver profiles and status</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
          <span className="material-icons mr-2">person_add</span>
          Add Driver
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <DashboardCard icon="verified" color="green" label="Active Drivers" value={drivers.filter(d => d.status === 'active').length} subtitle="Currently active" />
        <DashboardCard icon="pending" color="yellow" label="Pending Approval" value={drivers.filter(d => d.status === 'pending').length} subtitle="Awaiting review" />
        <DashboardCard icon="star" color="blue" label="Top Rated" value={drivers.filter(d => d.rating >= 4.5).length} subtitle="4.5+ rating" />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="relative flex items-center mb-4">
          <span className="material-icons absolute left-3 text-gray-400">search</span>
          <input className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Search drivers..." type="text" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-500 uppercase text-sm border-b">
                <th className="py-3 px-4">Driver</th>
                <th className="py-3 px-4">License</th>
                <th className="py-3 px-4">Vehicle</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Trips</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="text-center py-8">Loading...</td></tr>
              ) : drivers.length > 0 ? (
                drivers.map((driver) => (
                  <tr key={driver.id} className="border-t hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{driver.full_name}</p>
                        <p className="text-sm text-gray-500">{driver.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">{driver.license_number || 'N/A'}</td>
                    <td className="py-3 px-4">{driver.vehicle_id ? 'Assigned' : 'Unassigned'}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <span className="material-icons text-yellow-500 text-sm">star</span>
                        <span className="ml-1">{driver.rating || '0.0'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">{driver.total_trips || 0}</td>
                    <td className="py-3 px-4">
                      <span className={`py-1 px-3 rounded-full text-xs font-semibold ${
                        driver.status === 'active' ? 'bg-green-100 text-green-800' :
                        driver.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {driver.status || 'inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button className="text-blue-600 hover:text-blue-800 mr-2">
                        <span className="material-icons text-sm">edit</span>
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        <span className="material-icons text-sm">block</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={7} className="text-center py-8 text-gray-500">No drivers registered yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

// Vehicles Management Content
const VehiclesContent: React.FC = () => (
  <>
    <header className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Manage Vehicles</h1>
        <p className="text-gray-600 mt-2">Fleet management and vehicle tracking</p>
      </div>
      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
        <span className="material-icons mr-2">add</span>
        Add Vehicle
      </button>
    </header>
    <ManageVehicles />
  </>
);

// Trips Content
const TripsContent: React.FC = () => (
  <>
    <header className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Bookings & Trips</h1>
        <p className="text-gray-600 mt-2">Monitor and manage all bookings</p>
      </div>
      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
        <span className="material-icons mr-2">add</span>
        New Booking
      </button>
    </header>
    <Bookings />
  </>
);

// Payments Content
const PaymentsContent: React.FC = () => (
  <>
    <header className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Payments & Earnings</h1>
        <p className="text-gray-600 mt-2">Financial transactions and reports</p>
      </div>
      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
        <span className="material-icons mr-2">download</span>
        Export Report
      </button>
    </header>
    <Earnings />
  </>
);

// Feedback Content
const FeedbackContent: React.FC = () => (
  <>
    <header className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Customer Feedback</h1>
        <p className="text-gray-600 mt-2">Reviews and ratings from customers</p>
      </div>
    </header>
    <Feedback />
  </>
);

// Partner Portal Content
const PartnerPortalContent: React.FC = () => (
  <>
    <header className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Partner Portal</h1>
        <p className="text-gray-600 mt-2">Manage partnerships and approvals</p>
      </div>
      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
        <span className="material-icons mr-2">add</span>
        Add Partner
      </button>
    </header>
    <Approvals />
  </>
);

// Applications Content
const ApplicationsContent: React.FC = () => (
  <>
    <header className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Applications</h1>
        <p className="text-gray-600 mt-2">Review and process new applications</p>
      </div>
    </header>
    <AdminApplications />
  </>
);

// Settings Content
const SettingsContent: React.FC = () => (
  <>
    <header className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Configure admin panel and system settings</p>
      </div>
    </header>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Profile Settings</h2>
        <p className="text-gray-600 mb-4">Manage your admin profile and preferences</p>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Edit Profile
        </button>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">System Configuration</h2>
        <p className="text-gray-600 mb-4">Configure system-wide settings</p>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          System Settings
        </button>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Security</h2>
        <p className="text-gray-600 mb-4">Manage security and access controls</p>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Security Settings
        </button>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Notifications</h2>
        <p className="text-gray-600 mb-4">Configure notification preferences</p>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Notification Settings
        </button>
      </div>
    </div>
  </>
);

// Main Admin Dashboard Component
const AdminDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState<string>('dashboard');

  // Render content based on active view
  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardContent />;
      case 'users':
        return <UsersContent />;
      case 'drivers':
        return <DriversContent />;
      case 'vehicles':
        return <VehiclesContent />;
      case 'trips':
        return <TripsContent />;
      case 'payments':
        return <PaymentsContent />;
      case 'feedback':
        return <FeedbackContent />;
      case 'partner-portal':
        return <PartnerPortalContent />;
      case 'applications':
        return <ApplicationsContent />;
      case 'settings':
        return <SettingsContent />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 text-gray-800 font-inter">
      <AdminSidebar activeView={activeView} onViewChange={setActiveView} />
      <main className="flex-1 p-8 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminDashboard;
