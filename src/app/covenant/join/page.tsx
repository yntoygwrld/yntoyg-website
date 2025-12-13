import { redirect } from 'next/navigation';

// Redirect old join page to new unified login page
export default function CovenantJoin() {
  redirect('/covenant/login');
}
