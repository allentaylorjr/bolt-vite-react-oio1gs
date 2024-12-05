import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/auth/registration';
import { createSlug, isValidSlug } from '../utils/slugUtils';
import { checkSlugAvailability } from '../services/churchService';
import { debounce } from '../utils/debounce';

const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    churchName: '',
    slug: '',
  });

  const checkSlug = debounce(async (slug: string) => {
    if (!slug || !isValidSlug(slug)) {
      setSlugAvailable(false);
      return;
    }

    const available = await checkSlugAvailability(slug);
    setSlugAvailable(available);
  }, 500);

  React.useEffect(() => {
    if (formData.slug) {
      checkSlug(formData.slug);
    }
  }, [formData.slug]);

  const handleChurchNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = createSlug(name);
    setFormData(prev => ({ ...prev, churchName: name, slug }));
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const slug = createSlug(e.target.value);
    setFormData(prev => ({ ...prev, slug }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!slugAvailable) {
      setError('Please choose a different URL');
      setLoading(false);
      return;
    }

    try {
      await registerUser(formData.email, formData.password, {
        name: formData.churchName,
        slug: formData.slug,
        subdomain: formData.slug
      });

      navigate('/login', { 
        state: { 
          message: 'Registration successful! Please check your email to verify your account.' 
        }
      });
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto pt-16 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Create Your Account</h1>
      <div className="bg-white p-8 rounded-lg shadow-md">
        {error && (
          <div className="mb-6 p-4 text-sm text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Church Name
            </label>
            <input
              type="text"
              value={formData.churchName}
              onChange={handleChurchNameChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
              maxLength={100}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Church URL
            </label>
            <div className="flex rounded-md shadow-sm">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                sermonhub.com/
              </span>
              <input
                type="text"
                value={formData.slug}
                onChange={handleSlugChange}
                className={`flex-1 rounded-none rounded-r-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${
                  slugAvailable === false ? 'border-red-300' : 
                  slugAvailable === true ? 'border-green-300' : ''
                }`}
                required
                pattern="[a-z0-9-]+"
                maxLength={50}
                title="Only lowercase letters, numbers, and hyphens are allowed"
              />
            </div>
            {formData.slug && (
              <p className={`mt-1 text-sm ${
                slugAvailable === false ? 'text-red-600' :
                slugAvailable === true ? 'text-green-600' : 'text-gray-500'
              }`}>
                {slugAvailable === false ? 'This URL is not available' :
                 slugAvailable === true ? 'URL is available' : 'Checking availability...'}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
              minLength={6}
              maxLength={72}
            />
            <p className="mt-1 text-sm text-gray-500">
              Must be at least 6 characters long
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || slugAvailable === false}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;