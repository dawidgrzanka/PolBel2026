import AdminManagerComponent from '@/components/AdminManager';

export default function AdminManagerPage() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-black mb-8">Zarządzanie Zespołem</h1>
        <AdminManagerComponent />
      </div>
    </div>
  );
}