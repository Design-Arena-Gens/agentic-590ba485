import Nav from '@/components/Nav';
import LoginCard from '@/components/auth/LoginCard';

export default function Page() {
  return (
    <div className="container space-y-6">
      <Nav />
      <section className="card max-w-md mx-auto mt-10">
        <LoginCard />
      </section>
    </div>
  );
}
