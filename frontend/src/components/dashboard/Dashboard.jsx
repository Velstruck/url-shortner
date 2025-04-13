import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchUrls, getUrlAnalytics, clearSelectedAnalytics } from '../../store/features/urlSlice';
import { Line, Pie, Bar } from 'react-chartjs-2';
import { toast } from 'react-hot-toast';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const { urls, selectedUrlAnalytics, loading } = useSelector((state) => state.url);

  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const urlsPerPage = 5;

  useEffect(() => {
    dispatch(fetchUrls());
  }, [dispatch]);

  const handleViewAnalytics = (shortId) => {
    dispatch(getUrlAnalytics(shortId));
  };

  const handleClearAnalytics = () => {
    dispatch(clearSelectedAnalytics());
  };

  const handleCopy = (url) => {
    navigator.clipboard.writeText(url);
    toast.success('Copied to clipboard!');
  };

  const formatDate = (date) => {
    if (!date) return 'No Expiry';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); 
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const getChartData = () => {
    if (!selectedUrlAnalytics?.analytics?.clicksOverTime) return null;

    const dates = selectedUrlAnalytics.analytics.clicksOverTime.map(entry => entry.date);
    const clicks = selectedUrlAnalytics.analytics.clicksOverTime.map(entry => entry.clicks);

    return {
      labels: dates,
      datasets: [
        {
          label: 'Clicks Over Time',
          data: clicks,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.3
        }
      ]
    };
  };

  const getDeviceChartData = () => {
    if (!selectedUrlAnalytics?.analytics?.deviceDistribution) return null;

    const labels = selectedUrlAnalytics.analytics.deviceDistribution.map(entry => entry.device);
    const data = selectedUrlAnalytics.analytics.deviceDistribution.map(entry => entry.count);

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 206, 86, 0.8)'
          ]
        }
      ]
    };
  };

  const getBrowserChartData = () => {
    if (!selectedUrlAnalytics?.analytics?.browserStats) return null;

    const labels = Object.keys(selectedUrlAnalytics.analytics.browserStats);
    const data = Object.values(selectedUrlAnalytics.analytics.browserStats);

    return {
      labels,
      datasets: [
        {
          label: 'Browser Stats',
          data,
          backgroundColor: 'rgba(153, 102, 255, 0.6)'
        }
      ]
    };
  };

  const filteredUrls = urls.filter(url => url.longUrl.toLowerCase().includes(search.toLowerCase()));
  const totalPages = Math.ceil(filteredUrls.length / urlsPerPage);
  const paginatedUrls = filteredUrls.slice((currentPage - 1) * urlsPerPage, currentPage * urlsPerPage);

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">URL Analytics Dashboard</h1>
        <Link
          to="/"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Shorten New URL
        </Link>
      </div>

      <input
        type="text"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
        placeholder="Search by original URL..."
        className="w-full md:w-1/2 p-2 mb-4 border border-gray-300 rounded-md"
      />

      <div className="overflow-x-auto bg-white rounded-lg shadow mb-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase">Original URL</th>
              <th className="px-4 py-2 text-left text-xs  text-gray-500 uppercase">Short URL</th>
              <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase">Copy</th>
              <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase">Clicks</th>
              <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase">Created</th>
              <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase">Expiry</th>
              <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase">Actions</th>
              <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase">QR Code</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedUrls.map((url) => (
              <tr key={url.shortId}>
                <td className="px-4 py-2 text-sm text-gray-900 max-w-xs truncate">{url.longUrl}</td>
                <td className="px-4 py-2 text-sm text-blue-600 flex items-center gap-2">
                  <a
                    href={`${import.meta.env.VITE_API_BASE_URL}/${url.shortId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {url.shortId}
                  </a>
                </td>
                <td className="px-4 py-2 text-sm text-gray-900 max-w-xs truncate">
                  <button
                    onClick={() => handleCopy(`${import.meta.env.VITE_API_BASE_URL}/${url.shortId}`)}
                    className="text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-md"
                  >📋</button>
                </td>
                <td className="px-6 py-2 text-sm text-gray-900">{url.clicks}</td>
                <td className="px-4 py-2 text-sm text-gray-900 ">{formatDate(url.createdAt)}</td>
                <td className="px-4 py-2 text-sm text-gray-900">{formatDate(url.expirationDate)}</td>
                <td className="px-4 py-2 text-sm">
                  <button
                    onClick={() => handleViewAnalytics(url.shortId)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    View Analytics
                  </button>
                </td>
                <td className="px-4 py-2 text-sm text-gray-900">
                  <a
                    href={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${import.meta.env.VITE_API_BASE_URL}/${url.shortId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Click Here
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mb-6 gap-2">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {selectedUrlAnalytics && getChartData() && getDeviceChartData() && getBrowserChartData() && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button
              onClick={handleClearAnalytics}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Clear Analytics
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Clicks Over Time</h2>
              <Line
                data={getChartData()}
                options={{
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: (context) => `Clicks: ${context.parsed.y}`
                      }
                    }
                  }
                }}
              />
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Device Distribution</h2>
              <Pie data={getDeviceChartData()} />
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Browser Stats</h2>
              <Bar data={getBrowserChartData()} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;