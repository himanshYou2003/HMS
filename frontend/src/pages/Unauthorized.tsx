// src/pages/Unauthorized.tsx
import Layout from '../components/Layout';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <Layout>
      <div className="text-center py-20">
        <h1 className="text-4xl font-bold text-accent-beige mb-4">401 - Unauthorized</h1>
        <p className="text-lg text-accent-beige/80 mb-8">
          You don't have permission to access this page.
        </p>
        <Link
          to="/"
          className="bg-primary-sageGreen text-accent-beige px-6 py-3 rounded-md hover:bg-primary-oceanTeal transition-colors"
        >
          Return to Home
        </Link>
      </div>
    </Layout>
  );
};

export default Unauthorized;