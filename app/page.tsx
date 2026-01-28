import { Home } from '@/components/Home';

export default function Page() {
  console.log(process.env.VERCEL_BRANCH_URL);
  return <Home />;
}
