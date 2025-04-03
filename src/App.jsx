import React, { useState } from 'react';
import { Sun, Moon, Download, Send, ChevronLeft, ChevronRight, History, Settings, Bookmark } from 'lucide-react';
import { JsonViewer } from '@textea/json-viewer';
import * as XLSX from 'xlsx';

function App() {
  const [theme, setTheme] = useState('dark');
  const [url, setUrl] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  const [selectedPath, setSelectedPath] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState({});

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(url);
      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelection = (key) => {
    setSelectedKeys((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const downloadExcel = () => {
    if (!response) return;
    let selectedData = {};
    Object.keys(selectedKeys).forEach((key) => {
      if (selectedKeys[key]) {
        selectedData[key] = response[key];
      }
    });
    if (!Array.isArray(selectedData)) {
      selectedData = [selectedData];
    }
    const ws = XLSX.utils.json_to_sheet(selectedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Selected Data");
    XLSX.writeFile(wb, "exported-data.xlsx");
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className={`p-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">API Explorer</h1>
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Left Sidebar */}
        {/* <div className={`
          ${leftSidebarOpen ? 'w-64' : 'w-0'}
          transition-all duration-300
          ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}
          min-h-[calc(100vh-64px)]
          relative
        `}>
          {leftSidebarOpen && (
            <div className="p-4">
              <div className="space-y-4">
                <button className={`w-full p-2 rounded ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} flex items-center gap-2`}>
                  <History size={16} /> History
                </button>
                <button className={`w-full p-2 rounded ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} flex items-center gap-2`}>
                  <Bookmark size={16} /> Bookmarks
                </button>
                <button className={`w-full p-2 rounded ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} flex items-center gap-2`}>
                  <Settings size={16} /> Settings
                </button>
              </div>
            </div>
          )}
          <button
            onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
            className={`absolute -right-6 top-1/2 transform -translate-y-1/2 p-1 rounded-full
              ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            {leftSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div> */}

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter API URL"
                className={`flex-1 p-3 rounded-lg ${
                  theme === 'dark' 
                    ? 'bg-gray-800 border-gray-700 focus:border-blue-500' 
                    : 'bg-white border-gray-300 focus:border-blue-400'
                } border-2 outline-none`}
              />
              <button
                onClick={fetchData}
                disabled={loading}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  theme === 'dark'
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-blue-500 hover:bg-blue-600'
                } text-white`}
              >
                <Send size={20} />
                {loading ? 'Loading...' : 'Send'}
              </button>
            </div>
          </div>

          {error && (
            <div className={`p-4 rounded-lg mb-4 ${
              theme === 'dark' ? 'bg-red-900/50' : 'bg-red-100'
            } text-red-500`}>
              {error}
            </div>
          )}

          {response && (
            <div className={`p-4 rounded-lg ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } shadow-lg`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Response</h2>
                <button
                  onClick={downloadExcel}
                  disabled={!selectedPath.length}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                    theme === 'dark'
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-green-500 hover:bg-green-600'
                  } text-white ${!selectedPath.length && 'opacity-50 cursor-not-allowed'}`}
                >
                  <Download size={20} />
                  Export to Excel
                </button>
              </div>
              <JsonViewer
                value={response}
                theme={theme === 'dark' ? 'dark' : 'light'}
                displayDataTypes={false}
                enableClipboard={true}
                onSelect={(select) => setSelectedPath(select.namespace)}
                style={{ 
                  backgroundColor: 'transparent',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                }}
              />
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className={`
          ${rightSidebarOpen ? 'w-64' : 'w-0'}
          transition-all duration-300
          ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}
          min-h-[calc(100vh-64px)]
          relative
        `}>
          {rightSidebarOpen && (
            <div className="p-4">
              <h3 className="font-semibold mb-2">Selected Keys</h3>
              {selectedPath.length > 0 ? (
                <div className={`p-2 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  {selectedPath.join(' > ')}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  Click on any Keys in the response to select it for export
                </p>
              )}
            </div>
          )}
          <button
            onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
            className={`absolute -left-6 top-1/2 transform -translate-y-1/2 p-1 rounded-full
              ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            {rightSidebarOpen ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>

          {rightSidebarOpen && response && (
            <div className="p-4">
              <h3 className="font-semibold mb-2">Select Properties</h3>
              <div className="space-y-2">
                {Object.keys(response).map((key) => (
                  <div key={key} className="flex items-center gap-2">
                    <input type="checkbox" id={key} checked={selectedKeys[key] || false} 
                      onChange={() => toggleSelection(key)} className="cursor-pointer" />
                    <label htmlFor={key} className="cursor-pointer">{key}</label>
                  </div>
                ))}
              </div>
              <button onClick={downloadExcel} disabled={!Object.values(selectedKeys).some(Boolean)}
                className="mt-4 px-4 py-2 rounded-lg bg-green-500 text-white ${!Object.values(selectedKeys).some(Boolean) ? 'opacity-50 cursor-not-allowed' : ''}">
                <Download size={20} /> Export to Excel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;