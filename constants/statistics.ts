export interface ChartData {
    label: string;
    withinPolicy: number;
    overPolicy: number;
  }
  
  export interface Transaction {
    id: string;
    title: string;
    category: string;
    amount: number;
    status: 'approved' | 'pending' | 'rejected';
    date: string;
    icon: string;
    currency: string;
  }
  
  export interface MetricData {
    totalSubmitted: number;
    totalApproved: number;
    policyViolations: number;
  }
  
  export const WEEKLY_DATA: ChartData[] = [
    { label: 'Mon', withinPolicy: 120, overPolicy: 30 },
    { label: 'Tue', withinPolicy: 200, overPolicy: 45 },
    { label: 'Wed', withinPolicy: 80, overPolicy: 60 },
    { label: 'Thu', withinPolicy: 300, overPolicy: 25 },
    { label: 'Fri', withinPolicy: 150, overPolicy: 80 },
    { label: 'Sat', withinPolicy: 400, overPolicy: 20 },
    { label: 'Sun', withinPolicy: 100, overPolicy: 15 },
  ];
  
  export const MONTHLY_DATA: ChartData[] = [
    { label: 'Week 1', withinPolicy: 1200, overPolicy: 200 },
    { label: 'Week 2', withinPolicy: 1500, overPolicy: 300 },
    { label: 'Week 3', withinPolicy: 900, overPolicy: 450 },
    { label: 'Week 4', withinPolicy: 1800, overPolicy: 150 },
  ];
  
  export const YEARLY_DATA: ChartData[] = [
    { label: 'Jan', withinPolicy: 5000, overPolicy: 800 },
    { label: 'Feb', withinPolicy: 4800, overPolicy: 600 },
    { label: 'Mar', withinPolicy: 6200, overPolicy: 900 },
    { label: 'Apr', withinPolicy: 5500, overPolicy: 700 },
    { label: 'May', withinPolicy: 7000, overPolicy: 1100 },
    { label: 'Jun', withinPolicy: 6800, overPolicy: 950 },
  ];
  
  // Weekly transactions (last 7 days)
  export const WEEKLY_TRANSACTIONS: Transaction[] = [
    {
      id: 'w1',
      title: 'Coffee Meeting with Client',
      category: 'Meals',
      amount: 45.50,
      status: 'approved',
      date: '2025-07-15',
      icon: 'utensils',
      currency: '₹',
    },
    {
      id: 'w2',
      title: 'Taxi to Airport',
      category: 'Travel',
      amount: 85.00,
      status: 'pending',
      date: '2025-07-14',
      icon: 'plane',
      currency: '₹',
    },
    {
      id: 'w3',
      title: 'Office Stationery',
      category: 'Office',
      amount: 125.75,
      status: 'approved',
      date: '2025-07-13',
      icon: 'briefcase',
      currency: '₹',
    },
    {
      id: 'w4',
      title: 'Software License',
      category: 'Technology',
      amount: 299.00,
      status: 'rejected',
      date: '2025-07-12',
      icon: 'laptop',
      currency: '₹',
    },
    {
      id: 'w5',
      title: 'Team Lunch',
      category: 'Meals',
      amount: 180.25,
      status: 'approved',
      date: '2025-07-11',
      icon: 'utensils',
      currency: '₹',
    },
  ];
  
  // Monthly transactions (last 30 days)
  export const MONTHLY_TRANSACTIONS: Transaction[] = [
    {
      id: 'm1',
      title: 'Business Trip to Mumbai',
      category: 'Travel',
      amount: 2250.75,
      status: 'approved',
      date: '2025-07-10',
      icon: 'plane',
      currency: '₹',
    },
    {
      id: 'm2',
      title: 'Conference Registration',
      category: 'Training',
      amount: 1500.00,
      status: 'approved',
      date: '2025-07-08',
      icon: 'graduation-cap',
      currency: '₹',
    },
    {
      id: 'm3',
      title: 'Hotel Accommodation',
      category: 'Travel',
      amount: 3200.00,
      status: 'pending',
      date: '2025-07-05',
      icon: 'plane',
      currency: '₹',
    },
    {
      id: 'm4',
      title: 'Client Entertainment',
      category: 'Meals',
      amount: 850.50,
      status: 'approved',
      date: '2025-07-03',
      icon: 'utensils',
      currency: '₹',
    },
    {
      id: 'm5',
      title: 'Marketing Materials',
      category: 'Office',
      amount: 675.25,
      status: 'rejected',
      date: '2025-07-01',
      icon: 'briefcase',
      currency: '₹',
    },
  ];
  
  // Yearly transactions (last 12 months)
  export const YEARLY_TRANSACTIONS: Transaction[] = [
    {
      id: 'y1',
      title: 'Annual Software Licenses',
      category: 'Technology',
      amount: 15000.00,
      status: 'approved',
      date: '2025-06-15',
      icon: 'laptop',
      currency: '₹',
    },
    {
      id: 'y2',
      title: 'International Conference',
      category: 'Training',
      amount: 25000.00,
      status: 'approved',
      date: '2025-05-20',
      icon: 'graduation-cap',
      currency: '₹',
    },
    {
      id: 'y3',
      title: 'Office Renovation',
      category: 'Office',
      amount: 45000.00,
      status: 'pending',
      date: '2025-04-10',
      icon: 'briefcase',
      currency: '₹',
    },
    {
      id: 'y4',
      title: 'Team Building Retreat',
      category: 'Travel',
      amount: 18500.00,
      status: 'approved',
      date: '2025-03-25',
      icon: 'plane',
      currency: '₹',
    },
    {
      id: 'y5',
      title: 'Marketing Campaign',
      category: 'Office',
      amount: 32000.00,
      status: 'rejected',
      date: '2025-02-14',
      icon: 'briefcase',
      currency: '₹',
    },
  ];
  
  // Weekly metrics
  export const WEEKLY_METRICS: MetricData = {
    totalSubmitted: 735.50,
    totalApproved: 551.50,
    policyViolations: 2,
  };
  
  // Monthly metrics
  export const MONTHLY_METRICS: MetricData = {
    totalSubmitted: 8476.50,
    totalApproved: 6801.25,
    policyViolations: 8,
  };
  
  // Yearly metrics
  export const YEARLY_METRICS: MetricData = {
    totalSubmitted: 135500.00,
    totalApproved: 108500.00,
    policyViolations: 24,
  };