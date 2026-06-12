import { useState, useEffect } from 'react';
import { Bell, MapPin, Briefcase, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { subscribeToJobAlerts, getJobAlerts, deleteJobAlert } from '../api/jobAlertsApi';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/layout/DashboardLayout';

const JobAlertsPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [formData, setFormData] = useState({
    jobTitle: '',
    location: '',
    frequency: 'daily'
  });

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await getJobAlerts();
      if (response.success) {
        setAlerts(response.data);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load job alerts.');
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!formData.jobTitle || !formData.location) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await subscribeToJobAlerts(formData);
      if (response.success) {
        toast.success('Job alert created successfully!');
        setFormData({ jobTitle: '', location: '', frequency: 'daily' });
        fetchAlerts();
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to create alert.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await deleteJobAlert(id);
      if (response.success) {
        toast.success('Alert removed');
        setAlerts(alerts.filter(a => a._id !== id));
      }
    } catch (error) {
      toast.error('Failed to delete alert.');
    }
  };

  return (
    <DashboardLayout title="Job Alerts">
        <div className="mx-auto max-w-4xl p-6 lg:p-8">
          <header className="mb-8">
            <h1 className="text-[28px] font-bold text-text-primary tracking-tight font-display flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-teal/10">
                <Bell className="h-5 w-5 text-accent-teal" />
              </div>
              Job Alerts
            </h1>
            <p className="mt-2 text-[15px] text-text-secondary max-w-2xl">
              Never miss an opportunity. Set up automated job alerts tailored to your target roles and locations.
            </p>
          </header>

          <div className="grid gap-8 md:grid-cols-[1fr_300px]">
            {/* Create Alert Form */}
            <div className="rounded-2xl border border-border-subtle bg-bg-surface p-6 shadow-sm">
              <h2 className="text-[16px] font-semibold text-text-primary mb-6 flex items-center gap-2">
                <Plus className="h-4 w-4 text-accent-violet" />
                Create New Alert
              </h2>
              
              <form onSubmit={handleSubscribe} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[13px] font-medium text-text-secondary">Job Title / Keywords</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                    <input
                      type="text"
                      className="w-full rounded-xl border border-border-subtle bg-bg-base py-2.5 pl-10 pr-4 text-[14px] text-text-primary placeholder:text-text-muted focus:border-accent-violet focus:outline-none focus:ring-1 focus:ring-accent-violet transition-colors"
                      placeholder="e.g. Frontend Engineer, Product Manager"
                      value={formData.jobTitle}
                      onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[13px] font-medium text-text-secondary">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                    <input
                      type="text"
                      className="w-full rounded-xl border border-border-subtle bg-bg-base py-2.5 pl-10 pr-4 text-[14px] text-text-primary placeholder:text-text-muted focus:border-accent-violet focus:outline-none focus:ring-1 focus:ring-accent-violet transition-colors"
                      placeholder="e.g. Remote, San Francisco, London"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[13px] font-medium text-text-secondary">Frequency</label>
                  <select
                    className="w-full rounded-xl border border-border-subtle bg-bg-base py-2.5 px-4 text-[14px] text-text-primary focus:border-accent-violet focus:outline-none focus:ring-1 focus:ring-accent-violet transition-colors appearance-none"
                    value={formData.frequency}
                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                  >
                    <option value="daily">Daily Digest</option>
                    <option value="weekly">Weekly Digest</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-xl bg-accent-violet py-3 text-[14px] font-semibold text-white transition hover:bg-accent-violet/90 active:scale-[0.98] disabled:opacity-70 flex justify-center items-center gap-2"
                >
                  {isLoading ? 'Setting up...' : 'Subscribe to Alerts'}
                </button>
              </form>
            </div>

            {/* Active Alerts List */}
            <div className="space-y-4">
              <h2 className="text-[14px] font-semibold text-text-secondary uppercase tracking-wider font-display mb-4">Your Active Alerts</h2>
              
              {isFetching ? (
                <div className="animate-pulse space-y-3">
                  {[1, 2].map(i => (
                    <div key={i} className="h-24 rounded-xl bg-bg-surface border border-border-subtle"></div>
                  ))}
                </div>
              ) : alerts.length === 0 ? (
                <div className="rounded-xl border border-border-subtle bg-bg-surface border-dashed p-6 text-center">
                  <Bell className="mx-auto h-8 w-8 text-text-muted mb-3 opacity-50" />
                  <p className="text-[14px] text-text-secondary">No active alerts yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {alerts.map((alert, index) => (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      key={alert._id}
                      className="group relative rounded-xl border border-border-subtle bg-bg-surface p-4 transition hover:border-accent-violet/50"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-text-primary text-[15px]">{alert.jobTitle}</h3>
                          <div className="mt-1 flex items-center gap-3 text-[12px] text-text-secondary">
                            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {alert.location}</span>
                            <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-accent-teal" /> {alert.frequency}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDelete(alert._id)}
                          className="rounded-lg p-1.5 text-text-muted hover:bg-red-500/10 hover:text-red-400 transition"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
    </DashboardLayout>
  );
};

export default JobAlertsPage;
