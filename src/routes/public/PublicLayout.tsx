import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import AdSlot from './AdSlot';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <AdSlot className="py-6" />
      <Footer />
    </div>
  );
}
