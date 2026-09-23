"use client";
import AdminListings from "../listings/page";
// The Submissions page shares exact functionality with Listings but can be filtered by 'pending' in a real app.
// Since CityNest instantly approves public listings currently, we just reuse the Listings manager here as an audit log for submissions.
export default function AdminSubmissions() {
  return <AdminListings />;
}
