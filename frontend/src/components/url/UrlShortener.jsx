import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createShortUrl } from '../../store/features/urlSlice';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const UrlShortener = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.url);
  const navigate = useNavigate();
  const [urlData, setUrlData] = useState({
    longUrl: '',
    customAlias: '',
    expirationDate: ''
  });

  const handleChange = (e) => {
    setUrlData({
      ...urlData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Clean up empty fields
    const cleanData = { ...urlData };
    if (!cleanData.customAlias.trim()) {
      delete cleanData.customAlias;
    }
    if (!cleanData.expirationDate) {
      delete cleanData.expirationDate;
    }
  
    try {
      const result = await dispatch(createShortUrl(cleanData)).unwrap();
      if (result) {
        toast.success('URL shortened successfully!');
        setUrlData({
          longUrl: '',
          customAlias: '',
          expirationDate: ''
        });
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to shorten URL');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Shorten Your URL</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="longUrl" className="block text-sm font-medium text-gray-700">
            Long URL
          </label>
          <input
            type="url"
            id="longUrl"
            name="longUrl"
            required
            value={urlData.longUrl}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="https://example.com/very-long-url"
          />
        </div>

        <div>
          <label htmlFor="customAlias" className="block text-sm font-medium text-gray-700">
            Custom Alias (Optional)
          </label>
          <input
            type="text"
            id="customAlias"
            name="customAlias"
            value={urlData.customAlias}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="my-custom-url"
          />
        </div>

        <div>
          <label htmlFor="expirationDate" className="block text-sm font-medium text-gray-700">
            Expiration Date (Optional)
          </label>
          <input
            type="datetime-local"
            id="expirationDate"
            name="expirationDate"
            value={urlData.expirationDate}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {loading ? 'Shortening...' : 'Shorten URL'}
        </button>
      </form>
    </div>
  );
};

export default UrlShortener;