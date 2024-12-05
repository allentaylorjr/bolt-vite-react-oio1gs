import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Users, Globe } from 'lucide-react';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center py-24">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Share Your Message with the World
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              A modern platform for churches to host and share their sermons
            </p>
            <Link
              to="/register"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center"
            >
              Get Started
              <span className="ml-2">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Play className="w-8 h-8 text-blue-600" />}
            title="Easy Uploads"
            description="Upload and manage your sermons with just a few clicks"
          />
          <FeatureCard
            icon={<Users className="w-8 h-8 text-blue-600" />}
            title="Team Management"
            description="Collaborate with your church team seamlessly"
          />
          <FeatureCard
            icon={<Globe className="w-8 h-8 text-blue-600" />}
            title="Global Reach"
            description="Share your message with believers worldwide"
          />
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-3">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default Home;