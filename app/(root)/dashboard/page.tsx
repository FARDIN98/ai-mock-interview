/**
 * Dashboard Page Component
 * 
 * This page serves as the main dashboard for authenticated users.
 * It redirects to the root page which contains the actual dashboard content.
 */

import { redirect } from 'next/navigation';

const DashboardPage = () => {
  // Redirect to the root page which contains the dashboard content
  redirect('/');
  
  // This return statement is unreachable due to the redirect,
  // but is included to satisfy TypeScript's requirement for a return value
  return null;
};

export default DashboardPage;